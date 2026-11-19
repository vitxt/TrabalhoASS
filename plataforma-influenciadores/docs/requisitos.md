# Documento de Especificação de Requisitos de Software (SRS)
**Projeto:** Plataforma de Conexão entre Empresas e Influenciadores / Criadores de Conteúdo  
**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE — Universidade Estadual de Maringá (UEM)  
**Autores:**  
- Vitor Teodoro Correa — RA 143757  
- Arthur Spirandelli — RA 144136  

---

## 1. Introdução

O presente documento consolida a **Especificação de Requisitos de Software (SRS)** que define os requisitos funcionais, não funcionais, de integração e restrições da plataforma de intermediação e contratação de criadores de conteúdo (influenciadores/freelancers) por empresas anunciantes (contratantes).

---

## 2. Stakeholders e Atores

| Identificador | Papel / Ator | Descrição e Responsabilidades |
|---|---|---|
| **STK-01** | **Contratado** *(Influenciador / Freelancer)* | Criador de conteúdo que se cadastra, mantém seu portfólio, busca oportunidades, candidata-se a vagas, assina termos contratuais, submete materiais e recebe a remuneração líquida acordada. |
| **STK-02** | **Contratante** *(Empresa / Marca)* | Pessoa jurídica que publica vagas de campanhas, busca ativamente influenciadores, formaliza acordos, realiza o pagamento em garantia (*escrow*) e avalia o material entregue. |
| **STK-03** | **Plataforma / Sistema** | Entidade gestora do negócio e componente automatizado que aplica as regras de negócio, calcula comissões (12,5%), monitora prazos de aprovação tácita e orquestra transações. |
| **STK-04** | **Suporte Técnico / Mediação** | Equipe operacional responsável por arbitrar controvérsias contratuais, analisar denúncias de fraudes e deliberar sobre reembolsos ou repasses em disputas no prazo de até 7 dias corridos. |
| **EXT-01** | **Gateway de Pagamentos** | Ator externo especializado e certificado em PCI-DSS, responsável pelo processamento de pagamentos, retenção de custódia e liquidação de transferências (PIX/TED). |

---

## 3. Requisitos Funcionais (RF)

---

### RF-001 — Cadastro e Autenticação do Contratado
* **Título:** Cadastro, autenticação e perfil do influenciador/freelancer.
* **Descrição:** O sistema deve permitir que o criador de conteúdo crie e gerencie sua conta de acesso, informando dados pessoais, cadastrais e bancários para recebimento de honorários.
* **Objetivo:** Habilitar o contratado a se candidatar a vagas, publicar seu portfólio e receber remunerações com segurança.
* **Stakeholders:** Contratado (STK-01).
* **Ator Principal:** Contratado.
* **Pré-condições:** Não possuir conta prévia cadastrada com o mesmo CPF ou e-mail.
* **Entradas:** Nome completo, CPF, RG, telefone, e-mail, senha de acesso, nacionalidade, escolaridade, dados bancários (banco, agência, conta corrente e/ou chave PIX).
* **Processamento Esperado:** Validar formato de CPF e chave PIX, verificar duplicidade em base de dados, aplicar hash criptográfico na senha, criar o registro e disparar e-mail de ativação.
* **Saídas/Resultados:** Conta criada com status "ativo" e confirmação enviada por e-mail.
* **Pós-condições:** O contratado pode efetuar login e gerenciar seu perfil profissional.
* **Fluxos Alternativos e Exceções:**
  * *E1 — CPF ou e-mail já cadastrado:* Sistema impede o cadastro e instrui recuperação de conta.
  * *E2 — Dados bancários inválidos:* Sistema notifica os campos com inconsistência antes da persistência.
* **Regras de Negócio Relacionadas:** RN-004.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Unicidade estrita de CPF e e-mail.
  * Validação algorítmica de CPF e checagem de chave PIX.
  * Envio de mensagem de confirmação de cadastro.
