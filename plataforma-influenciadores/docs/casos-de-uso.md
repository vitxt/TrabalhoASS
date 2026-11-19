# Documento de Especificação de Casos de Uso (UC)
**Projeto:** Plataforma de Conexão entre Empresas e Influenciadores / Criadores de Conteúdo  
**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE — Universidade Estadual de Maringá (UEM)  
**Autores:**  
- Vitor Teodoro Correa — RA 143757  
- Arthur Spirandelli — RA 144136  

---

## 1. Introdução

O presente documento consolida a **Especificação de Casos de Uso (UC)** que detalha os fluxos e o comportamento operacional da plataforma de intermediação e contratação de criadores de conteúdo (influenciadores/freelancers) por empresas anunciantes (contratantes).

---

## 2. Atores do Sistema

* **Contratado:** Criador de conteúdo/influenciador que cadastra portfólio, aplica-se a vagas, assina contratos digitais, entrega mídias e recebe valores.
* **Contratante:** Empresa anunciante que publica demandas, avalia perfis, realiza o aporte financeiro em garantia e avalia materiais.
* **Sistema (Plataforma):** Componente central automatizado que executa regras de negócio, calcula comissões (12,5%), gerencia temporizadores de aprovação tácita e orquestra notificações.
* **Suporte / Mediação:** Agente humano responsável por analisar evidências e deliberar em casos de controvérsia contratual ou fraude no prazo de até 7 dias corridos.
* **Gateway de Pagamentos:** Sistema externo certificado (PCI-DSS) que efetua cobranças, custódia e transferências financeiras.

---

## 3. Especificação Detalhada dos Casos de Uso

---

### UC-001 — Cadastrar e Autenticar Contratado

* **Identificador:** UC-001
* **Nome:** Cadastrar e Autenticar Contratado (Influenciador/Freelancer)
* **Objetivo:** Permitir que um criador de conteúdo crie sua conta na plataforma, autentique-se e configure dados para recebimento de repasses.
* **Ator Principal:** Contratado.
* **Atores Secundários:** Sistema.
* **Pré-condições:** O usuário deve acessar a plataforma e não possuir registro prévio com o mesmo CPF ou e-mail.
* **Fluxo Principal:**
  1. O influenciador acessa a opção de criação de conta e seleciona o perfil "Criador de Conteúdo / Influenciador".
  2. O sistema exibe o formulário de cadastro solicitando: nome completo, CPF, RG, telefone, e-mail, senha, dados de domicílio bancário e chave PIX.
  3. O influenciador preenche os dados cadastrais e declara ciência dos termos de uso e política de privacidade.
  4. O influenciador submete o formulário.
  5. O sistema valida os campos obrigatórios, checa a integridade algorítmica do CPF e verifica se não há duplicidade de CPF ou e-mail.
  6. O sistema aplica hash criptográfico na senha e armazena os dados sensíveis de forma cifrada (AES-256).
  7. O sistema envia e-mail com link de confirmação para o endereço fornecido.
  8. O usuário clica no link recebido e ativa sua conta.
  9. O sistema autentica o usuário e disponibiliza acesso ao painel inicial do criador.
* **Fluxos Alternativos:**
  * *FA1 — Autenticação subsequente (Login):* O usuário acessa a tela de login, informa e-mail e senha cadastrados; o sistema valida as credenciais e inicia sessão com token seguro.
* **Exceções:**
  * *E1 — CPF ou e-mail já existente:* O sistema impede o cadastro e sugere a recuperação de senha.
  * *E2 — Dados bancários ou CPF em formato inválido:* O sistema destaca o campo correspondente e exige correção antes de prosseguir.
* **Pós-condições:** Conta de criador criada com sucesso; usuário apto a editar portfólio e candidatar-se a vagas.
* **Regras de Negócio Relacionadas:** RN-004.
* **Requisitos Relacionados:** RF-001, RNF-001.

---

### UC-002 — Gerenciar Portfólio Profissional

