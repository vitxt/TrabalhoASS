# Documento de Regras de Negócio (RN)
**Projeto:** Plataforma de Conexão entre Empresas e Influenciadores / Criadores de Conteúdo  
**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE — Universidade Estadual de Maringá (UEM)  
**Autores:**  
- Vitor Teodoro Correa — RA 143757  
- Arthur Spirandelli — RA 144136  

---

## 1. Introdução

O presente documento consolida as **Regras de Negócio (RN)** que regem a plataforma de intermediação e contratação de criadores de conteúdo (influenciadores/freelancers) por empresas anunciantes (contratantes).

---

## 2. Identificação e Notação

As regras seguem o padrão `RN-XXX`, estruturadas nos seguintes campos normativos:
- **Título e Descrição:** Definição objetiva da regra.
- **Origem:** Motivação estratégica ou regulatória.
- **Stakeholders Envolvidos:** Atores diretamente afetados pela regra.
- **Condição de Aplicação:** Momento e contexto em que a regra é disparada.
- **Regra:** Conduta estrita e diretrizes a serem aplicadas pelo negócio/sistema.
- **Exceções:** Hipóteses de desvio autorizadas.
- **Dados Envolvidos:** Atributos e entidades essenciais.
- **Prioridade:** Nível de relevância para o negócio (`Crítica`, `Alta`, `Média`, `Baixa`).
- **Status:** Estado atual da regra (`Aprovado`).
- **Requisitos Relacionados:** Vínculos de rastreabilidade com Requisitos Funcionais e Não Funcionais.

---

## 3. Especificação das Regras de Negócio

---

### RN-001 — Comissão da Plataforma

* **Título:** Cobrança de taxa de intermediação sobre contratos fechados.
* **Descrição:** A plataforma retém 12,5% sobre o valor bruto acordado em cada contrato firmado entre contratante e contratado. Esse percentual remunera a intermediação, garantia financeira e infraestrutura do serviço. O valor exibido na vaga para o freelancer já é líquido da taxa.
* **Origem:** Requisito de negócio fundamental — modelo de sustentabilidade e monetização.
* **Stakeholders envolvidos:** Contratante (STK-02), Contratado (STK-01), Plataforma (STK-03).
* **Condição:** Aplicada compulsoriamente na formalização e liquidação de qualquer contrato na plataforma.
* **Regra:**
  1. O contratante realiza o pagamento do **valor bruto** acordado para a vaga ou contratação direta.
  2. A plataforma calcula e retém **12,5%** desse valor a título de comissão de serviço.
  3. O contratado recebe o **valor líquido**, equivalente a `Valor Bruto × (1 − 0,125)`.
  4. Para o contratado, o valor anunciado na vaga e na proposta deve explicitar com transparência o valor líquido que lhe será creditado.
* **Exceções:** Nenhuma no Produto Mínimo Viável (MVP).
* **Dados envolvidos:** Valor bruto do contrato, taxa percentual de comissão (12,5%), valor retido da plataforma, valor líquido a repassar.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-004, RF-008, RF-011.

---

### RN-002 — Liberação de Pagamento Condicional à Aprovação de Conteúdo (Escrow)

* **Título:** Retenção em garantia (*escrow*) até a entrega e validação do conteúdo.
* **Descrição:** O valor integral pago pelo contratante é retido em custódia pela plataforma no momento da assinatura do contrato, sendo transferido ao contratado exclusivamente após o contratante avaliar e aprovar formalmente o material entregue.
* **Origem:** Requisito de negócio — mitigação de fraudes, garantia mútua e proteção contra descumprimento de prazos/qualidade.
* **Stakeholders envolvidos:** Contratante (STK-02), Contratado (STK-01), Plataforma (STK-03), Suporte (STK-04).
* **Condição:** Aplicada a todos os contratos em execução na plataforma.
* **Regra:**
  1. O contratante efetua o aporte financeiro imediatamente após a formalização do contrato.
  2. O montante permanece custodiado em conta vinculada (*escrow*), impedindo saques precoces.
  3. O contratado elabora e submete o material via plataforma para prévia visualização do contratante.
  4. O contratante dispõe de um prazo regulamentar padrão de **5 (cinco) dias úteis** (parametrizável formalmente no contrato) para avaliar o conteúdo, podendo **Aprovar** ou **Recusar com Justificativa**.
  5. Uma vez aprovado, o pagamento líquido é liberado para o contratado (deduzida a comissão conforme RN-001).
* **Exceções:** Caso o contratante não se manifeste (não aprove nem justifique recusa) dentro do prazo limite de 5 dias úteis estabelecido no contrato, o sistema realiza a **aprovação tácita automática**, liberando os valores devidos ao contratado.
* **Dados envolvidos:** ID do contrato, valor em custódia, data/hora da entrega, prazo limite de avaliação (5 dias úteis), status de aprovação, logs de auditoria.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-007, RF-008, RF-009, RF-011.

---

### RN-003 — Reembolso em Caso de Golpe ou Disputa

