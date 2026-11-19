const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// Listar avaliações recebidas por um usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const list = await all(`
      SELECT r.*, u.name as author_name, u.avatar as author_avatar, c.title as contract_title
      FROM reviews r
      JOIN users u ON r.author_id = u.id
      JOIN contracts c ON r.contract_id = c.id
      WHERE r.target_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.userId]);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar avaliação mútua (RF-010)
router.post('/', async (req, res) => {
  const { contract_id, author_id, target_id, rating, comment } = req.body;

  if (!contract_id || !author_id || !target_id || !rating) {
    return res.status(400).json({ error: 'Campos obrigatórios: contract_id, author_id, target_id e rating.' });
  }

  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'A nota de avaliação deve estar entre 1 e 5 estrelas.' });
  }

  try {
    // Verificar se contrato existe e está liquidado
    const contract = await get(`SELECT * FROM contracts WHERE id = ?`, [contract_id]);
    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }
    if (contract.status !== 'aprovado_liquidado') {
      return res.status(400).json({ error: 'Apenas contratos liquidados podem receber avaliação bilateral.' });
    }

    // Verificar se já avaliou
    const existing = await get(`SELECT id FROM reviews WHERE contract_id = ? AND author_id = ?`, [contract_id, author_id]);
    if (existing) {
      return res.status(400).json({ error: 'Você já submeteu sua avaliação para este contrato.' });
    }

    const result = await run(`
      INSERT INTO reviews (contract_id, author_id, target_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `, [contract_id, author_id, target_id, numericRating, comment || '']);

    const created = await get(`SELECT * FROM reviews WHERE id = ?`, [result.id]);
    res.status(201).json({
      message: 'Avaliação registrada com sucesso no perfil do usuário!',
      review: created
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
