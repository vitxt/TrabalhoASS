const { initDB, run, all } = require('./database');

async function seed() {
  console.log('Inicializando banco de dados...');
  await initDB();

  // Limpa dados anteriores se existirem
  await run(`DELETE FROM disputes;`);
  await run(`DELETE FROM reviews;`);
  await run(`DELETE FROM deliverables;`);
  await run(`DELETE FROM contracts;`);
  await run(`DELETE FROM proposals;`);
  await run(`DELETE FROM campaigns;`);
  await run(`DELETE FROM portfolios;`);
  await run(`DELETE FROM bank_accounts;`);
  await run(`DELETE FROM users;`);

  console.log('Populando Usuários...');
  // 1. Usuários
  await run(`
    INSERT INTO users (id, name, email, password, role, document, phone, bio, niche, followers_count, engagement_rate, avatar) VALUES
    (1, 'TechCorp Brasil', 'contato@techcorp.com.br', 'senha123', 'contratante', '12.345.678/0001-90', '(11) 98765-4321', 'Líder em periféricos gamers e hardware de alto desempenho.', 'Tecnologia / Hardware', 150000, 4.2, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150'),
    (2, 'ModaViva Cosméticos', 'marketing@modaviva.com.br', 'senha123', 'contratante', '98.765.432/0001-11', '(21) 97654-3210', 'Marca vegana e sustentável de skincare e beleza.', 'Moda & Beleza', 85000, 5.1, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150'),
    (3, 'Vitor Teodoro', 'vitor@criador.com.br', 'senha123', 'contratado', '123.456.789-00', '(44) 99111-2233', 'Criador de conteúdo focado em reviews de tecnologia, setups e desenvolvimento de software.', 'Tecnologia / Software', 45000, 6.8, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
    (4, 'Arthur Spirandelli', 'arthur@criador.com.br', 'senha123', 'contratado', '234.567.890-11', '(44) 99222-3344', 'Streamer de jogos competitivos, análises de periféricos gamer e vlogs tech.', 'Games & Lifestyle', 92000, 7.4, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'),
    (5, 'Mariana Silva', 'mariana@criador.com.br', 'senha123', 'contratado', '345.678.901-22', '(11) 99333-4455', 'Especialista em beleza limpa, skincare e dicas de rotina saudável.', 'Moda & Beleza', 120000, 5.9, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
    (6, 'Suporte Técnico UEM', 'suporte@plataforma.com.br', 'admin123', 'suporte', '00.000.000/0001-00', '(44) 3011-4040', 'Equipe oficial de auditoria, conciliação e mediação de disputas da plataforma.', 'Operações & Jurídico', 0, 0.0, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150');
  `);

  // 2. Dados Bancários
  await run(`
    INSERT INTO bank_accounts (user_id, bank_name, agency, account_number, pix_key, pix_type) VALUES
    (3, 'Nubank (260)', '0001', '1234567-8', 'vitor@criador.com.br', 'EMAIL'),
    (4, 'Banco Inter (077)', '0001', '8765432-1', 'arthur@criador.com.br', 'EMAIL'),
    (5, 'Banco do Brasil (001)', '1234-5', '98765-4', 'mariana@criador.com.br', 'EMAIL');
  `);

  // 3. Portfólios (RN-005)
  await run(`
    INSERT INTO portfolios (user_id, title, description, media_url, media_type, external_platform) VALUES
    (3, 'Review do Teclado Mecânico RGB', 'Análise detalhada de switches ópticos e durabilidade (15 min).', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'video', 'YouTube'),
    (3, 'Setup Tour 2026', 'Apresentação completa do ambiente de trabalho com iluminação e monitores.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'video', 'YouTube'),
    (4, 'Gameplay Competitiva & Patrocínio de Headset', 'Transmissão ao vivo com menção e unboxing do headset 7.1.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'video', 'Twitch'),
    (5, 'Rotina Matinal de Skincare Vegano', 'Reels com passo a passo de aplicação e benefícios com 80k visualizações.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'video', 'Instagram');
  `);

  // 4. Campanhas (RF-004)
  await run(`
    INSERT INTO campaigns (id, company_id, title, description, niche, budget_gross, deadline, requirements, status) VALUES
    (1, 1, 'Lançamento do Teclado Pro Wireless', 'Campanha de unboxing, vídeo de review dedicado e 2 posts nos Stories destacando baixa latência e bateria de 80h.', 'Tecnologia / Hardware', 3500.00, '2026-12-15', 'Mínimo de 30k seguidores, nicho de tech/gaming, engajamento > 4%. Gravação em resolução mínima 1080p60.', 'aberta'),
    (2, 1, 'Cobertura do Torneio Gamer 2026', 'Transmissão em live com inserção de banner e menção aos produtos da TechCorp.', 'Games & Lifestyle', 5000.00, '2026-12-20', 'Canal na Twitch ou YouTube com pico > 500 espectadores simultâneos.', 'aberta'),
    (3, 2, 'Campanha Sérum Facial Vitamina C', 'Criação de 1 vídeo formato Reels/TikTok com antes/depois e link afiliado na bio.', 'Moda & Beleza', 2200.00, '2026-12-10', 'Público feminino majoritário (>70%), compromisso com cosméticos veganos e sem testes em animais.', 'em_andamento');
  `);

  // 5. Propostas (RF-005, RN-001: 12.5% comissão)
  // Bruto: 3500 -> 12.5% = 437.50 -> Líquido: 3062.50
  await run(`
    INSERT INTO proposals (id, campaign_id, creator_id, pitch, proposed_gross, proposed_net, status) VALUES
    (1, 1, 3, 'Olá time TechCorp! Tenho canal focado exatamente em teclados mecânicos e periféricos. Já fiz mais de 20 reviews com excelente retenção.', 3500.00, 3062.50, 'pendente'),
    (2, 1, 4, 'Posso fazer a demonstração do teclado ao vivo em live na Twitch para mais de 1.200 pessoas simultâneas e publicar cortes no TikTok.', 3500.00, 3062.50, 'pendente'),
    (3, 3, 5, 'Adoraria representar o Sérum Vegano! Minhas seguidoras adoram dicas de rotina facial e dermocosméticos éticos.', 2200.00, 1925.00, 'aceita');
  `);

  // 6. Contratos (RF-007, RF-008, RN-001, RN-002)
  // Contrato 1: Ativo, pago em Escrow, com entrega submetida aguardando homologação
  await run(`
    INSERT INTO contracts (id, campaign_id, company_id, creator_id, proposal_id, title, scope, gross_amount, platform_fee, net_amount, status, company_signed_at, creator_signed_at, escrow_deposited_at, lgpd_accepted, payment_method) VALUES
    (1, 3, 2, 5, 3, 'Contrato de Campanha - Sérum Facial Vitamina C', 'Produção e publicação de 1 Reels de 60s no Instagram e 3 stories com link rastreado. Cessão de direitos autorais e de imagem para veiculação durante 90 dias.', 2200.00, 275.00, 1925.00, 'conteudo_enviado', '2026-11-10 10:00:00', '2026-11-10 11:30:00', '2026-11-10 14:00:00', 1, 'PIX Escrow'),
    (2, 1, 1, 3, 1, 'Minuta de Contrato - Teclado Pro Wireless', 'Unboxing de 10 minutos no YouTube demonstrando ergonomia, latência wireless e switches customizados.', 3500.00, 437.50, 3062.50, 'aguardando_assinaturas', '2026-11-16 14:00:00', NULL, NULL, 1, NULL);
  `);

  // 7. Entregas de Conteúdo (RF-009)
  await run(`
    INSERT INTO deliverables (id, contract_id, title, media_url, notes, status, submitted_at) VALUES
    (1, 1, 'Vídeo Reels - Demonstração do Sérum Vitamina C', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', 'Segue prévia do Reels gravado em 4k, com closed captions e demonstrando a textura e absorção do produto conforme briefing.', 'pendente_revisao', '2026-11-14 18:30:00');
  `);

  console.log('Seed concluído com sucesso!');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seed;