* **Casos de Uso Relacionados:** UC-001.

---

### RF-002 — Gestão de Portfólio do Contratado
* **Título:** Montagem, edição e exibição pública de portfólio profissional.
* **Descrição:** O sistema deve permitir que o contratado gerencie um portfólio multimídia contendo fotos, textos descritivos, documentos e vídeos nativos (máximo de 5 vídeos de até 250 MB cada), além de hiperlinks externos para plataformas sociais.
* **Objetivo:** Exibir as qualificações e trabalhos prévios do criador para contratantes interessados.
* **Stakeholders:** Contratado (STK-01), Contratante (STK-02).
* **Ator Principal:** Contratado.
* **Pré-condições:** Usuário contratado autenticado com conta ativa.
* **Entradas:** Arquivos de imagem, documentos (PDF), textos biográficos, links externos (Instagram, TikTok, YouTube) e arquivos de vídeo nativos (MP4, MOV).
* **Processamento Esperado:** Validar extensões, tamanhos (máx. 250 MB por vídeo) e MIME types dos arquivos; verificar a cota de vídeos nativos hospedados (máximo de 5 vídeos conforme RN-005); persistir os itens no storage e atualizar o perfil público.
* **Saídas/Resultados:** Portfólio atualizado e disponibilizado no perfil público do criador.
* **Pós-condições:** Contratantes podem visualizar as mídias na vitrine do profissional.
* **Fluxos Alternativos e Exceções:**
  * *E1 — Tentativa de envio além do 5º vídeo nativo:* Bloqueio imediato da submissão com aviso informativo sobre o limite de 5 itens da RN-005, orientando o uso de links externos.
  * *E2 — Arquivo com tamanho superior a 250 MB ou formato não suportado:* Rejeição imediata com instrução de limites e formatos válidos.
* **Regras de Negócio Relacionadas:** RN-005.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Permitir até 5 vídeos nativos ativos simultâneos por portfólio de até 250 MB cada.
  * Não impor limite numérico para inserção de links externos.
  * Exibir galeria responsiva acessível no perfil público.
* **Casos de Uso Relacionados:** UC-002.

---

### RF-003 — Cadastro e Autenticação do Contratante
* **Título:** Cadastro institucional de empresa contratante.
* **Descrição:** O sistema deve permitir o cadastro de pessoas jurídicas interessadas em contratar criadores de conteúdo, capturando seus dados institucionais, fiscais e operacionais.
* **Objetivo:** Habilitar empresas anunciantes a publicar oportunidades, consultar portfólios e contratar criadores.
* **Stakeholders:** Contratante (STK-02).
* **Ator Principal:** Contratante.
* **Pré-condições:** Inexistência de conta prévia com o mesmo CNPJ ou e-mail corporativo.
* **Entradas:** Razão social, nome fantasia, CNPJ, ramo de atuação, endereço completo, telefone de contato, e-mail corporativo e senha.
* **Processamento Esperado:** Validar algoritmo do CNPJ, checar duplicidade, aplicar hash à senha e registrar o perfil institucional.
* **Saídas/Resultados:** Conta corporativa criada e e-mail de confirmação despachado.
* **Pós-condições:** Contratante apto a criar campanhas e buscar influenciadores.
* **Fluxos Alternativos e Exceções:**
  * *E1 — CNPJ inválido ou duplicado:* Sistema interrompe o fluxo e exibe mensagem de alerta.
* **Regras de Negócio Relacionadas:** RN-004.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Validação algorítmica de dígitos verificadores do CNPJ.
  * Unicidade de CNPJ e e-mail no banco de dados.
* **Casos de Uso Relacionados:** UC-003.

---

