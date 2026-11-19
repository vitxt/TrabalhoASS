const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data.sqlite');
const db = new sqlite3.Database(dbPath);

// Helper wrappers for promises
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Initial database schema setup
const initDB = async () => {
  await run(`PRAGMA foreign_keys = ON;`);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('contratante', 'contratado', 'suporte')),
      document TEXT,
      phone TEXT,
      bio TEXT,
      niche TEXT,
      followers_count INTEGER DEFAULT 0,
      engagement_rate REAL DEFAULT 0.0,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      bank_name TEXT,
      agency TEXT,
      account_number TEXT,
      pix_key TEXT,
      pix_type TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      media_url TEXT NOT NULL,
      media_type TEXT CHECK(media_type IN ('video', 'image', 'link')),
      external_platform TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      niche TEXT NOT NULL,
      budget_gross REAL NOT NULL,
      deadline TEXT,
      requirements TEXT,
      status TEXT DEFAULT 'aberta' CHECK(status IN ('aberta', 'em_andamento', 'encerrada', 'cancelada')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      creator_id INTEGER NOT NULL,
      pitch TEXT NOT NULL,
      proposed_gross REAL NOT NULL,
      proposed_net REAL NOT NULL,
      status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'aceita', 'recusada')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS contracts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      company_id INTEGER NOT NULL,
      creator_id INTEGER NOT NULL,
      proposal_id INTEGER,
      title TEXT NOT NULL,
      scope TEXT NOT NULL,
      gross_amount REAL NOT NULL,
      platform_fee REAL NOT NULL,
      net_amount REAL NOT NULL,
      status TEXT DEFAULT 'aguardando_assinaturas' CHECK(status IN ('minuta', 'aguardando_assinaturas', 'aguardando_escrow', 'em_execucao', 'conteudo_enviado', 'aprovado_liquidado', 'em_disputa', 'cancelado')),
      company_signed_at DATETIME,
      creator_signed_at DATETIME,
      escrow_deposited_at DATETIME,
      lgpd_accepted INTEGER DEFAULT 1,
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
      FOREIGN KEY (company_id) REFERENCES users(id),
      FOREIGN KEY (creator_id) REFERENCES users(id)
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS deliverables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contract_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      media_url TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pendente_revisao' CHECK(status IN ('pendente_revisao', 'aprovado', 'ajuste_solicitado')),
      revision_notes TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME,
      FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contract_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      target_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contract_id) REFERENCES contracts(id),
      FOREIGN KEY (author_id) REFERENCES users(id),
      FOREIGN KEY (target_id) REFERENCES users(id)
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS disputes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contract_id INTEGER NOT NULL,
      opened_by INTEGER NOT NULL,
      reason TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'aberta' CHECK(status IN ('aberta', 'em_analise', 'resolvida_reembolso_total', 'resolvida_repasse_criador', 'resolvida_acordo')),
      resolution_notes TEXT,
      resolved_by INTEGER,
      resolved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contract_id) REFERENCES contracts(id),
      FOREIGN KEY (opened_by) REFERENCES users(id),
      FOREIGN KEY (resolved_by) REFERENCES users(id)
    );
  `);
};

module.exports = {
  db,
  run,
  get,
  all,
  initDB
};
