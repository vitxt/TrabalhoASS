# Plataforma de Conexão entre Empresas e Influenciadores / Criadores de Conteúdo

**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE  
**Instituição:** Universidade Estadual de Maringá (UEM)  
**Repositório:** [TrabalhoASS](https://github.com/vitxt/TrabalhoASS)  

---

## Integrantes do Grupo

* **Vitor Teodoro Correa** — RA 143757
* **Arthur Spirandelli** — RA 144136

---

## Objetivo do Projeto

O projeto consiste na concepção, especificação de requisitos e modelagem orientada a objetos de uma **plataforma digital marketplace** destinada a conectar empresas anunciantes (**Contratantes**) a criadores de conteúdo e influenciadores digitais (**Contratados**).

A plataforma intermedia todo o ciclo de contratação de campanhas publicitárias:
1. Publicação de vagas e busca ativa de perfis por nicho.
2. Candidatura e envio de propostas com transparência de valores líquidos.
3. Formalização contratual digital com cessão expressa de direitos de imagem (LGPD).
4. Retenção preventiva de pagamento em garantia (*escrow*) via gateway de pagamentos.
5. Entrega, pré-visualização e homologação de conteúdo antes do repasse financeiro.
6. Liquidação com desconto da taxa de comissão da plataforma (12,5%).
7. Mediação humana de disputas pelo suporte técnico e avaliação bilateral de reputação.

---

## Estrutura da Documentação e Artefatos

Todos os documentos de engenharia de software foram elaborados com fontes editáveis em Markdown/PlantUML e exportados para PDF e imagens de alta resolução na pasta [docs/](docs/):

| Artefato | Descrição | Fonte Editável | Arquivo Final (PDF / Imagem) |
|---|---|:---:|:---:|
| **Regras de Negócio** | Diretrizes financeiras (12,5%), retenção *escrow*, política de cancelamento, LGPD e limite de vídeos no portfólio | [regras-negocio.md](docs/regras-negocio.md) | [regras-negocio.pdf](docs/regras-negocio.pdf) |
| **Requisitos de Software** | Requisitos Funcionais (RF-001 a RF-012), Não Funcionais (RNF-001 a RNF-005), outros requisitos, restrições e rastreabilidade | [requisitos.md](docs/requisitos.md) | [requisitos.pdf](docs/requisitos.pdf) |
| **Casos de Uso** | Especificação detalhada dos fluxos principais, alternativos, exceções, pré e pós-condições (UC-001 a UC-012) | [casos-de-uso.md](docs/casos-de-uso.md) | [casos-de-uso.pdf](docs/casos-de-uso.pdf) |
| **Diagrama de Casos de Uso** | Diagrama UML com limite do sistema, atores e casos de uso | [diagrama-casos-de-uso.puml](docs/diagrama-casos-de-uso.puml) | [PNG](docs/diagrama-casos-de-uso.png) \| [PDF](docs/diagrama-casos-de-uso.pdf) |
| **Diagrama de Sequência** | Cenário representativo de contratação, aporte *escrow*, entrega, aprovação, aprovação tácita e mediação | [diagrama-sequencia.puml](docs/diagrama-sequencia.puml) | [PNG](docs/diagrama-sequencia.png) \| [PDF](docs/diagrama-sequencia.pdf) |

---

## Visão Geral dos Diagramas UML

### Diagrama de Casos de Uso
O diagrama modela os limites da plataforma, relacionando os atores (**Contratado**, **Contratante**, **Suporte Técnico** e **Gateway de Pagamentos**) aos casos de uso centrais (`UC-001` a `UC-012`), detalhando relações de extensão e inclusão.
* Visualizar fonte: [docs/diagrama-casos-de-uso.puml](docs/diagrama-casos-de-uso.puml)
* Visualizar imagem: [docs/diagrama-casos-de-uso.png](docs/diagrama-casos-de-uso.png)

### Diagrama de Sequência
Representa temporalmente o ciclo operacional completo de uma campanha publicitária:
1. Formalização e assinatura digital do contrato (RF-007, RN-004).
2. Cobrança e bloqueio de fundos em custódia *escrow* via gateway (RF-008, RN-002).
3. Produção e entrega do material pelo influenciador (RF-009).
4. Homologação através de três cenários:
   * **Cenário Principal:** Aprovação expressa pelo contratante com repasse líquido e recolhimento de comissão (12,5%) (RF-011, RN-001).
   * **Cenário Alternativo 1:** Aprovação tácita automática por decurso de prazo regulamentar de 5 dias úteis (RN-002).
   * **Cenário Alternativo 2:** Recusa com instauração de disputa e arbitragem do suporte em até 7 dias corridos (RF-012, RN-003).
* Visualizar fonte: [docs/diagrama-sequencia.puml](docs/diagrama-sequencia.puml)
* Visualizar imagem: [docs/diagrama-sequencia.png](docs/diagrama-sequencia.png)

---

## Matriz Resumida de Rastreabilidade

| Regra de Negócio (RN) | Requisitos Funcionais | Requisitos Não Funcionais | Casos de Uso |
|---|---|---|---|
| **RN-001** (Comissão de 12,5%) | RF-004, RF-008, RF-011 | RNF-002 | UC-004, UC-008, UC-011 |
| **RN-002** (Pagamento Escrow e Aprovação) | RF-007, RF-008, RF-009, RF-011 | RNF-002, RNF-004 | UC-007, UC-008, UC-009, UC-011 |
| **RN-003** (Reembolso e Disputas) | RF-012 | RNF-001 | UC-012 |
| **RN-004** (LGPD e Direitos de Imagem) | RF-001, RF-003, RF-007 | RNF-001, RNF-002 | UC-001, UC-003, UC-007 |
| **RN-005** (Limite de Vídeos no Portfólio) | RF-002 | RNF-003, RNF-005 | UC-002 |

---

## Implementação Completa: Backend e Frontend

Este diretório implementa integralmente os requisitos funcionais e as regras de negócio em duas instâncias:

### 1. Backend (`backend/`)
- API RESTful desenvolvida em Node.js / Express com banco de dados SQLite persistente.
- Módulos implementados:
  - Autenticação e Perfis (Contratante, Contratado, Suporte) com validação de dados bancários e chave PIX.
  - Catálogo de Criadores com busca por nicho e limitação de portfólio a 5 vídeos (**RN-005**).
  - Mural de Campanhas/Vagas com cálculo automático de comissão de 12,5% (**RN-001**).
  - Gestão de Propostas e Formalização de Minutas de Contrato (**RF-007**).
  - Fluxo de Assinatura Digital com consentimento de Cessão de Imagem e LGPD (**RN-004**).
  - Gateway de Pagamentos simulado com retenção em garantia / Escrow (**RN-002**, **RF-008**).
  - Submissão de Entregáveis e Homologação com liquidação instantânea (**RF-009**, **RF-011**).
  - Central de Mediação de Disputas e Arbitragem pelo Suporte Técnico (**RN-003**, **RF-012**).
  - Avaliação bilateral de reputação com 1 a 5 estrelas (**RF-010**).
- **Como executar o Backend:**
  ```bash
  cd backend
  npm install
  npm run seed   # Popula banco de dados com dados de teste
  npm start      # Inicia servidor na porta 4000
  ```

### 2. Frontend (`frontend/`)
- Interface Web moderna e responsiva (Single-Page Application).
- Simulador de perfil ativo em tempo real (Empresas, Criadores e Suporte).
- Abas interativas:
  - 📢 **Vagas & Campanhas:** Publicação de vagas e envio de candidaturas com calculadora em tempo real de retenção de 12,5%.
  - 🌟 **Catálogo de Criadores:** Visualização de métricas e portfólios.
  - 📑 **Contratos & Escrow:** Stepper visual do ciclo contratual, modal de assinatura com termos LGPD e checkout de pagamento em garantia.
  - ⚖️ **Suporte & Disputas:** Painel de resolução de divergências contratuais.
  - 📊 **Governança Financeira:** Métricas do volume transacionado e comissões recolhidas.
- **Como executar o Frontend:**
  - O Backend na porta 4000 já serve o frontend diretamente em [http://localhost:4000](http://localhost:4000).
  - Caso prefira executar o frontend de forma independente:
    ```bash
    cd frontend
    npx serve -l 3000 .
    ```