### RF-004 — Publicação e Gestão de Vagas pelo Contratante
* **Título:** Criação, publicação e encerramento de vagas de criação de conteúdo.
* **Descrição:** O sistema deve permitir que o contratante elabore e divulgue vagas para campanhas, especificando o escopo de conteúdo, orçamento bruto, prazo limite de entrega e diretrizes de criação.
* **Objetivo:** Disponibilizar oportunidades de trabalho estruturadas no hub público de vagas da plataforma.
* **Stakeholders:** Contratante (STK-02), Contratado (STK-01).
* **Ator Principal:** Contratante.
* **Pré-condições:** Contratante autenticado e com cadastro ativo.
* **Entradas:** Título da campanha, descrição das entregas esperadas, exemplos e referências (links/mídias), valor da remuneração bruta (R$), tipo de contrato, data limite de entrega e requisitos específicos.
* **Processamento Esperado:** Validar preenchimento dos campos mandatórios; computar automaticamente o valor líquido a ser recebido pelo contratado aplicando o desconto de 12,5% da RN-001 (`Líquido = Bruto × 0,875`); publicar o anúncio no hub de vagas.
* **Saídas/Resultados:** Vaga ativa e listada para consulta pública no hub.
* **Pós-condições:** Influenciadores podem visualizar os detalhes da vaga e submeter candidaturas.
* **Fluxos Alternativos e Exceções:**
  * *E1 — Campos mandatórios ausentes:* Sistema destaca as pendências e não grava o anúncio.
* **Regras de Negócio Relacionadas:** RN-001, RN-004.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Exibição clara e transparente do valor líquido aos contratados.
  * Validação de orçamento mínimo e prazos futuros viáveis.
* **Casos de Uso Relacionados:** UC-004.

---

### RF-005 — Consulta e Candidatura a Vagas pelo Contratado
* **Título:** Busca, filtragem e submissão de candidatura em oportunidades de trabalho.
* **Descrição:** O sistema deve disponibilizar interface para o contratado pesquisar vagas ativas por filtros e submeter proposta de candidatura acompanhada de mensagem de apresentação.
* **Objetivo:** Conectar criadores interessados às demandas abertas pelas empresas.
* **Stakeholders:** Contratado (STK-01), Contratante (STK-02).
* **Ator Principal:** Contratado.
* **Pré-condições:** Contratado logado e ao menos uma vaga aberta no hub.
* **Entradas:** Critérios de busca (nicho, faixa de remuneração); seleção da vaga e mensagem de apresentação opcional.
* **Processamento Esperado:** Registrar a candidatura no banco de dados, vincular ao perfil do contratado e notificar a empresa contratante.
* **Saídas/Resultados:** Candidatura registrada com sucesso e contratante notificado via dashboard/e-mail.
* **Pós-condições:** O perfil do candidato passa a constar na lista de inscritos na vaga para análise do anunciante.
* **Fluxos Alternativos e Exceções:**
  * *E1 — Candidatura repetida:* Bloqueio informando que o criador já se inscreveu na vaga.
* **Regras de Negócio Relacionadas:** RN-001.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Impedir submissões duplicadas na mesma oportunidade.
  * Atualização em tempo real do painel de candidatos do contratante.
* **Casos de Uso Relacionados:** UC-005.

---

### RF-006 — Exploração de Perfis pelo Contratante
* **Título:** Busca ativa e exploração de perfis de criadores de conteúdo.
* **Descrição:** O sistema deve oferecer ao contratante um mecanismo de busca e filtros para navegar pelos perfis públicos de influenciadores e iniciar contato direto.
* **Objetivo:** Possibilitar o recrutamento ativo (busca direta) por parte das marcas anunciantes.
* **Stakeholders:** Contratante (STK-02), Contratado (STK-01).
* **Ator Principal:** Contratante.
* **Pré-condições:** Contratante autenticado e criadores com portfólios públicos ativos.
* **Entradas:** Parâmetros de pesquisa (nicho de atuação, número de seguidores nas redes, faixa orçamentária, localização geográfica).
* **Processamento Esperado:** Consultar índices da base de dados e retornar perfis com cards de pré-visualização de portfólio e reputação.
* **Saídas/Resultados:** Listagem de profissionais compatíveis com opção de visualização detalhada e envio de proposta.
* **Pós-condições:** Contratante pode convidar o criador para uma vaga específica ou proposta direta.
* **Fluxos Alternativos e Exceções:**
  * *E1 — Nenhum criador encontrado:* Apresentar mensagem indicando ampliação dos filtros.
