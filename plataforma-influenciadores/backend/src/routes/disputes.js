const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// Listar disputas (para painel de suporte e auditoria)
router.get('/', async (req, res) => {
  try {
    const list = await all(`
      SELECT d.*, c.title as contract_title, c.gross_amount,
             u_open.name as opened_by_name, u_open.role as opened_by_role,
             u_res.name as resolved_by_name
      FROM disputes d
      JOIN contracts c ON d.contract_id = c.id
      JOIN users u_open ON d.opened_by = u_open.id
      LEFT JOIN users u_res ON d.resolved_by = u_res.id
      ORDER BY d.created_at DESC
    `);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Abertura de Disputa (RF-012, RN-003)
router.post('/', async (req, res) => {
  const { contract_id, opened_by, reason, description } = req.body;

  if (!contract_id || !opened_by || !reason || !description) {
    return res.status(400).json({ error: 'Campos obrigatórios: contract_id, opened_by, reason e description.' });
  }

  try {
    const contract = await get(`SELECT * FROM contracts WHERE id = ?`, [contract_id]);
    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }

    const disputeResult = await run(`
      INSERT INTO disputes (contract_id, opened_by, reason, description, status)
      VALUES (?, ?, ?, ?, 'aberta')
    `, [contract_id, opened_by, reason, description]);

    // Atualiza status do contrato para congelado em disputa
    await run(`UPDATE contracts SET status = 'em_disputa' WHERE id = ?`, [contract_id]);

    const created = await get(`SELECT * FROM disputes WHERE id = ?`, [disputeResult.id]);
    res.status(201).json({
      message: 'Disputa instaurada com sucesso. Os fundos em custódia foram bloqueados para mediação humana do Suporte Técnico (prazo limite: até 7 dias úteis - RN-003).',
      dispute: created
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolução de Disputa pelo Suporte Técnico (RF-012, RN-003)
router.post('/:id/resolve', async (req, res) => {
  const { resolution_status, resolution_notes, resolved_by } = req.body;
  const disputeId = req.params.id;

  // resolution_status: 'resolvida_reembolso_total' | 'resolvida_repasse_criador' | 'resolvida_acordo'
  if (!resolution_status || !resolution_notes || !resolved_by) {
    return res.status(400).json({ error: 'Campos obrigatórios: resolution_status, resolution_notes e resolved_by.' });
  }

  try {
    const dispute = await get(`SELECT * FROM disputes WHERE id = ?`, [disputeId]);
    if (!dispute) {
      return res.status(404).json({ error: 'Disputa não encontrada.' });
    }

    await run(`
      UPDATE disputes
      SET status = ?, resolution_notes = ?, resolved_by = ?, resolved_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [resolution_status, resolution_notes, resolved_by, disputeId]);

    // Ajusta o contrato dependendo do veredito da mediação
    if (resolution_status === 'resolvida_reembolso_total') {
      await run(`UPDATE contracts SET status = 'cancelado' WHERE id = ?`, [dispute.contract_id]);
    } else if (resolution_status === 'resolvida_repasse_criador') {
      await run(`UPDATE contracts SET status = 'aprovado_liquidado' WHERE id = ?`, [dispute.contract_id]);
    } else {
      await run(`UPDATE contracts SET status = 'aprovado_liquidado' WHERE id = ?`, [dispute.contract_id]);
    }

    const updated = await get(`SELECT * FROM disputes WHERE id = ?`, [disputeId]);
    res.json({
      message: 'Disputa mediada e encerrada com sucesso pelo Suporte Técnico.',
      dispute: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