* **Identificador:** UC-002
* **Nome:** Gerenciar Portfólio do Contratado
* **Objetivo:** Permitir ao influenciador cadastrar, alterar e excluir itens em sua vitrine profissional pública (mídias, documentos e hiperlinks).
* **Ator Principal:** Contratado.
* **Atores Secundários:** Sistema.
* **Pré-condições:** Contratado devidamente autenticado na plataforma.
* **Fluxo Principal:**
  1. O influenciador navega até a área "Meu Portfólio".
  2. O sistema exibe os itens atualmente cadastrados e o contador de vídeos nativos hospedados (X de 5 utilizados).
  3. O criador seleciona a opção "Adicionar Item" e escolhe a modalidade (foto, documento PDF, link externo de rede social ou upload de vídeo nativo de até 250 MB).
  4. O criador anexa os arquivos e informa título e descrição.
  5. O criador confirma a operação.
  6. O sistema valida o formato, tamanho (máx. 250 MB) e, em caso de vídeo nativo, verifica se a cota de 5 vídeos da regra RN-005 não foi ultrapassada.
  7. O sistema armazena a mídia no repositório de arquivos e associa ao perfil público.
  8. O sistema emite mensagem de sucesso e atualiza a galeria em tempo real.
* **Fluxos Alternativos:**
  * *FA1 — Remoção de item:* O criador seleciona um item existente e clica em excluir; o sistema remove o registro e decrementa o contador de mídias.
  * *FA2 — Inserção de links externos:* O criador insere URLs de vídeos do YouTube/TikTok/Instagram; o sistema valida a URL e salva o item sem consumir a cota de vídeos nativos.
* **Exceções:**
  * *E1 — Limite de vídeos nativos excedido:* Caso o criador tente fazer upload de um 6º vídeo nativo, o sistema bloqueia o envio e orienta a exclusão de um vídeo existente ou o uso de links externos.
  * *E2 — Arquivo com mais de 250 MB ou formato inválido:* O sistema interrompe o upload e exibe mensagem de erro.
* **Pós-condições:** Portfólio atualizado e refletido imediatamente na visualização pública para contratantes.
* **Regras de Negócio Relacionadas:** RN-005.
* **Requisitos Relacionados:** RF-002, RNF-003, RNF-005.

---

### UC-003 — Cadastrar e Autenticar Contratante

* **Identificador:** UC-003
* **Nome:** Cadastrar e Autenticar Contratante (Empresa)
* **Objetivo:** Permitir que uma marca ou empresa se cadastre, valide seus dados corporativos e acesse as ferramentas de contratação.
* **Ator Principal:** Contratante.
* **Atores Secundários:** Sistema.
* **Pré-condições:** Não haver registro ativo anterior com o mesmo CNPJ ou e-mail corporativo.
* **Fluxo Principal:**
  1. A empresa acessa a página inicial e escolhe a opção "Cadastrar Minha Empresa".
  2. O sistema exibe o formulário corporativo: razão social, nome fantasia, CNPJ, ramo de atividade, endereço, telefone, e-mail institucional e senha.
  3. O representante da empresa preenche as informações e manifesta concordância com os termos de uso.
  4. O sistema valida o algoritmo dos dígitos verificadores do CNPJ e checa a unicidade dos dados.
  5. O sistema grava a conta corporativa e envia e-mail com link de confirmação.
  6. O representante valida o e-mail através do link.
  7. O sistema ativa a conta e concede acesso ao painel de anúncios e contratações.
* **Fluxos Alternativos:**
  * *FA1 — Login corporativo:* O representante insere credenciais corporativas na tela de login; o sistema autentica a sessão.
* **Exceções:**
  * *E1 — CNPJ com formato inválido ou inexistente:* O sistema sinaliza a incorreção e recusa o envio.
  * *E2 — CNPJ já existente:* O sistema notifica a duplicidade e bloqueia o processo.
