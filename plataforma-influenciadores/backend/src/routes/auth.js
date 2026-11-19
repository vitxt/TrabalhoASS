const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// Listar todos os usuários para alternância ágil de perfis / testes
router.get('/users', async (req, res) => {
  try {
    const users = await all(`SELECT id, name, email, role, document, phone, bio, niche, followers_count, engagement_rate, avatar FROM users ORDER BY id ASC`);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login simulado por e-mail ou seleção de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique o e-mail informado.' });
    }
    // Em produção usaria bcrypt.compare; para MVP acadêmico aceitamos senha cadastrada
    if (password && user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    const bank = await get(`SELECT * FROM bank_accounts WHERE user_id = ?`, [user.id]);
    res.json({
      message: 'Autenticado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        document: user.document,
        phone: user.phone,
        bio: user.bio,
        niche: user.niche,
        followers_count: user.followers_count,
        engagement_rate: user.engagement_rate,
        avatar: user.avatar,
        bank_account: bank || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cadastro (RF-001 e RF-003)
router.post('/register', async (req, res) => {
  const { name, email, password, role, document, phone, bio, niche, followers_count, engagement_rate, bank_name, agency, account_number, pix_key, pix_type } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: nome, e-mail, senha e tipo de conta.' });
  }

  try {
    const existing = await get(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existing) {
      return res.status(400).json({ error: 'E-mail já cadastrado na plataforma.' });
    }

    const avatar = role === 'contratante'
      ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    const result = await run(`
      INSERT INTO users (name, email, password, role, document, phone, bio, niche, followers_count, engagement_rate, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, email, password, role, document || '', phone || '', bio || '', niche || '', followers_count || 0, engagement_rate || 0.0, avatar]);

    const newUserId = result.id;

    if (role === 'contratado' && (pix_key || bank_name)) {
      await run(`
        INSERT INTO bank_accounts (user_id, bank_name, agency, account_number, pix_key, pix_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [newUserId, bank_name || '', agency || '', account_number || '', pix_key || '', pix_type || 'CHAVE_ALEATORIA']);
    }

    const createdUser = await get(`SELECT id, name, email, role, document, phone, bio, niche, followers_count, engagement_rate, avatar FROM users WHERE id = ?`, [newUserId]);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