* **Regras de Negócio Relacionadas:** RN-004.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Retorno rápido da lista de criadores conforme critérios informados.
  * Exibição fiel da galeria e métricas públicas do influenciador.
* **Casos de Uso Relacionados:** UC-006.

---

### RF-007 — Formalização e Assinatura Digital de Contrato
* **Título:** Geração, revisão e aceite recíproco de contrato de campanha.
* **Descrição:** O sistema deve gerar um instrumento contratual eletrônico vinculante consolidando escopo, remuneração, prazos, penalidades e cláusula obrigatória de cessão de direitos de imagem e voz, colhendo o aceite expresso de ambas as partes.
* **Objetivo:** Estabelecer a segurança jurídica da relação e delimitar os direitos e obrigações de cada parte.
* **Stakeholders:** Contratante (STK-02), Contratado (STK-01), Plataforma (STK-03).
* **Ator Principal:** Contratante (iniciador) e Contratado (aceitante).
* **Pré-condições:** Contratante selecionou o criador (via candidatura ou busca ativa) e os termos foram preenchidos.
* **Entradas:** Cláusulas específicas, prazos de entrega, valor bruto acordado e declaração expressa de consentimento e cessão de imagem.
* **Processamento Esperado:** Gerar documento contratual digital com identificador único; colher aceite com timestamp e dados de conexão; registrar o consentimento mútuo; disparar cobrança em custódia (RF-008).
* **Saídas/Resultados:** Instrumento formal assinado eletronicamente e arquivado na plataforma.
* **Pós-condições:** Contrato entra em vigência com status "Aguardando Pagamento em Custódia".
* **Fluxos Alternativos e Exceções:**
  * *E1 — Contratado recusa os termos:* Contrato é marcado como "Recusado" e o processo é finalizado com notificação à empresa.
* **Regras de Negócio Relacionadas:** RN-002, RN-004.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Presença obrigatória de cláusula de direitos de imagem e conformidade LGPD.
  * Registro indelével de log de aceite (data, hora, IP, identificador dos usuários).
* **Casos de Uso Relacionados:** UC-007.

---

### RF-008 — Processamento de Pagamento em Custódia (Escrow)
* **Título:** Aporte e retenção preventiva de valores via gateway de pagamentos.
* **Descrição:** O sistema deve integrar-se com o gateway de pagamentos para cobrar o valor bruto do contrato junto ao contratante, retendo os fundos em garantia (*escrow*) até a conclusão satisfatória das entregas.
* **Objetivo:** Assegurar que o recurso financeiro está disponível e protegido contra calotes ou saques indevidos.
* **Stakeholders:** Contratante (STK-02), Contratado (STK-01), Plataforma (STK-03).
* **Ator Principal:** Contratante.
* **Pré-condições:** Contrato digital assinado por ambas as partes (RF-007).
* **Entradas:** Modalidade de pagamento (PIX ou Cartão de Crédito) e dados de cobrança.
* **Processamento Esperado:** Transmitir parâmetros criptografados ao gateway de pagamentos, obter confirmação de liquidação, atualizar status do contrato para "Em Andamento (Pago em Escrow)" e sinalizar liberação para início dos trabalhos.
* **Saídas/Resultados:** Recibo de pagamento emitido e fundos bloqueados em conta custodiada.
* **Pós-condições:** Contratado autorizado a iniciar a produção e postagem dos materiais.
* **Fluxos Alternativos e Exceções:**
  * *E1 — Recusa pelo gateway (falta de limite/erro bancário):* Manter contrato pendente e notificar o contratante para reprocessamento.
