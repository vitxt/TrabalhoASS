const API_URL = 'http://localhost:4000/api';

// Estado global da aplicação frontend
let state = {
  users: [],
  currentUser: null,
  campaigns: [],
  creators: [],
  contracts: [],
  disputes: [],
  stats: null,
  activeTab: 'campanhas',
  selectedContractForSign: null,
  selectedContractForEscrow: null
};

// Toast notification helper
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Modal helpers
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('active');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('active');
}

// Formatador de Moeda BRL
function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Inicialização da Aplicação
async function init() {
  setupTabs();
  setupLiveCalculators();
  setupFormSubmissions();
  await loadUsers();
  await refreshData();
}

// Configuração das Abas
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      state.activeTab = targetTab;

      document.querySelectorAll('.tab-content').forEach(section => {
        section.style.display = 'none';
      });

      const activeSection = document.getElementById(`tab-${targetTab}`);
      if (activeSection) {
        activeSection.style.display = 'block';
      }
    });
  });
}

// Calculadoras em tempo real (RN-001: 12.5% de retenção)
function setupLiveCalculators() {
  const budgetInput = document.getElementById('campaignBudgetInput');
  const budgetCalc = document.getElementById('campaignBudgetCalc');
  if (budgetInput && budgetCalc) {
    budgetInput.addEventListener('input', () => {
      const gross = parseFloat(budgetInput.value) || 0;
      const fee = gross * 0.125;
      const net = gross - fee;
      budgetCalc.innerHTML = `Taxa da plataforma (12,5% - RN-001): <strong>${formatBRL(fee)}</strong> | Valor líquido para o criador: <strong>${formatBRL(net)}</strong>`;
    });
  }

  const applyGross = document.getElementById('applyGrossAmount');
  const applyFeeCalc = document.getElementById('applyFeeCalc');
  const applyNetCalc = document.getElementById('applyNetCalc');
  if (applyGross) {
    applyGross.addEventListener('input', () => {
      const gross = parseFloat(applyGross.value) || 0;
      const fee = gross * 0.125;
      const net = gross - fee;
      applyFeeCalc.innerText = formatBRL(fee);
      applyNetCalc.innerText = formatBRL(net);
    });
  }
}

// Carregamento de Usuários e troca de perfil
async function loadUsers() {
  try {
    const res = await fetch(`${API_URL}/auth/users`);
    state.users = await res.json();

    const selector = document.getElementById('userSelector');
    selector.innerHTML = state.users.map(u => `
      <option value="${u.id}">${u.name} (${u.role.toUpperCase()})</option>
    `).join('');

    // Define usuário padrão (Empresa TechCorp)
    state.currentUser = state.users[0];
    updateUserUI();

    selector.addEventListener('change', (e) => {
      const userId = parseInt(e.target.value);
      state.currentUser = state.users.find(u => u.id === userId);
      updateUserUI();
      refreshData();
    });
  } catch (err) {
    console.error('Erro ao conectar com API:', err);
    showToast('Aviso: Verifique se o backend está executando na porta 4000.');
  }
}

// Atualização de elementos conforme o usuário ativo
function updateUserUI() {
  if (!state.currentUser) return;
  const badge = document.getElementById('currentUserBadge');
  const btnNewCamp = document.getElementById('btnOpenNewCampaignModal');

  badge.className = `role-badge badge-${state.currentUser.role}`;
  badge.innerText = state.currentUser.role.toUpperCase();

  // Exibir botão de nova campanha somente para Contratantes
  if (state.currentUser.role === 'contratante') {
    btnNewCamp.style.display = 'inline-flex';
  } else {
    btnNewCamp.style.display = 'none';
  }
}

// Buscar dados e atualizar visualizações
async function refreshData() {
  await Promise.all([
    loadStats(),
    loadCampaigns(),
    loadCreators(),
    loadContracts(),
    loadDisputes()
  ]);
}