* **Pós-condições:** Conta institucional ativa; contratante habilitado a publicar vagas e formalizar campanhas.
* **Regras de Negócio Relacionadas:** RN-004.
* **Requisitos Relacionados:** RF-003, RNF-001.

---

### UC-004 — Publicar e Gerenciar Vaga pelo Contratante

* **Identificador:** UC-004
* **Nome:** Publicar Vaga de Campanha Publicitária
* **Objetivo:** Permitir à empresa anunciante criar e disponibilizar no hub de oportunidades uma demanda de criação de conteúdo.
* **Ator Principal:** Contratante.
* **Atores Secundários:** Sistema.
* **Pré-condições:** Contratante autenticado com perfil ativo.
* **Fluxo Principal:**
  1. O contratante seleciona a opção "Criar Nova Vaga".
  2. O sistema apresenta o formulário com: título da campanha, nicho, briefing de conteúdo esperado, data limite para entrega e orçamento bruto proposto (R$).
  3. O contratante preenche os campos e informa o valor bruto pretendido.
  4. O sistema calcula automaticamente o valor líquido do criador aplicando o abatimento de 12,5% da comissão (RN-001) e exibe uma prévia com transparência (`Líquido = Bruto × 0,875`).
  5. O contratante confirma a publicação da oportunidade.
  6. O sistema valida o preenchimento dos campos mandatórios e publica a vaga no catálogo público.
  7. A vaga é disponibilizada para visualização e candidaturas no hub geral.
* **Fluxos Alternativos:**
  * *FA1 — Encerramento ou edição da vaga:* O contratante pode pausar, editar detalhes descritivos ou encerrar a publicação antes de firmar contrato.
* **Exceções:**
  * *E1 — Orçamento bruto não informado ou inválido:* O sistema impede o envio e solicita valor numérico válido.
  * *E2 — Data limite anterior à data presente:* O sistema impede a gravação com alerta de inconsistência temporal.
* **Pós-condições:** Vaga visível para toda a base de influenciadores aptos.
* **Regras de Negócio Relacionadas:** RN-001, RN-004.
* **Requisitos Relacionados:** RF-004, RNF-003, RNF-005.

---

### UC-005 — Consultar Vagas e Submeter Candidatura

* **Identificador:** UC-005
* **Nome:** Consultar Vagas e Candidatar-se
* **Objetivo:** Permitir ao criador de conteúdo navegar pelas oportunidades do hub e submeter seu interesse a uma campanha.
* **Ator Principal:** Contratado.
* **Atores Secundários:** Sistema, Contratante.
* **Pré-condições:** Contratado logado; ao menos uma vaga ativa na plataforma.
* **Fluxo Principal:**
  1. O criador acessa a aba "Buscar Vagas".
  2. O sistema lista as oportunidades disponíveis exibindo nicho, briefing resumido, prazo e o **valor líquido** a ser recebido.
  3. O criador aplica filtros (nicho, faixa de remuneração) e seleciona uma vaga de seu interesse.
  4. O sistema exibe os detalhes completos da oportunidade.
  5. O criador clica em "Candidatar-se", redige uma breve mensagem de apresentação e confirma o envio.
  6. O sistema valida que o criador não possui candidatura ativa na mesma vaga.
  7. O sistema associa a candidatura à oportunidade e dispara notificação para o painel do contratante.
  8. O sistema exibe comprovante de candidatura enviada.
* **Fluxos Alternativos:**
  * *FA1 — Cancelamento de candidatura:* O criador pode desistir da candidatura antes de a empresa formalizar proposta de contrato.
* **Exceções:**
  * *E1 — Candidatura em duplicidade:* O sistema identifica envio prévio e bloqueia nova tentativa informando o status atual.
* **Pós-condições:** Candidatura registrada e listada no painel de triagem da empresa anunciante.
* **Regras de Negócio Relacionadas:** RN-001.
* **Requisitos Relacionados:** RF-005, RNF-003, RNF-005.

---

### UC-006 — Explorar Perfis de Criadores pelo Contratante