* **Regras de Negócio Relacionadas:** RN-001, RN-002.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * A retenção em garantia deve ocorrer antes de qualquer início de trabalho pelo criador.
  * Nenhuma transação com dados abertos de cartão trafega na infraestrutura da plataforma (RNF-002).
* **Casos de Uso Relacionados:** UC-008.

---

### RF-009 — Entrega e Avaliação Prévia de Conteúdo
* **Título:** Submissão do material produzido e validação pelo anunciante.
* **Descrição:** O sistema deve permitir que o influenciador realize o upload ou informe o link do conteúdo finalizado para apreciação do contratante, iniciando a contagem do prazo limite regulamentar padrão de 5 (cinco) dias úteis para validação.
* **Objetivo:** Permitir ao anunciante verificar a aderência do conteúdo às diretrizes do briefing antes da liberação financeira.
* **Stakeholders:** Contratado (STK-01), Contratante (STK-02).
* **Ator Principal:** Contratado (entrega) e Contratante (validação).
* **Pré-condições:** Contrato "Em Andamento" com garantia financeira em custódia.
* **Entradas:** Arquivos do material publicitário produzido ou links para visualização privada.
* **Processamento Esperado:** Registrar timestamp da submissão, alterar status do contrato para "Em Avaliação", notificar o contratante e disparar contagem regressiva do prazo de análise padrão de 5 dias úteis.
* **Saídas/Resultados:** Notificação expedida ao contratante com área de pré-visualização e botões de ação ("Aprovar" / "Recusar com Justificativa").
* **Pós-condições:** Caso o contratante aprove, o sistema dispara a liberação de pagamento (RF-011).
* **Fluxos Alternativos e Exceções:**
  * *E1 — Expiração do prazo de 5 dias úteis sem manifestação do contratante:* O sistema executa aprovação tácita automática conforme RN-002 e dispara RF-011.
  * *E2 — Recusa fundamentada pelo contratante:* O contrato é direcionado para ciclo de ajustes ou para a esteira de disputas (RF-012).
* **Regras de Negócio Relacionadas:** RN-002.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Disparo automático do temporizador de avaliação de 5 dias úteis imediatamente após o envio.
  * Implementação da rotina de aprovação tácita automática por decurso de prazo.
* **Casos de Uso Relacionados:** UC-009.

---

### RF-010 — Avaliação Mútua de Reputação
* **Título:** Avaliação bidirecional entre contratante e influenciador após o serviço.
* **Descrição:** O sistema deve permitir que contratante e contratado forneçam nota (escala de 1 a 5 estrelas), tags de recomendação e comentários sobre a experiência de colaboração após o encerramento do contrato.
* **Objetivo:** Construir histórico fidedigno de confiabilidade e qualidade dos participantes na plataforma.
* **Stakeholders:** Contratante (STK-02), Contratado (STK-01).
* **Ator Principal:** Contratante ou Contratado.
* **Pré-condições:** Contrato finalizado com status "Concluído".
* **Entradas:** Pontuação de 1 a 5 estrelas, tags qualitativas (pontualidade, comunicação, qualidade técnica) e parecer textual descritivo opcional.
* **Processamento Esperado:** Computar a nova média de reputação do perfil avaliado e publicar o relato no perfil público.
* **Saídas/Resultados:** Média de avaliação e comentários atualizados nos perfis de ambos os usuários.
* **Pós-condições:** Feedback exibido publicamente para consulta por futuros parceiros comerciais.
* **Fluxos Alternativos e Exceções:**
  * *E1 — Tentativa de avaliar mais de uma vez o mesmo contrato:* O sistema restringe a submissão a um único registro por parte.
* **Regras de Negócio Relacionadas:** Diretrizes de integridade de comunidade.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Escala numérica padronizada de 1 a 5 estrelas.
  * Formulário de avaliação liberado unicamente após a conclusão formal do contrato.
  * Garantia de que cada parte pode avaliar apenas uma vez por contrato.
