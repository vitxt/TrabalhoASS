const express = require('express');
const router = express.Router();
const { get } = require('../database');

router.get('/', async (req, res) => {
  try {
    const contractsStat = await get(`
      SELECT
        COUNT(*) as total_contracts,
        SUM(gross_amount) as total_volume_gross,
        SUM(CASE WHEN status = 'aprovado_liquidado' THEN platform_fee ELSE 0 END) as total_platform_fees_earned,
        SUM(CASE WHEN status IN ('em_execucao', 'conteudo_enviado', 'em_disputa') THEN gross_amount ELSE 0 END) as total_escrow_locked,
        SUM(CASE WHEN status = 'aprovado_liquidado' THEN net_amount ELSE 0 END) as total_paid_to_creators
      FROM contracts
    `);

    const usersStat = await get(`
      SELECT
        COUNT(CASE WHEN role = 'contratante' THEN 1 END) as total_companies,
        COUNT(CASE WHEN role = 'contratado' THEN 1 END) as total_creators
      FROM users
    `);

    const campaignsStat = await get(`
      SELECT
        COUNT(*) as total_campaigns,
        COUNT(CASE WHEN status = 'aberta' THEN 1 END) as open_campaigns
      FROM campaigns
    `);

    res.json({
      metrics: {
        total_contracts: contractsStat.total_contracts || 0,
        total_volume_gross: contractsStat.total_volume_gross || 0,
        total_platform_fees_earned: contractsStat.total_platform_fees_earned || 0,
        total_escrow_locked: contractsStat.total_escrow_locked || 0,
        total_paid_to_creators: contractsStat.total_paid_to_creators || 0,
        total_companies: usersStat.total_companies || 0,
        total_creators: usersStat.total_creators || 0,
        total_campaigns: campaignsStat.total_campaigns || 0,
        open_campaigns: campaignsStat.open_campaigns || 0,
        commission_rate_percent: 12.5
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
