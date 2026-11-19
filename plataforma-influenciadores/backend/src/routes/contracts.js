const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// Listar contratos (opcionalmente filtrados por usuário)
router.get('/', async (req, res) => {
  const { user_id, role } = req.query;
  let sql = `
    SELECT c.*,
           comp.name as company_name, comp.avatar as company_avatar,
           creat.name as creator_name, creat.avatar as creator_avatar,
           camp.title as campaign_title
    FROM contracts c
    JOIN users comp ON c.company_id = comp.id
    JOIN users creat ON c.creator_id = creat.id
    JOIN campaigns camp ON c.campaign_id = camp.id
    WHERE 1=1
  `;
  const params = [];

  if (user_id) {
    if (role === 'contratante') {
      sql += ` AND c.company_id = ?`;
      params.push(user_id);
    } else if (role === 'contratado') {
      sql += ` AND c.creator_id = ?`;
      params.push(user_id);
    } else {
      sql += ` AND (c.company_id = ? OR c.creator_id = ?)`;
      params.push(user_id, user_id);
    }
  }

  sql += ` ORDER BY c.created_at DESC`;

  try {
    const list = await all(sql, params);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detalhes completos do contrato com entregáveis, avaliações e disputas
router.get('/:id', async (req, res) => {
  try {
    const contract = await get(`
      SELECT c.*,
             comp.name as company_name, comp.email as company_email, comp.avatar as company_avatar,
             creat.name as creator_name, creat.email as creator_email, creat.avatar as creator_avatar,
             camp.title as campaign_title, camp.description as campaign_description
      FROM contracts c
      JOIN users comp ON c.company_id = comp.id
      JOIN users creat ON c.creator_id = creat.id
      JOIN campaigns camp ON c.campaign_id = camp.id
      WHERE c.id = ?
    `, [req.params.id]);

    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }

    const deliverables = await all(`SELECT * FROM deliverables WHERE contract_id = ? ORDER BY submitted_at DESC`, [contract.id]);
    const reviews = await all(`SELECT * FROM reviews WHERE contract_id = ?`, [contract.id]);
    const disputes = await all(`SELECT * FROM disputes WHERE contract_id = ?`, [contract.id]);

    res.json({
      ...contract,
      deliverables,
      reviews,
      disputes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assinatura digital do contrato (RF-007, RN-004)
router.post('/:id/sign', async (req, res) => {
  const { user_id, role, lgpd_consent } = req.body;
  const contractId = req.params.id;

  if (!lgpd_consent) {
    return res.status(400).json({ error: 'Para assinar o contrato é obrigatório o consentimento expresso da cláusula de Cessão de Direitos e LGPD (RN-004).' });
  }

  try {
    const contract = await get(`SELECT * FROM contracts WHERE id = ?`, [contractId]);
    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }

    if (role === 'contratante') {
      await run(`UPDATE contracts SET company_signed_at = CURRENT_TIMESTAMP WHERE id = ?`, [contractId]);
    } else if (role === 'contratado') {
      await run(`UPDATE contracts SET creator_signed_at = CURRENT_TIMESTAMP WHERE id = ?`, [contractId]);
    }

    const updated = await get(`SELECT * FROM contracts WHERE id = ?`, [contractId]);

    // Se ambos assinaram, transiciona para 'aguardando_escrow'
    if (updated.company_signed_at && updated.creator_signed_at) {
      await run(`UPDATE contracts SET status = 'aguardando_escrow' WHERE id = ?`, [contractId]);
    }

    const finalContract = await get(`SELECT * FROM contracts WHERE id = ?`, [contractId]);
    res.json({
      message: 'Assinatura digital registrada com carimbo de data e hora!',
      contract: finalContract
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aporte financeiro em custódia / Escrow (RF-008, RN-002)
router.post('/:id/escrow-deposit', async (req, res) => {
  const { payment_method } = req.body; // 'PIX', 'CARTAO_CREDITO'
  const contractId = req.params.id;

  try {
    const contract = await get(`SELECT * FROM contracts WHERE id = ?`, [contractId]);
    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }

    if (contract.status !== 'aguardando_escrow') {
      return res.status(400).json({ error: 'O contrato deve estar assinado por ambas as partes antes do aporte em custódia.' });
    }

    // Simula comunicação com gateway de pagamento PCI-DSS (EXT-01)
    await run(`
      UPDATE contracts
      SET status = 'em_execucao',
          escrow_deposited_at = CURRENT_TIMESTAMP,
          payment_method = ?
      WHERE id = ?
    `, [payment_method || 'PIX Instantâneo', contractId]);

    const updated = await get(`SELECT * FROM contracts WHERE id = ?`, [contractId]);
    res.json({
      message: `Aporte de R$ ${contract.gross_amount.toFixed(2)} retido com sucesso na conta de custódia (Escrow - RN-002). O criador está autorizado a iniciar a produção!`,
      contract: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submissão de entrega pelo criador (RF-009)
router.post('/:id/deliver', async (req, res) => {
  const { title, media_url, notes } = req.body;
  const contractId = req.params.id;

  if (!title || !media_url) {
    return res.status(400).json({ error: 'Título e URL da prévia/entrega do material são obrigatórios.' });
  }

  try {
    const contract = await get(`SELECT * FROM contracts WHERE id = ?`, [contractId]);
    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }

    if (contract.status !== 'em_execucao' && contract.status !== 'conteudo_enviado') {
      return res.status(400).json({ error: 'Entregas só podem ser realizadas para contratos em execução com valor retido em custódia.' });
    }

    const delivResult = await run(`
      INSERT INTO deliverables (contract_id, title, media_url, notes, status)
      VALUES (?, ?, ?, ?, 'pendente_revisao')
    `, [contractId, title, media_url, notes || '']);

    await run(`UPDATE contracts SET status = 'conteudo_enviado' WHERE id = ?`, [contractId]);

    const created = await get(`SELECT * FROM deliverables WHERE id = ?`, [delivResult.id]);
    res.status(201).json({
      message: 'Material entregue para homologação do contratante. Prazo de homologação iniciado (RN-002: até 10 dias para aprovação tácita).',
      deliverable: created
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aprovação de conteúdo e liberação financeira imediata (RF-011, RN-001, RN-002)
router.post('/:id/approve', async (req, res) => {
  const contractId = req.params.id;

  try {
    const contract = await get(`SELECT * FROM contracts WHERE id = ?`, [contractId]);
    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }

    // Atualiza entregáveis para aprovados
    await run(`UPDATE deliverables SET status = 'aprovado', approved_at = CURRENT_TIMESTAMP WHERE contract_id = ?`, [contractId]);

    // Transiciona status do contrato para liquidado
    await run(`UPDATE contracts SET status = 'aprovado_liquidado' WHERE id = ?`, [contractId]);

    // Atualiza status da campanha para encerrada
    await run(`UPDATE campaigns SET status = 'encerrada' WHERE id = ?`, [contract.campaign_id]);

    const updated = await get(`SELECT * FROM contracts WHERE id = ?`, [contractId]);

    res.json({
      message: `Conteúdo homologado com sucesso! Saldo em custódia de R$ ${contract.gross_amount.toFixed(2)} liquidado: R$ ${contract.net_amount.toFixed(2)} repassado ao criador e R$ ${contract.platform_fee.toFixed(2)} recolhido como taxa da plataforma (12,5% - RN-001).`,
      contract: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Solicitar revisão / ajuste de conteúdo
router.post('/:id/request-revision', async (req, res) => {
  const { revision_notes } = req.body;
  const contractId = req.params.id;

  if (!revision_notes) {
    return res.status(400).json({ error: 'Informe as notas e orientações para o ajuste do conteúdo.' });
  }

  try {
    await run(`
      UPDATE deliverables
      SET status = 'ajuste_solicitado', revision_notes = ?
      WHERE contract_id = ? AND status = 'pendente_revisao'
    `, [revision_notes, contractId]);

    await run(`UPDATE contracts SET status = 'em_execucao' WHERE id = ?`, [contractId]);

    res.json({ message: 'Solicitação de ajuste enviada ao criador de conteúdo.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