* **Casos de Uso Relacionados:** UC-010.

---

### RF-011 — Liberação e Repasse do Pagamento ao Contratado
* **Título:** Liquidação financeira do valor em custódia e recolhimento de comissão.
* **Descrição:** O sistema deve efetivar a liberação dos recursos custodiados após a aprovação do material entregue (ou aprovação tácita após 5 dias úteis), repassando o valor líquido à conta bancária do criador e creditando a taxa de 12,5% à plataforma.
* **Objetivo:** Concluir a transação financeira de modo transparente, seguro e automatizado.
* **Stakeholders:** Contratado (STK-01), Contratante (STK-02), Plataforma (STK-03).
* **Ator Principal:** Sistema (rotina automática) ou Suporte (em liquidação mediada).
* **Pré-condições:** Conteúdo aprovado pelo contratante ou prazo de avaliação de 5 dias úteis expirado sem manifestação.
* **Entradas:** Comando de aprovação formal ou evento de expiração de temporizador.
* **Processamento Esperado:** Calcular valor líquido (`Bruto × 0,875`) e comissão da plataforma (`Bruto × 0,125`); emitir ordem de transferência via gateway para a conta bancária/PIX do criador; reter saldo da plataforma; atualizar status do contrato para "Concluído".
* **Saídas/Resultados:** Transferência efetivada, comprovante disponibilizado e notificações de liquidação enviadas.
* **Pós-condições:** Contrato formalmente finalizado; partes liberadas para avaliação mútua (RF-010).
* **Fluxos Alternativos e Exceções:**
  * *E1 — Falha técnica no gateway:* Registrar pendência em fila de reprocessamento e alertar a equipe técnica.
  * *E2 — Disputa aberta durante o processo:* Bloqueio compulsório e imediato de qualquer transferência financeira até parecer final do suporte (RF-012).
* **Regras de Negócio Relacionadas:** RN-001, RN-002.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Cálculo rigoroso e auditável da taxa de intermediação de 12,5%.
  * Execução da liquidação estritamente subordinada à aprovação formal ou decurso de prazo.
* **Casos de Uso Relacionados:** UC-011.

---

### RF-012 — Abertura, Mediação de Disputas e Reembolso
* **Título:** Contestação de entregas, arbitragem pelo suporte e processamento de estorno.
* **Descrição:** O sistema deve permitir que qualquer das partes protocole contestação formal por descumprimento de prazos, má-fé ou recusa imotivada de material, congelando os fundos em custódia para arbitragem do suporte com prazo máximo de 7 (sete) dias corridos.
* **Objetivo:** Proteger os usuários contra fraudes e garantir resolução justa de controvérsias operacionais.
* **Stakeholders:** Contratante (STK-02), Contratado (STK-01), Suporte (STK-04).
* **Ator Principal:** Contratante ou Contratado (requerente) e Suporte Técnico (analista/árbitro).
* **Pré-condições:** Contrato em execução com valores ainda custodiados em garantia.
* **Entradas:** Motivo formal da disputa, relatório descritivo e evidências comprobatórias (capturas de tela, documentos, mensagens).
* **Processamento Esperado:** Congelar imediatamente o status do contrato e os valores em custódia; notificar a contraparte e abrir chamado prioritário no painel de suporte; permitir ao suporte emitir parecer em até 7 dias corridos deliberando por: estorno total à empresa, repasse integral ao criador ou divisão proporcional de valores.
* **Saídas/Resultados:** Parecer de mediação registrado, ordem de estorno/repasse executada e partes notificadas com extrato conclusivo.
* **Pós-condições:** Disputa encerrada e contrato arquivado com status "Encerrado por Disputa".
* **Fluxos Alternativos e Exceções:**
  * *E1 — Acordo consensual prévio:* Caso as partes cheguem a entendimento antes do laudo do suporte, a disputa pode ser extinta consensualmente.
