const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// Listar todos os influenciadores com filtros de nicho e busca (RF-006)
router.get('/', async (req, res) => {
  const { niche, search } = req.query;
  let sql = `SELECT id, name, email, role, document, phone, bio, niche, followers_count, engagement_rate, avatar FROM users WHERE role = 'contratado'`;
  const params = [];

  if (niche) {
    sql += ` AND niche LIKE ?`;
    params.push(`%${niche}%`);
  }
  if (search) {
    sql += ` AND (name LIKE ? OR bio LIKE ? OR niche LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += ` ORDER BY engagement_rate DESC, followers_count DESC`;

  try {
    const creators = await all(sql, params);

    // Anexar contagem de portfólio e média de avaliações
    const enriched = await Promise.all(creators.map(async (c) => {
      const portCount = await get(`SELECT COUNT(*) as total FROM portfolios WHERE user_id = ?`, [c.id]);
      const ratingInfo = await get(`SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE target_id = ?`, [c.id]);
      return {
        ...c,
        portfolio_count: portCount ? portCount.total : 0,
        average_rating: ratingInfo && ratingInfo.avg_rating ? Number(ratingInfo.avg_rating.toFixed(1)) : 5.0,
        review_count: ratingInfo ? ratingInfo.review_count : 0
      };
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detalhes de um influenciador específico e seus itens de portfólio (RF-002, RN-005)
router.get('/:id', async (req, res) => {
  try {
    const creator = await get(`SELECT id, name, email, role, document, phone, bio, niche, followers_count, engagement_rate, avatar FROM users WHERE id = ? AND role = 'contratado'`, [req.params.id]);
    if (!creator) {
      return res.status(404).json({ error: 'Criador de conteúdo não encontrado.' });
    }

    const portfolio = await all(`SELECT * FROM portfolios WHERE user_id = ? ORDER BY created_at DESC`, [creator.id]);
    const reviews = await all(`
      SELECT r.*, u.name as author_name, u.avatar as author_avatar
      FROM reviews r
      JOIN users u ON r.author_id = u.id
      WHERE r.target_id = ?
      ORDER BY r.created_at DESC
    `, [creator.id]);

    const bank = await get(`SELECT bank_name, pix_key, pix_type FROM bank_accounts WHERE user_id = ?`, [creator.id]);

    res.json({
      ...creator,
      portfolio,
      reviews,
      bank_account: bank || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Adicionar item ao portfólio (RF-002, RN-005: limite de 5 vídeos)
router.post('/:id/portfolio', async (req, res) => {
  const { title, description, media_url, media_type, external_platform } = req.body;
  const userId = req.params.id;

  if (!title || !media_url) {
    return res.status(400).json({ error: 'Título e URL da mídia são obrigatórios.' });
  }

  try {
    // RN-005: Limite de no máximo 5 vídeos
    if (media_type === 'video') {
      const videoCount = await get(`SELECT COUNT(*) as count FROM portfolios WHERE user_id = ? AND media_type = 'video'`, [userId]);
      if (videoCount && videoCount.count >= 5) {
        return res.status(400).json({ error: 'Limite de portfólio atingido: A regra RN-005 autoriza no máximo 5 vídeos no portfólio.' });
      }
    }

    const result = await run(`
      INSERT INTO portfolios (user_id, title, description, media_url, media_type, external_platform)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userId, title, description || '', media_url, media_type || 'video', external_platform || 'Nativo']);

    const created = await get(`SELECT * FROM portfolios WHERE id = ?`, [result.id]);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
