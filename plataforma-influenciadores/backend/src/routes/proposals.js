const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// Listar propostas de uma campanha ou de um criador
router.get('/', async (req, res) => {
  const { campaign_id, creator_id } = req.query;
  let sql = `
    SELECT p.*, c.title as campaign_title, c.niche as campaign_niche,
           u_emp.name as company_name, u_cri.name as creator_name, u_cri.avatar as creator_avatar
    FROM proposals p
    JOIN campaigns c ON p.campaign_id = c.id
    JOIN users u_emp ON c.company_id = u_emp.id
    JOIN users u_cri ON p.creator_id = u_cri.id
    WHERE 1=1
  `;
  const params = [];

  if (campaign_id) {
    sql += ` AND p.campaign_id = ?`;
    params.push(campaign_id);
  }
  if (creator_id) {
    sql += ` AND p.creator_id = ?`;
    params.push(creator_id);
  }

  sql += ` ORDER BY p.created_at DESC`;

  try {
    const list = await all(sql, params);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar candidatura / proposta (RF-005, RN-001)
router.post('/', async (req, res) => {
  const { campaign_id, creator_id, pitch, proposed_gross } = req.body;

  if (!campaign_id || !creator_id || !pitch || !proposed_gross) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: campaign_id, creator_id, pitch e proposed_gross.' });
  }

  try {
    // Checar se campanha existe e está aberta
    const camp = await get(`SELECT * FROM campaigns WHERE id = ?`, [campaign_id]);
    if (!camp) {
      return res.status(404).json({ error: 'Campanha não encontrada.' });
    }
    if (camp.status !== 'aberta') {
      return res.status(400).json({ error: 'Esta campanha não está aceitando novas candidaturas.' });
    }

    // Checar se já enviou proposta
    const existing = await get(`SELECT id FROM proposals WHERE campaign_id = ? AND creator_id = ?`, [campaign_id, creator_id]);
    if (existing) {
      return res.status(400).json({ error: 'Você já enviou uma proposta para esta campanha.' });
    }

    const gross = Number(proposed_gross);
    // RN-001: 12.5% de retenção
    const fee = Number((gross * 0.125).toFixed(2));
    const net = Number((gross - fee).toFixed(2));

    const result = await run(`
      INSERT INTO proposals (campaign_id, creator_id, pitch, proposed_gross, proposed_net, status)
      VALUES (?, ?, ?, ?, ?, 'pendente')
    `, [campaign_id, creator_id, pitch, gross, net]);

    const created = await get(`SELECT * FROM proposals WHERE id = ?`, [result.id]);
    res.status(201).json({
      ...created,
      platform_fee: fee,
      message: `Proposta enviada com sucesso! Valor bruto: R$ ${gross.toFixed(2)}, comissão (12,5%): R$ ${fee.toFixed(2)}, valor líquido que você receberá: R$ ${net.toFixed(2)}.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aceitar proposta e gerar minuta de contrato (RF-007, RN-001, RN-004)
router.post('/:id/accept', async (req, res) => {
  const proposalId = req.params.id;

  try {
    const prop = await get(`SELECT * FROM proposals WHERE id = ?`, [proposalId]);
    if (!prop) {
      return res.status(404).json({ error: 'Proposta não encontrada.' });
    }

    const camp = await get(`SELECT * FROM campaigns WHERE id = ?`, [prop.campaign_id]);
    if (!camp) {
      return res.status(404).json({ error: 'Campanha vinculada não encontrada.' });
    }

    // Atualiza status da proposta aceita
    await run(`UPDATE proposals SET status = 'aceita' WHERE id = ?`, [proposalId]);
    // Rejeita outras propostas da mesma campanha
    await run(`UPDATE proposals SET status = 'recusada' WHERE campaign_id = ? AND id != ?`, [prop.campaign_id, proposalId]);

    // Atualiza status da campanha
    await run(`UPDATE campaigns SET status = 'em_andamento' WHERE id = ?`, [camp.id]);

    const gross = prop.proposed_gross;
    const fee = Number((gross * 0.125).toFixed(2));
    const net = Number((gross - fee).toFixed(2));

    // Criação do contrato digital (RF-007, RN-004)
    const contractScope = `Campanha: ${camp.title}\nBriefing: ${camp.description}\nRequisitos: ${camp.requirements}\nTermos de Cessão e LGPD: O Contratado cede os direitos patrimoniais de exibição do conteúdo produzido para a Contratante, em conformidade com as diretrizes da LGPD (Lei nº 13.709/2018).`;

    const contractResult = await run(`
      INSERT INTO contracts (campaign_id, company_id, creator_id, proposal_id, title, scope, gross_amount, platform_fee, net_amount, status, company_signed_at, lgpd_accepted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'aguardando_assinaturas', CURRENT_TIMESTAMP, 1)
    `, [camp.id, camp.company_id, prop.creator_id, prop.id, `Contrato de Campanha - ${camp.title}`, contractScope, gross, fee, net]);

    const createdContract = await get(`SELECT * FROM contracts WHERE id = ?`, [contractResult.id]);
    res.json({
      message: 'Proposta aceita e minuta de contrato formalizada com sucesso!',
      contract: createdContract
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