* **Regras de Negócio Relacionadas:** RN-003.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Critérios de Aceite:**
  * Bloqueio imediato da liquidação no instante do protocolo da contestação.
  * Resolução e emissão de laudo pelo suporte técnico em até 7 dias corridos.
* **Casos de Uso Relacionados:** UC-012.

---

## 4. Requisitos Não Funcionais (RNF)

---

### RNF-001 — Segurança da Informação e Conformidade LGPD
* **Categoria:** Segurança da Informação.
* **Descrição:** O sistema deve resguardar os dados pessoais e bancários de seus usuários por meio de criptografia forte em trânsito e em repouso, em plena conformidade com a LGPD (Lei nº 13.709/2018).
* **Justificativa:** Prevenir vazamento de dados fiscais/pessoais e assegurar proteção legal aos envolvidos.
* **Critérios Mensuráveis / Métricas:**
  * Dados em trânsito criptografados obrigatoriamente via protocolo **TLS 1.3** (mínimo TLS 1.2).
  * Dados sensíveis em repouso (CPF, dados bancários, RG) cifrados com algoritmo **AES-256** com gestão segura de chaves.
  * Registro de logs de auditoria para 100% dos acessos a registros sensíveis.
* **Escopo:** Todos os módulos de persistência e tráfego de rede da plataforma.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos Relacionados:** RF-001, RF-003, RF-007, RF-008.

---

### RNF-002 — Conformidade PCI-DSS e Gestão de Pagamentos
* **Categoria:** Segurança Financeira e Conformidade Regulatória.
* **Descrição:** A plataforma não deve armazenar, processar ou transmitir em seus servidores próprios dados abertos de cartões de crédito (PAN, CVV), delegando o fluxo integral a gateway de pagamentos auditado e certificado PCI-DSS nível 1.
* **Justificativa:** Reduzir riscos de comprometimento de dados financeiros e mitigar custos de conformidade de infraestrutura.
* **Critérios Mensuráveis / Métricas:**
  * 0% de dados de cartão em tabelas ou logs da aplicação.
  * Uso estrito de bibliotecas SDK de tokenização fornecidas pelo gateway credenciado.
* **Escopo:** Módulo de pagamentos e liquidação (RF-008 e RF-011).
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos Relacionados:** RF-008, RF-011.

---

### RNF-003 — Desempenho e Tempo de Resposta
* **Categoria:** Desempenho e Eficiência.
* **Descrição:** As requisições essenciais da plataforma devem manter tempos de latência reduzidos sob condições operacionais normais de carga.
* **Justificativa:** Proporcionar navegação fluida em conexões móveis e reduzir abandono de uso.
* **Critérios Mensuráveis / Métricas:**
  * Tempo de resposta percentil 95 (**P95**) ≤ 3,0 segundos para listagem do hub de vagas, carregamento de portfólios e submissão de candidaturas.
* **Escopo:** Catálogo de vagas, perfis públicos e motor de busca.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Requisitos Relacionados:** RF-004, RF-005, RF-006.

---

### RNF-004 — Disponibilidade e Tolerância a Falhas
* **Categoria:** Disponibilidade e Continuidade de Negócio.
* **Descrição:** O sistema deve apresentar alta disponibilidade para assegurar a continuidade de transações de pagamento e prazos contratuais.
* **Justificativa:** Falhas ou interrupções geram perdas financeiras diretas e quebra de confiabilidade entre empresas e criadores.
* **Critérios Mensuráveis / Métricas:**
  * Índice de disponibilidade de serviço (**Uptime**) ≥ 99,0% no cômputo mensal (downtime não planejado máximo de ~7,3 horas/mês).
  * Mecanismo automatizado de monitoramento de saúde de serviços (*health check*) e alertas em tempo real.
* **Escopo:** Todos os serviços de backend, frontend e banco de dados.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Requisitos Relacionados:** RF-008, RF-009, RF-011.

---

