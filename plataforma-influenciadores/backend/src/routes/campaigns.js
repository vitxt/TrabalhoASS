const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// Listar vagas/campanhas abertas ou com filtros (RF-004, RF-005)
router.get('/', async (req, res) => {
  const { status, niche } = req.query;
  let sql = `
    SELECT c.*, u.name as company_name, u.avatar as company_avatar
    FROM campaigns c
    JOIN users u ON c.company_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    sql += ` AND c.status = ?`;
    params.push(status);
  }
  if (niche) {
    sql += ` AND c.niche LIKE ?`;
    params.push(`%${niche}%`);
  }

  sql += ` ORDER BY c.created_at DESC`;

  try {
    const campaigns = await all(sql, params);

    // Enriquecer com contagem de propostas e valores líquidos calculados (RN-001)
    const enriched = await Promise.all(campaigns.map(async (camp) => {
      const propCount = await get(`SELECT COUNT(*) as count FROM proposals WHERE campaign_id = ?`, [camp.id]);
      const platformFee = Number((camp.budget_gross * 0.125).toFixed(2));
      const netBudget = Number((camp.budget_gross - platformFee).toFixed(2));
      return {
        ...camp,
        proposals_count: propCount ? propCount.count : 0,
        platform_fee: platformFee,
        net_budget_for_creator: netBudget
      };
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detalhes de uma campanha
router.get('/:id', async (req, res) => {
  try {
    const camp = await get(`
      SELECT c.*, u.name as company_name, u.avatar as company_avatar, u.bio as company_bio
      FROM campaigns c
      JOIN users u ON c.company_id = u.id
      WHERE c.id = ?
    `, [req.params.id]);

    if (!camp) {
      return res.status(404).json({ error: 'Campanha não encontrada.' });
    }

    const proposals = await all(`
      SELECT p.*, u.name as creator_name, u.avatar as creator_avatar, u.niche as creator_niche, u.followers_count as creator_followers
      FROM proposals p
      JOIN users u ON p.creator_id = u.id
      WHERE p.campaign_id = ?
      ORDER BY p.created_at DESC
    `, [camp.id]);

    const platformFee = Number((camp.budget_gross * 0.125).toFixed(2));
    const netBudget = Number((camp.budget_gross - platformFee).toFixed(2));

    res.json({
      ...camp,
      platform_fee: platformFee,
      net_budget_for_creator: netBudget,
      proposals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publicar nova campanha / vaga (RF-004)
router.post('/', async (req, res) => {
  const { company_id, title, description, niche, budget_gross, deadline, requirements } = req.body;

  if (!company_id || !title || !description || !niche || !budget_gross) {
    return res.status(400).json({ error: 'Campos obrigatórios: empresa, título, descrição, nicho e orçamento bruto.' });
  }

  try {
    const result = await run(`
      INSERT INTO campaigns (company_id, title, description, niche, budget_gross, deadline, requirements, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'aberta')
    `, [company_id, title, description, niche, budget_gross, deadline || 'A combinar', requirements || '']);

    const created = await get(`SELECT * FROM campaigns WHERE id = ?`, [result.id]);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