* **Identificador:** UC-006
* **Nome:** Explorar Perfis e Iniciar Contato Ativo
* **Objetivo:** Permitir que o contratante busque ativamente criadores cadastrados e envie convites direcionados para campanhas.
* **Ator Principal:** Contratante.
* **Atores Secundários:** Sistema, Contratado.
* **Pré-condições:** Contratante logado; influenciadores cadastrados com perfil público.
* **Fluxo Principal:**
  1. O contratante seleciona a funcionalidade "Explorar Criadores".
  2. O sistema exibe a galeria de perfis públicos com destaques de reputação, nichos e cards de portfólio.
  3. O contratante filtra por nicho, cidade ou rede social principal.
  4. O contratante seleciona um perfil e analisa o portfólio completo (fotos, links e vídeos demonstrativos).
  5. O contratante clica em "Convidar para Campanha" ou "Enviar Proposta".
  6. O sistema vincula o convite a uma vaga aberta ou abre formulário de contratação direta.
  7. O criador convidado recebe notificação e convite no seu painel.
* **Fluxos Alternativos:**
  * *FA1 — Busca sem resultados:* O sistema notifica a ausência de correspondência para os filtros e sugere termos mais abrangentes.
* **Exceções:**
  * *E1 — Perfil indisponível ou inativo:* O sistema impede o envio de propostas e avisa que o criador pausou recebimento de demandas.
* **Pós-condições:** Convite registrado e notificado ao influenciador.
* **Regras de Negócio Relacionadas:** RN-004.
* **Requisitos Relacionados:** RF-006, RNF-003.

---

### UC-007 — Formalizar e Assinar Contrato Digital

* **Identificador:** UC-007
* **Nome:** Formalizar e Assinar Contrato Digital
* **Objetivo:** Gerar instrumento jurídico vinculante entre empresa e criador com cláusulas explícitas de remuneração, prazos e cessão de direitos de imagem.
* **Ator Principal:** Contratante (iniciador) e Contratado (aceitante).
* **Atores Secundários:** Sistema.
* **Pré-condições:** Contratante selecionou um candidato ou criador para uma campanha.
* **Fluxo Principal:**
  1. O contratante clica em "Contratar Criador" a partir de uma candidatura aceita.
  2. O sistema gera a minuta eletrônica contendo: escopo detalhado, datas de entrega, valor bruto, valor líquido, regras de aprovação e cláusula mandatória de cessão de direitos de imagem/voz (RN-004).
  3. O contratante revisa os termos, declara aceite eletrônico e assina digitalmente.
  4. O sistema registra o aceite do contratante (com timestamp e hash) e envia notificação prioritária ao criador.
  5. O criador acessa a minuta na íntegra, analisa as condições e confirma seu aceite eletrônico.
  6. O sistema vincula a assinatura de ambas as partes, gera o contrato definitivo arquivado e altera o status para "Aguardando Pagamento em Custódia".
  7. O sistema direciona o contratante para a etapa de aporte financeiro (UC-008).
* **Fluxos Alternativos:**
  * *FA1 — Recusa pelo criador:* O criador pode recusar a proposta justificando o motivo; o contrato é cancelado e a empresa notificada.
* **Exceções:**
  * *E1 — Falha no registro eletrônico de consentimento:* O sistema aborta o processo e exige nova confirmação caso o hash de integridade falhe.
* **Pós-condições:** Contrato formalizado com validade jurídica; início da fase de custódia financeira.
* **Regras de Negócio Relacionadas:** RN-002, RN-004.
* **Requisitos Relacionados:** RF-007, RNF-001.

---

### UC-008 — Processar Pagamento em Custódia (Escrow)