### RNF-005 — Usabilidade Mobile-First e Responsividade
* **Categoria:** Usabilidade e Compatibilidade.
* **Descrição:** A interface do usuário deve ser concebida sob o paradigma *mobile-first*, operando com total ergonomia em telas de smartphones e adaptando-se a resoluções de desktop.
* **Justificativa:** O público de influenciadores opera de forma preponderante através de dispositivos móveis no gerenciamento diário de campanhas.
* **Critérios Mensuráveis / Métricas:**
  * Compatibilidade e renderização sem quebras em larguras de tela de 360px a 1920px.
  * Validação satisfatória em testes heurísticos de usabilidade com usuários representativos.
* **Escopo:** Módulos de interface de usuário (frontend).
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Requisitos Relacionados:** RF-001, RF-002, RF-004, RF-005, RF-009.

---

## 5. Outros Requisitos Relevantes

### 5.1 Requisitos de Integração (REQ-INT)
* **REQ-INT-01 — Integração com Gateway de Pagamentos:** Comunicação bidirecional segura com gateway parceiro via webhooks para processamento de cobrança, retenção em custódia e transferências PIX/TED.
* **REQ-INT-02 — Provedor de Mensageria e Notificações:** Integração com serviços de mensageria transacional (e-mail e notificações push) para avisos de candidatura, assinatura de contrato e expiração de prazos de entrega.

### 5.2 Requisitos Legais e Auditoria (REQ-LEG)
* **REQ-LEG-01 — Registro Indelével de Contratos e Consentimentos:** Manutenção de trilhas de auditoria contendo hashes criptográficos, data/hora e identificadores de aceites contratuais para fins de comprovação jurídica por período mínimo legal de 5 (cinco) anos.

---

## 6. Premissas e Restrições do Sistema

### 6.1 Premissas
1. Os contratantes possuem capacidade financeira e cadastral verificável para emissão de notas ou contratações publicitárias.
2. Os influenciadores dispõem de conectividade com a internet e smartphone compatível com navegadores modernos para submissão de materiais.
3. Existência de serviços bancários e gateways com suporte a liquidação via PIX ou liquidação eletrônica no território nacional.

### 6.2 Restrições
1. O sistema não custeia taxas adicionais de saque que venham a ser cobradas pelas instituições bancárias de destino do usuário.
2. A plataforma não assume responsabilidade jurídica pelo conteúdo editorial publicado nas redes sociais externas dos influenciadores, atuando exclusivamente como intermediadora técnica e financeira.

---

## 7. Matriz Geral de Rastreabilidade

| Requisito Funcional | Nome Resumido | Regras de Negócio (RN) | Requisitos Não Funcionais (RNF) | Caso de Uso Associado |
|---|---|---|---|---|
| **RF-001** | Cadastro do Contratado | RN-004 | RNF-001 | UC-001 |
| **RF-002** | Gestão de Portfólio | RN-005 | RNF-003, RNF-005 | UC-002 |
| **RF-003** | Cadastro do Contratante | RN-004 | RNF-001 | UC-003 |
| **RF-004** | Publicação de Vagas | RN-001, RN-004 | RNF-003, RNF-005 | UC-004 |
| **RF-005** | Consulta e Candidatura | RN-001 | RNF-003, RNF-005 | UC-005 |
| **RF-006** | Exploração de Perfis | RN-004 | RNF-003 | UC-006 |
| **RF-007** | Formalização de Contrato | RN-002, RN-004 | RNF-001 | UC-007 |
| **RF-008** | Pagamento em Escrow | RN-001, RN-002 | RNF-002, RNF-004 | UC-008 |
| **RF-009** | Entrega e Avaliação | RN-002 | RNF-004, RNF-005 | UC-009 |
| **RF-010** | Avaliação Mútua | — | RNF-005 | UC-010 |
| **RF-011** | Liberação de Pagamento | RN-001, RN-002 | RNF-002, RNF-004 | UC-011 |
| **RF-012** | Disputas e Reembolso | RN-003 | RNF-001 | UC-012 |