// 1. Estatísticas da Plataforma
async function loadStats() {
  try {
    const res = await fetch(`${API_URL}/stats`);
    const data = await res.json();
    state.stats = data.metrics;

    document.getElementById('statEscrowLocked').innerText = formatBRL(state.stats.total_escrow_locked);
    document.getElementById('statPlatformFees').innerText = formatBRL(state.stats.total_platform_fees_earned);
    document.getElementById('statVolumeGross').innerText = formatBRL(state.stats.total_volume_gross);
    document.getElementById('statPaidCreators').innerText = formatBRL(state.stats.total_paid_to_creators);
  } catch (e) {
    console.error(e);
  }
}

// 2. Campanhas
async function loadCampaigns() {
  try {
    const filter = document.getElementById('filterCampanhasNiche').value;
    let url = `${API_URL}/campaigns`;
    if (filter) url += `?niche=${encodeURIComponent(filter)}`;

    const res = await fetch(url);
    state.campaigns = await res.json();

    document.getElementById('badgeCampanhasCount').innerText = state.campaigns.length;
    renderCampaigns();
  } catch (e) {
    console.error(e);
  }
}

function renderCampaigns() {
  const grid = document.getElementById('campaignsGrid');
  if (state.campaigns.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">Nenhuma campanha encontrada com o filtro selecionado.</div>`;
    return;
  }

  grid.innerHTML = state.campaigns.map(camp => {
    const isOwner = state.currentUser && state.currentUser.id === camp.company_id;
    const isCreator = state.currentUser && state.currentUser.role === 'contratado';

    return `
      <div class="card">
        <div>
          <div class="card-header">
            <div class="user-snippet">
              <img src="${camp.company_avatar || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150'}" class="avatar" alt="Empresa">
              <div>
                <strong>${camp.company_name}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Prazo: ${camp.deadline || 'A combinar'}</span>
              </div>
            </div>
            <span class="tag tag-niche">${camp.niche}</span>
          </div>

          <div class="card-body">
            <h3>${camp.title}</h3>
            <p>${camp.description}</p>
            <div style="font-size: 0.8rem; color: #475569; margin-bottom: 0.5rem;">
              <strong>Requisitos:</strong> ${camp.requirements || 'Sem requisitos estritos informados.'}
            </div>

            <div class="card-price-box">
              <div>
                <span class="price-label">Orçamento Bruto:</span>
                <div class="price-gross">${formatBRL(camp.budget_gross)}</div>
              </div>
              <div style="text-align: right;">
                <span class="price-label">Líquido do Criador (-12,5%):</span>
                <div class="price-net">${formatBRL(camp.net_budget_for_creator)}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          ${isCreator && camp.status === 'aberta' ? `
            <button class="btn btn-primary" style="flex: 1;" onclick="openApplyModal(${camp.id}, '${camp.title.replace(/'/g, "\\'")}', ${camp.budget_gross})">
              ✍️ Candidatar-se (RF-005)
            </button>
          ` : ''}

          ${isOwner ? `
            <button class="btn btn-outline" style="flex: 1;" onclick="viewCampaignProposals(${camp.id})">
              👥 Ver Propostas (${camp.proposals_count})
            </button>
          ` : ''}

          ${!isCreator && !isOwner ? `
            <span style="font-size: 0.8rem; color: var(--text-muted); align-self: center;">
              Status da Vaga: <strong>${camp.status.toUpperCase()}</strong>
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// 3. Catálogo de Criadores
async function loadCreators() {
  try {
    const search = document.getElementById('searchCreatorInput').value;
    let url = `${API_URL}/influencers`;
    if (search) url += `?search=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    state.creators = await res.json();

    document.getElementById('badgeCriadoresCount').innerText = state.creators.length;
    renderCreators();
  } catch (e) {
    console.error(e);
  }
}

function renderCreators() {
  const grid = document.getElementById('creatorsGrid');
  grid.innerHTML = state.creators.map(cr => `
    <div class="card">
      <div>
        <div class="card-header">
          <div class="user-snippet">
            <img src="${cr.avatar}" class="avatar avatar-lg" alt="${cr.name}">
            <div>
              <h3>${cr.name}</h3>
              <span class="tag tag-niche">${cr.niche}</span>
            </div>
          </div>
        </div>

        <div class="card-body">
          <p>${cr.bio || 'Sem biografia disponível.'}</p>
          <div style="display: flex; justify-content: space-between; background: #f8fafc; padding: 0.75rem; border-radius: 8px; margin: 1rem 0; font-size: 0.85rem;">
            <div>
              <span style="color: var(--text-muted); display: block;">Seguidores</span>
              <strong>${(cr.followers_count || 0).toLocaleString('pt-BR')}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Engajamento</span>
              <strong>${cr.engagement_rate || 0}%</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Reputação</span>
              <strong>⭐ ${cr.average_rating} (${cr.review_count})</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-outline" style="flex: 1;" onclick="viewCreatorDetails(${cr.id})">
          🎬 Ver Portfólio (${cr.portfolio_count}/5 vídeos)
        </button>
      </div>
    </div>
  `).join('');
}

// 4. Contratos
async function loadContracts() {
  try {
    const res = await fetch(`${API_URL}/contracts`);
    state.contracts = await res.json();

    document.getElementById('badgeContratosCount').innerText = state.contracts.length;
    renderContracts();
  } catch (e) {
    console.error(e);
  }
}

function renderContracts() {
  const container = document.getElementById('contractsList');
  if (state.contracts.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 3rem; background: white; border-radius: 12px; color: var(--text-muted);">Nenhum contrato formalizado até o momento.</div>`;
    return;
  }

  container.innerHTML = state.contracts.map(ct => {
    const isCompany = state.currentUser && state.currentUser.id === ct.company_id;
    const isCreator = state.currentUser && state.currentUser.id === ct.creator_id;
    const isSupport = state.currentUser && state.currentUser.role === 'suporte';

    // Status Stepper Index
    let stepIndex = 1;
    if (ct.company_signed_at && ct.creator_signed_at) stepIndex = 2;
    if (ct.status === 'em_execucao') stepIndex = 3;
    if (ct.status === 'conteudo_enviado') stepIndex = 4;
    if (ct.status === 'aprovado_liquidado') stepIndex = 5;

    return `
      <div class="card" style="padding: 1.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
              <h3 style="font-size: 1.25rem;">${ct.title}</h3>
              <span class="tag ${ct.status === 'aprovado_liquidado' ? 'tag-liquidated' : 'tag-escrow'}">
                ${ct.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Contratante: <strong>${ct.company_name}</strong> | Contratado: <strong>${ct.creator_name}</strong>
            </p>
          </div>

          <div style="text-align: right; background: #f8fafc; padding: 0.75rem 1.25rem; border-radius: 8px; border: 1px solid var(--border);">
            <div style="font-size: 0.8rem; color: var(--text-muted);">Valor em Custódia (Escrow)</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #1e3a8a;">${formatBRL(ct.gross_amount)}</div>
            <div style="font-size: 0.75rem; color: #15803d;">Líquido Criador: ${formatBRL(ct.net_amount)} (12,5% taxa: ${formatBRL(ct.platform_fee)})</div>
          </div>
        </div>

        <!-- Stepper -->
        <div class="contract-stepper">
          <div class="stepper-step ${stepIndex >= 1 ? 'step-done' : ''}">
            <div class="step-circle">1</div>
            <span class="step-label">Minuta</span>
          </div>
          <div class="stepper-step ${stepIndex >= 2 ? (stepIndex > 2 ? 'step-done' : 'step-active') : ''}">
            <div class="step-circle">2</div>
            <span class="step-label">Assinaturas & LGPD</span>
          </div>
          <div class="stepper-step ${stepIndex >= 3 ? (stepIndex > 3 ? 'step-done' : 'step-active') : ''}">
            <div class="step-circle">3</div>
            <span class="step-label">Escrow Retido</span>
          </div>
          <div class="stepper-step ${stepIndex >= 4 ? (stepIndex > 4 ? 'step-done' : 'step-active') : ''}">
            <div class="step-circle">4</div>
            <span class="step-label">Entrega de Mídia</span>
          </div>
          <div class="stepper-step ${stepIndex === 5 ? 'step-done' : ''}">
            <div class="step-circle">5</div>
            <span class="step-label">Liquidação Final</span>
          </div>
        </div>

        <div style="background: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin: 0.75rem 0; font-size: 0.85rem; color: #334155;">
          <strong>Escopo & Termos:</strong> ${ct.scope.replace(/\n/g, '<br>')}
        </div>

        <!-- Ações do Contrato -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem;">

          ${/* Ação de Assinar (RF-007, RN-004) */ ''}
          ${ct.status === 'aguardando_assinaturas' && ((isCompany && !ct.company_signed_at) || (isCreator && !ct.creator_signed_at)) ? `
            <button class="btn btn-primary" onclick="openSignModal(${ct.id})">
              ✍️ Assinar com Aceite LGPD (RN-004)
            </button>
          ` : ''}

          ${/* Ação de Escrow (RF-008, RN-002) */ ''}
          ${ct.status === 'aguardando_escrow' && isCompany ? `
            <button class="btn btn-primary" onclick="openEscrowModal(${ct.id}, ${ct.gross_amount}, ${ct.platform_fee})">
              🔒 Realizar Aporte em Custódia (Escrow - RN-002)
            </button>
          ` : ''}

          ${/* Ação de Enviar Material (RF-009) */ ''}
          ${ct.status === 'em_execucao' && isCreator ? `
            <button class="btn btn-primary" onclick="openDeliverModal(${ct.id})">
              📤 Submeter Entrega de Conteúdo (RF-009)
            </button>
          ` : ''}

          ${/* Ação de Homologar Entrega (RF-011, RN-001, RN-002) */ ''}
          ${ct.status === 'conteudo_enviado' && isCompany ? `
            <button class="btn btn-success" onclick="approveContract(${ct.id})">
              ✅ Aprovar Conteúdo & Liberar Pagamento Líquido (RF-011)
            </button>
            <button class="btn btn-outline" onclick="requestContractRevision(${ct.id})">
              🔄 Solicitar Revisão
            </button>
          ` : ''}

          ${/* Ação de Avaliação (RF-010) */ ''}
          ${ct.status === 'aprovado_liquidado' && (isCompany || isCreator) ? `
            <button class="btn btn-outline" onclick="openReviewModal(${ct.id}, ${isCompany ? ct.creator_id : ct.company_id})">
              ⭐ Avaliar Parceiro (RF-010)
            </button>
          ` : ''}

          ${/* Abertura de Disputa (RF-012, RN-003) */ ''}
          ${ct.status !== 'cancelado' && ct.status !== 'em_disputa' && (isCompany || isCreator) ? `
            <button class="btn btn-outline" style="color: var(--danger);" onclick="openDisputeModal(${ct.id})">
              🚨 Abrir Disputa (RN-003)
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// 5. Disputas
async function loadDisputes() {
  try {
    const res = await fetch(`${API_URL}/disputes`);
    state.disputes = await res.json();

    document.getElementById('badgeDisputasCount').innerText = state.disputes.length;
    renderDisputes();
  } catch (e) {
    console.error(e);
  }
}

function renderDisputes() {
  const container = document.getElementById('disputesList');
  if (state.disputes.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 3rem; background: white; border-radius: 12px; color: var(--text-muted);">Nenhuma disputa registrada. Todos os contratos estão operando em conformidade.</div>`;
    return;
  }

  container.innerHTML = state.disputes.map(disp => {
    const isSupport = state.currentUser && state.currentUser.role === 'suporte';

    return `
      <div class="card" style="border-left: 4px solid var(--danger);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
              <h3>${disp.reason}</h3>
              <span class="tag" style="background: #fee2e2; color: #991b1b;">${disp.status.toUpperCase()}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Contrato: <strong>${disp.contract_title}</strong> | Aberta por: <strong>${disp.opened_by_name}</strong> (${disp.opened_by_role})
            </p>
          </div>
          <div style="font-weight: 700; color: #1e3a8a;">${formatBRL(disp.gross_amount)}</div>
        </div>

        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 1rem; margin: 1rem 0; font-size: 0.85rem; color: #881337;">
          <strong>Descrição do Reclamante:</strong> ${disp.description}
        </div>

        ${disp.resolution_notes ? `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1rem; font-size: 0.85rem; color: #166534;">
            <strong>Parecer Final da Mediação (Suporte):</strong> ${disp.resolution_notes}
          </div>
        ` : ''}

        ${isSupport && disp.status === 'aberta' ? `
          <div style="margin-top: 1rem; display: flex; gap: 0.75rem;">
            <button class="btn btn-outline" onclick="resolveDisputeAction(${disp.id}, 'resolvida_reembolso_total')">
              Estorno 100% à Empresa (RN-003)
            </button>
            <button class="btn btn-success" onclick="resolveDisputeAction(${disp.id}, 'resolvida_repasse_criador')">
              Repasse Integral ao Criador
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// Configuração de submissão de formulários e modais
function setupFormSubmissions() {
  // Publicar Nova Campanha
  document.getElementById('btnOpenNewCampaignModal').addEventListener('click', () => {
    openModal('modalNewCampaign');
  });

  document.getElementById('formNewCampaign').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('campaignTitleInput').value;
    const niche = document.getElementById('campaignNicheInput').value;
    const budget_gross = parseFloat(document.getElementById('campaignBudgetInput').value);
    const deadline = document.getElementById('campaignDeadlineInput').value;
    const description = document.getElementById('campaignDescInput').value;
    const requirements = document.getElementById('campaignReqInput').value;

    try {
      const res = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: state.currentUser.id,
          title,
          niche,
          budget_gross,
          deadline,
          description,
          requirements
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast('Vaga de campanha publicada com sucesso!');
      closeModal('modalNewCampaign');
      document.getElementById('formNewCampaign').reset();
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  });

  // Enviar Proposta
  document.getElementById('formApply').addEventListener('submit', async (e) => {
    e.preventDefault();
    const campaign_id = parseInt(document.getElementById('applyCampaignId').value);
    const proposed_gross = parseFloat(document.getElementById('applyGrossAmount').value);
    const pitch = document.getElementById('applyPitchInput').value;

    try {
      const res = await fetch(`${API_URL}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id,
          creator_id: state.currentUser.id,
          pitch,
          proposed_gross
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(data.message || 'Proposta enviada com sucesso!');
      closeModal('modalApply');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  });

  // Assinar Contrato
  document.getElementById('btnConfirmSign').addEventListener('click', async () => {
    const consent = document.getElementById('checkLgpdConsent').checked;
    if (!consent) {
      alert('É necessário marcar o aceite dos Termos de Cessão e LGPD.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/contracts/${state.selectedContractForSign}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: state.currentUser.id,
          role: state.currentUser.role,
          lgpd_consent: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(data.message);
      closeModal('modalSignContract');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  });

  // Aporte em Custódia Escrow
  document.getElementById('btnConfirmEscrow').addEventListener('click', async () => {
    const method = document.getElementById('escrowMethodSelect').value;
    try {
      const res = await fetch(`${API_URL}/contracts/${state.selectedContractForEscrow}/escrow-deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: method })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(data.message);
      closeModal('modalEscrowPayment');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  });

  // Submeter Entrega
  document.getElementById('formDeliver').addEventListener('submit', async (e) => {
    e.preventDefault();
    const contractId = document.getElementById('deliverContractId').value;
    const title = document.getElementById('deliverTitleInput').value;
    const media_url = document.getElementById('deliverUrlInput').value;
    const notes = document.getElementById('deliverNotesInput').value;

    try {
      const res = await fetch(`${API_URL}/contracts/${contractId}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, media_url, notes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(data.message);
      closeModal('modalDeliver');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  });

  // Enviar Avaliação
  document.getElementById('formReview').addEventListener('submit', async (e) => {
    e.preventDefault();
    const contract_id = parseInt(document.getElementById('reviewContractId').value);
    const target_id = parseInt(document.getElementById('reviewTargetId').value);
    const rating = parseInt(document.getElementById('reviewRatingInput').value);
    const comment = document.getElementById('reviewCommentInput').value;

    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id,
          author_id: state.currentUser.id,
          target_id,
          rating,
          comment
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast('Avaliação cadastrada com sucesso!');
      closeModal('modalReview');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  });

  // Abrir Disputa
  document.getElementById('formDispute').addEventListener('submit', async (e) => {
    e.preventDefault();
    const contract_id = parseInt(document.getElementById('disputeContractId').value);
    const reason = document.getElementById('disputeReasonInput').value;
    const description = document.getElementById('disputeDescInput').value;

    try {
      const res = await fetch(`${API_URL}/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id,
          opened_by: state.currentUser.id,
          reason,
          description
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(data.message);
      closeModal('modalDispute');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  });

  // Filtros
  document.getElementById('filterCampanhasNiche').addEventListener('change', loadCampaigns);
  document.getElementById('searchCreatorInput').addEventListener('input', loadCreators);
}

// Handlers de Ações dos Cards
window.openApplyModal = function (campaignId, title, budgetGross) {
  document.getElementById('applyCampaignId').value = campaignId;
  document.getElementById('applyCampaignTitle').value = title;
  document.getElementById('applyGrossAmount').value = budgetGross;
  const fee = budgetGross * 0.125;
  const net = budgetGross - fee;
  document.getElementById('applyFeeCalc').innerText = formatBRL(fee);
  document.getElementById('applyNetCalc').innerText = formatBRL(net);
  openModal('modalApply');
};

window.openSignModal = function (contractId) {
  state.selectedContractForSign = contractId;
  const ct = state.contracts.find(c => c.id === contractId);
  const textContainer = document.getElementById('modalSignContractText');
  textContainer.innerHTML = `
    <h4>MINUTA DO INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS</h4>
    <p><strong>Partes:</strong> ${ct.company_name} (Contratante) e ${ct.creator_name} (Contratado).</p>
    <p><strong>Objeto:</strong> ${ct.scope}</p>
    <p><strong>Remuneração e Custódia Escrow (RN-001 e RN-002):</strong> Valor bruto de ${formatBRL(ct.gross_amount)}, com dedução da comissão de serviço de 12,5% (${formatBRL(ct.platform_fee)}), transferindo o valor líquido de ${formatBRL(ct.net_amount)} mediante aprovação do conteúdo.</p>
    <p><strong>Cláusula de Cessão de Direitos e LGPD (RN-004):</strong> O CONTRATADO cede em caráter irrevogável à CONTRATANTE os direitos de exploração do conteúdo produzido, em estrito atendimento à Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).</p>
  `;
  document.getElementById('checkLgpdConsent').checked = false;
  openModal('modalSignContract');
};

window.openEscrowModal = function (contractId, gross, fee) {
  state.selectedContractForEscrow = contractId;
  document.getElementById('escrowGrossDisplay').innerText = formatBRL(gross);
  document.getElementById('escrowFeeDisplay').innerText = formatBRL(fee);
  openModal('modalEscrowPayment');
};

window.openDeliverModal = function (contractId) {
  document.getElementById('deliverContractId').value = contractId;
  openModal('modalDeliver');
};

window.approveContract = async function (contractId) {
  if (!confirm('Deseja homologar formalmente este conteúdo e autorizar a liquidação imediata dos valores retidos em garantia (Escrow)?')) return;
  try {
    const res = await fetch(`${API_URL}/contracts/${contractId}/approve`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast(data.message);
    refreshData();
  } catch (err) {
    alert(err.message);
  }
};

window.requestContractRevision = async function (contractId) {
  const notes = prompt('Descreva os ajustes necessários no material entregue:');
  if (!notes) return;
  try {
    const res = await fetch(`${API_URL}/contracts/${contractId}/request-revision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revision_notes: notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast(data.message);
    refreshData();
  } catch (err) {
    alert(err.message);
  }
};

window.openReviewModal = function (contractId, targetId) {
  document.getElementById('reviewContractId').value = contractId;
  document.getElementById('reviewTargetId').value = targetId;
  openModal('modalReview');
};

window.openDisputeModal = function (contractId) {
  document.getElementById('disputeContractId').value = contractId;
  openModal('modalDispute');
};

window.resolveDisputeAction = async function (disputeId, resolutionStatus) {
  const notes = prompt('Insira o parecer de mediação do suporte técnico:');
  if (!notes) return;
  try {
    const res = await fetch(`${API_URL}/disputes/${disputeId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resolution_status: resolutionStatus,
        resolution_notes: notes,
        resolved_by: state.currentUser.id
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast(data.message);
    refreshData();
  } catch (err) {
    alert(err.message);
  }
};

window.viewCreatorDetails = async function (creatorId) {
  try {
    const res = await fetch(`${API_URL}/influencers/${creatorId}`);
    const cr = await res.json();

    let portfolioHtml = cr.portfolio.map(p => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>${p.title}</strong>
          <span class="tag tag-niche">${p.media_type.toUpperCase()} • ${p.external_platform}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0;">${p.description}</p>
        <a href="${p.media_url}" target="_blank" style="font-size: 0.8rem; color: var(--primary);">🔗 Abrir Mídia / Vídeo</a>
      </div>
    `).join('');

    if (cr.portfolio.length === 0) {
      portfolioHtml = '<p style="color: var(--text-muted); font-size: 0.85rem;">Nenhum item adicionado ao portfólio ainda.</p>';
    }

    alert(`Criador: ${cr.name}\nNicho: ${cr.niche}\nSeguidores: ${cr.followers_count.toLocaleString('pt-BR')}\nItens de Portfólio (Máx 5 vídeos - RN-005): ${cr.portfolio.length}`);
  } catch (err) {
    console.error(err);
  }
};

window.viewCampaignProposals = async function (campaignId) {
  try {
    const res = await fetch(`${API_URL}/campaigns/${campaignId}`);
    const camp = await res.json();

    if (camp.proposals.length === 0) {
      alert(`Campanha "${camp.title}" ainda não recebeu candidaturas.`);
      return;
    }

    const firstProp = camp.proposals[0];
    const acceptConfirm = confirm(`Campanha: ${camp.title}\n\nProposta de ${firstProp.creator_name}:\n- Pitch: "${firstProp.pitch}"\n- Valor Bruto: ${formatBRL(firstProp.proposed_gross)}\n- Valor Líquido do Criador: ${formatBRL(firstProp.proposed_net)}\n\nDeseja ACEITAR esta proposta e formalizar o contrato agora?`);

    if (acceptConfirm) {
      const acceptRes = await fetch(`${API_URL}/proposals/${firstProp.id}/accept`, { method: 'POST' });
      const acceptData = await acceptRes.json();
      if (!acceptRes.ok) throw new Error(acceptData.error);
      showToast(acceptData.message);
      refreshData();
    }
  } catch (err) {
    alert(err.message);
  }
};

// Dispara inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', init);