* **Título:** Procedimento de mediação e reembolso por descumprimento ou fraude.
* **Descrição:** Ambas as partes possuem a prerrogativa de acionar a equipe de suporte para abertura de mediação caso identifiquem má-fé, inexecução das entregas prometidas ou recusa injustificada de material.
* **Origem:** Requisito de negócio — confiabilidade, conformidade jurídica e segurança do ecossistema.
* **Stakeholders envolvidos:** Contratante (STK-02), Contratado (STK-01), Suporte (STK-04), Plataforma (STK-03).
* **Condição:** Disparada mediante requerimento formal de contestação ou denúncia antes ou durante a fase de liquidação.
* **Regra:**
  1. O contratante pode solicitar reembolso caso o influenciador não entregue o material dentro do prazo ou desrespeite as diretrizes contratuais.
  2. O contratado pode acionar o suporte caso a empresa recuse o trabalho reiteradamente sem justificativa válida ou quebre o acordo preliminar.
  3. A abertura da disputa congela imediatamente qualquer repasse financeiro do contrato em questão.
  4. A equipe de suporte dispõe de prazo máximo de **7 (sete) dias corridos** para analisar o histórico de conversas, contrato e evidências para deliberar pelo estorno integral ao contratante, estorno parcial ou liberação compulsória ao contratado.
* **Exceções:** Se os valores já tiverem sido sacados/transferidos ao contratado, o reembolso requer mediação administrativa ou medidas legais externas.
* **Dados envolvidos:** Registro da disputa, justificativas, arquivos de evidência, histórico de comunicação na plataforma, status financeiro, parecer conclusivo em até 7 dias corridos.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-012.

---

### RN-004 — Conformidade com LGPD e Cessão de Direitos de Imagem

* **Título:** Tratamento de dados pessoais e formalização dos direitos de veiculação.
* **Descrição:** As operações da plataforma devem obedecer à Lei Geral de Proteção de Dados (Lei nº 13.709/2018), salvaguardando a privacidade dos titulares e garantindo cláusulas mandatórias de licenciamento/cessão de uso de imagem e voz nos contratos de campanha.
* **Origem:** Obrigatoriedade legal brasileira e mitigação de passivos jurídicos para as marcas contratantes.
* **Stakeholders envolvidos:** Contratado (STK-01), Contratante (STK-02), Plataforma (STK-03).
* **Condição:** Permanente em toda coleta de dados cadastrais e em todos os instrumentos contratuais emitidos.
* **Regra:**
  1. Dados sensíveis e fiscais (CPF, RG, domicílio bancário, chave PIX) devem receber tratamento criptográfico robusto e acesso estritamente restrito.
  2. Todo contrato gerado na plataforma deve conter cláusula expressa delimitando escopo, mídia, praça e período de veiculação da imagem/voz do contratado.
  3. O contratado deve registrar consentimento digital inequívoco prévio à validação do contrato.
  4. O titular de dados dispõe de canal para requerer retificação e exclusão de seus dados pessoais, respeitados os prazos fiscais e regulatórios de guarda obrigatória.
* **Exceções:** Fornecimento de dados mediante ordem judicial formal ou requerimento de autoridades competentes na forma da lei.
* **Dados envolvidos:** Dados pessoais cadastrais, consentimentos, contratos digitais, assinaturas eletrônicas com registro temporal.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RNF-001, RNF-002, RF-001, RF-003, RF-007.

---

### RN-005 — Portfólio com Limite de Vídeos Hospedados

* **Título:** Governança e limite de mídia nativa no portfólio profissional.
* **Descrição:** O contratado pode estruturar seu portfólio profissional com múltiplos formatos (textos, fotos, certificações e links externos), porém o armazenamento direto de vídeos na plataforma possui um limite estrito por perfil.
* **Origem:** Decisão de produto — incentivo à curadoria qualitativa dos melhores trabalhos e controle de custos de largura de banda e armazenamento em nuvem.
* **Stakeholders envolvidos:** Contratado (STK-01), Contratante (STK-02), Plataforma (STK-03).
* **Condição:** Aplicada no momento de upload e publicação de itens no portfólio do criador.
* **Regra:**
  1. O criador pode adicionar links externos de plataformas de vídeo (YouTube, Vimeo, TikTok, Instagram) sem limitação quantitativa.
  2. O envio de arquivos de vídeo hospedados diretamente na infraestrutura da plataforma é limitado a no máximo **5 (cinco) arquivos ativos** por usuário.
  3. Cada arquivo de vídeo nativo enviado deve possuir tamanho máximo de **250 MB** nos formatos aceitos (MP4, MOV).
  4. Fotos, documentos anexos e apresentações textuais possuem franquia independente definida nas configurações de sistema.
* **Exceções:** Planos futuros de perfil institucional ou criadores parceiros poderão receber cotas de armazenamento diferenciadas.
* **Dados envolvidos:** Itens de portfólio, arquivo de mídia (máx. 250 MB), tipo MIME, links externos referenciados.
* **Prioridade:** Média.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-002.

---

## 4. Matriz de Rastreabilidade das Regras de Negócio

| Regra de Negócio | Título | Requisitos Funcionais Relacionados | Requisitos Não Funcionais Relacionados | Casos de Uso Relacionados |
|---|---|---|---|---|
| **RN-001** | Comissão da Plataforma | RF-004, RF-008, RF-011 | RNF-002 | UC-004, UC-008, UC-011 |
| **RN-002** | Pagamento em Escrow e Aprovação | RF-007, RF-008, RF-009, RF-011 | RNF-002, RNF-004 | UC-007, UC-008, UC-009, UC-011 |
| **RN-003** | Reembolso e Disputas | RF-012 | RNF-001 | UC-012 |
| **RN-004** | LGPD e Direitos de Imagem | RF-001, RF-003, RF-007 | RNF-001, RNF-002 | UC-001, UC-003, UC-007 |
| **RN-005** | Limite de Vídeos no Portfólio | RF-002 | RNF-003, RNF-005 | UC-002 |