* **Identificador:** UC-008
* **Nome:** Processar Pagamento e Retenção em Escrow
* **Objetivo:** Efetuar a cobrança do contratante através do gateway de pagamentos e reter os valores em garantia preventiva até a entrega do trabalho.
* **Ator Principal:** Contratante.
* **Atores Secundários:** Sistema, Gateway de Pagamentos, Contratado.
* **Pré-condições:** Contrato devidamente assinado por ambas as partes (UC-007).
* **Fluxo Principal:**
  1. O sistema solicita ao contratante a realização do pagamento do valor bruto acordado.
  2. O contratante seleciona o método de pagamento (PIX ou Cartão de Crédito tokenizado).
  3. O contratante confirma a operação.
  4. O sistema transmite os dados criptografados diretamente ao Gateway de Pagamentos externo.
  5. O Gateway processa a transação e confirma a liquidação financeira.
  6. O sistema atualiza o status dos fundos para "Retido em Custódia (Escrow)".
  7. O sistema altera o status do contrato para "Em Andamento".
  8. O sistema notifica o contratado autorizando expressamente o início da produção do material publicitário.
* **Fluxos Alternativos:**
  * *FA1 — Pagamento via PIX com QR Code dinâmico:* O contratante efetua o pagamento pelo app bancário; o gateway notifica o sistema via webhook assíncrono e a custódia é ativada.
* **Exceções:**
  * *E1 — Pagamento recusado ou expirado:* O Gateway retorna erro (ex.: limite insuficiente); o sistema alerta o contratante e mantém o contrato aguardando nova tentativa, impedindo o criador de iniciar o serviço.
* **Pós-condições:** Valor total bruto em posse do custodiante de garantia; criador liberado com garantia financeira para trabalhar.
* **Regras de Negócio Relacionadas:** RN-001, RN-002.
* **Requisitos Relacionados:** RF-008, RNF-002, RNF-004.

---

### UC-009 — Entregar e Avaliar Material de Conteúdo

* **Identificador:** UC-009
* **Nome:** Entregar e Avaliar Conteúdo
* **Objetivo:** Permitir ao influenciador submeter o material concluído e viabilizar a revisão e aprovação/recusa por parte da empresa contratante dentro do prazo de 5 dias úteis.
* **Ator Principal:** Contratado (entrega) e Contratante (avaliação).
* **Atores Secundários:** Sistema.
* **Pré-condições:** Contrato "Em Andamento" com garantia financeira retida em *escrow*.
* **Fluxo Principal:**
  1. O criador finaliza o material e acessa a área do contrato na plataforma.
  2. O criador anexa os arquivos finais de mídia ou links privados de validação e confirma a entrega.
  3. O sistema registra o upload, altera o status do contrato para "Em Avaliação" e notifica o contratante imediatamente.
  4. O sistema inicia a contagem regressiva do prazo limite regulamentar padrão de **5 (cinco) dias úteis** para análise do contratante.
  5. O contratante acessa o ambiente de avaliação, reproduz o material e clica no botão "Aprovar Conteúdo".
  6. O sistema registra a aprovação formal do material.
  7. O sistema aciona o caso de uso de liberação de pagamento (UC-011).
* **Fluxos Alternativos:**
  * *FA1 — Aprovação Tácita por Decurso de Prazo (RN-002):* Caso o contratante não se manifeste dentro da janela temporal estipulada de 5 dias úteis, o sistema encerra automaticamente a avaliação por decurso de prazo e dispara o UC-011.
  * *FA2 — Solicitação de Ajustes:* O contratante recusa o envio inicial apontando ajustes necessários de acordo com o briefing original; o criador recebe o feedback e submete nova versão.
* **Exceções:**
  * *E1 — Recusa reiterada ou impasse insanável:* O contratante recusa o material sem consenso; qualquer das partes pode converter a situação em disputa formal (UC-012).
* **Pós-condições:** Conteúdo homologado e contrato liberado para repasse financeiro.
* **Regras de Negócio Relacionadas:** RN-002.
* **Requisitos Relacionados:** RF-009, RNF-004, RNF-005.

---

### UC-010 — Realizar Avaliação Mútua de Reputação

* **Identificador:** UC-010
* **Nome:** Avaliação Bidirecional de Reputação
* **Objetivo:** Permitir que empresa e criador forneçam notas e comentários recíprocos após o encerramento do contrato.
* **Ator Principal:** Contratante e Contratado.
* **Atores Secundários:** Sistema.
* **Pré-condições:** Contrato formalmente finalizado com status "Concluído".
* **Fluxo Principal:**
  1. O sistema envia convite de avaliação para ambas as partes após a liquidação do contrato.
  2. O usuário (contratante ou contratado) acessa o formulário de avaliação do serviço.
  3. O usuário seleciona a nota de avaliação de 1 a 5 estrelas, indica tags de qualidade e escreve seu parecer qualitativo.
  4. O usuário confirma a submissão.
  5. O sistema valida que aquele usuário ainda não havia registrado avaliação para o contrato respectivo.
  6. O sistema atualiza o índice de reputação consolidado do perfil avaliado e torna o comentário público.
  7. O sistema exibe mensagem de agradecimento pelo feedback.
* **Fluxos Alternativos:**
  * *FA1 — Usuário opta por não avaliar:* O registro permanece facultativo até que expire a janela de feedback.
* **Exceções:**
  * *E1 — Tentativa de submissão em duplicidade:* O sistema impede o envio e avisa que o contrato já recebeu a avaliação do usuário.
* **Pós-condições:** Média e comentários de reputação atualizados na vitrine pública dos participantes.
* **Regras de Negócio Relacionadas:** Diretrizes de integridade e comunidade.
* **Requisitos Relacionados:** RF-010, RNF-005.

---

### UC-011 — Liberar Pagamento e Recolher Comissão

* **Identificador:** UC-011
* **Nome:** Liberar Pagamento ao Contratado
* **Objetivo:** Repassar os recursos devidos ao criador descontando a taxa de 12,5% da plataforma após aprovação formal ou tácita (após 5 dias úteis) do conteúdo.
* **Ator Principal:** Sistema (automático) ou Suporte (em caso de liquidação pós-disputa).
* **Atores Secundários:** Gateway de Pagamentos, Contratado, Contratante.
* **Pré-condições:** Conteúdo aprovado pelo contratante ou expirado o prazo de avaliação de 5 dias úteis sem manifestação contrária (UC-009).
* **Fluxo Principal:**
  1. O sistema identifica o evento de aprovação do material entregue.
  2. O sistema calcula a comissão retida da plataforma: `Comissão = Valor Bruto × 0,125`.
  3. O sistema calcula o valor líquido a ser transferido ao influenciador: `Valor Líquido = Valor Bruto − Comissão`.
  4. O sistema comanda o Gateway de Pagamentos a efetuar a liquidação financeira do valor líquido diretamente na chave PIX/conta bancária do criador.
  5. O Gateway de Pagamentos processa o repasse e devolve confirmação de transferência com autenticação bancária.
  6. O sistema retém o valor da comissão na conta institucional da plataforma.
  7. O sistema atualiza o status do contrato para "Concluído".
  8. O sistema notifica ambas as partes com os respectivos recibos e extratos financeiros.
  9. O sistema convida ambas as partes a participarem da avaliação mútua (UC-010).
* **Fluxos Alternativos:**
  * *FA1 — Liquidação após decisão de suporte:* Em contratos que passaram por mediação, o suporte autoriza a liquidação e o sistema executa o repasse conforme a proporção determinada na sentença.
* **Exceções:**
  * *E1 — Indisponibilidade no gateway de transferências:* O sistema coloca a ordem em fila de retentativa e alerta a equipe de infraestrutura com monitoramento ativo.
* **Pós-condições:** Criador remunerado; comissão da plataforma auferida; contrato concluído.
* **Regras de Negócio Relacionadas:** RN-001, RN-002.
* **Requisitos Relacionados:** RF-011, RNF-002, RNF-004.

---

### UC-012 — Abrir e Mediar Disputa de Reembolso

* **Identificador:** UC-012
* **Nome:** Abrir Disputa e Solicitar Mediação/Reembolso
* **Objetivo:** Congelar o fluxo de pagamento e acionar o suporte humano para deliberar em até 7 (sete) dias corridos sobre descumprimento de prazos, má-fé ou recusa indevida de conteúdo.
* **Ator Principal:** Contratante ou Contratado (requerente); Suporte Técnico (analista/árbitro).
* **Atores Secundários:** Sistema, Gateway de Pagamentos.
* **Pré-condições:** Contrato vigente com recursos custodiados em garantia financeira.
* **Fluxo Principal:**
  1. A parte lesada (empresa ou criador) clica na opção "Reportar Problema / Abrir Disputa" na página do contrato.
  2. O sistema apresenta o formulário de contestação solicitando: categoria da ocorrência (não entrega, quebra de briefing, recusa injustificada), relato fático e upload de provas documentais.
  3. O requerente anexa as evidências e confirma a instauração da mediação.
  4. O sistema altera instantaneamente o status do contrato para "Em Disputa" e bloqueia preventivamente qualquer transferência ou saque.
  5. O sistema notifica a contraparte concedendo prazo para apresentar sua versão e contraprovas.
  6. O analista da equipe de Suporte/Mediação acessa o painel de atendimento e avalia o histórico integral de mensagens, contratos e arquivos.
  7. O Suporte emite parecer conclusivo no prazo regulamentar de até 7 dias corridos deliberando por: estorno total à empresa, liberação integral ao criador ou encerramento com estorno parcial proporcional.
  8. O sistema comanda o Gateway de Pagamentos a executar a decisão financeira estipulada pelo parecer.
  9. O sistema atualiza o status para "Encerrado por Disputa" e notifica as partes com cópia do parecer.
* **Fluxos Alternativos:**
  * *FA1 — Acordo consensual direto:* Durante o prazo de defesa, as partes chegam a acordo amigável e solicitam em comum acordo a homologação e cancelamento da disputa.
* **Exceções:**
  * *E1 — Ausência de manifestação da contraparte no prazo:* O suporte julga a disputa à revelia com base exclusivamente nas provas do requerente.
* **Pós-condições:** Conflito resolvido; valores estornados ou liberados conforme a mediação; contrato encerrado.
* **Regras de Negócio Relacionadas:** RN-003.
* **Requisitos Relacionados:** RF-012, RNF-001.

---

## 4. Matriz de Relacionamento entre Casos de Uso e Regras de Negócio

| Caso de Uso | Título do Caso de Uso | Atores Primários | Regras de Negócio | Requisitos Funcionais |
|---|---|---|---|---|
| **UC-001** | Cadastrar e Autenticar Contratado | Contratado | RN-004 | RF-001 |
| **UC-002** | Gerenciar Portfólio Profissional | Contratado | RN-005 | RF-002 |
| **UC-003** | Cadastrar e Autenticar Contratante | Contratante | RN-004 | RF-003 |
| **UC-004** | Publicar e Gerenciar Vagas | Contratante | RN-001, RN-004 | RF-004 |
| **UC-005** | Consultar e Candidatar-se a Vagas | Contratado | RN-001 | RF-005 |
| **UC-006** | Explorar Perfis de Criadores | Contratante | RN-004 | RF-006 |
| **UC-007** | Formalizar e Assinar Contrato | Contratante / Contratado | RN-002, RN-004 | RF-007 |
| **UC-008** | Processar Pagamento em Custódia | Contratante | RN-001, RN-002 | RF-008 |
| **UC-009** | Entregar e Avaliar Conteúdo | Contratado / Contratante | RN-002 | RF-009 |
| **UC-010** | Realizar Avaliação Mútua | Contratante / Contratado | — | RF-010 |
| **UC-011** | Liberar Pagamento ao Contratado | Sistema / Suporte | RN-001, RN-002 | RF-011 |
| **UC-012** | Abrir Disputa e Mediação | Contratante / Contratado | RN-003 | RF-012 |
