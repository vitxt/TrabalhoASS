# TrabalhoASS — Análise de Sistemas de Software

**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE  
**Instituição:** Universidade Estadual de Maringá (UEM)  
**Integrantes do Grupo:**  
- **Vitor Teodoro Correa** — RA 143757  
- **Arthur Spirandelli** — RA 144136  

---

## Estrutura do Repositório: Ambientes de Trabalho (Work-Envs)

O repositório foi organizado em **dois ambientes de trabalho independentes**, cada um estruturado com rigorosa documentação de engenharia de software e implementações:

```
ass/
├── plataforma-influenciadores/    # AMBIENTE 1: SaaS Marketplace de Influenciadores
│   ├── docs/                      # Regras de Negócio, Requisitos, Casos de Uso, UML (MD, PDF, PNG)
│   ├── tools/                     # Scripts de compilação (md2pdf, puml2png)
│   ├── backend/                   # Instância Backend (API REST Node.js/Express + SQLite)
│   ├── frontend/                  # Instância Frontend (SPA Web Moderna e Responsiva)
│   └── README.md                  # Especificação e guia de execução do SaaS
│
└── jogo-truco/                    # AMBIENTE 2: Engenharia do Jogo Tradicional de Truco
    ├── docs/                      # Regras de Negócio, Requisitos, Casos de Uso, UML (MD, PDF, PNG)
    ├── tools/                     # Scripts de compilação automatizada
    ├── engine/                    # Motor de Regras Executável em Python + Bateria de Testes
    └── README.md                  # Especificação das regras do Truco Paulista & Mineiro
```

---

## Ambiente 1: `plataforma-influenciadores/`
Plataforma SaaS que conecta empresas anunciantes a influenciadores digitais, intermediando o ciclo de contratação, formalização de acordos com termos LGPD (**RN-004**), garantia financeira sob custódia *escrow* (**RN-002**), comissão de intermediação de 12,5% (**RN-001**) e mediação de disputas (**RN-003**).

* **Documentos:** [docs/](plataforma-influenciadores/docs/) com PDFs e diagramas UML de Casos de Uso e Sequência.
* **Backend:** API RESTful com autenticação, campanhas, propostas, contratos, custódia e disputas.
* **Frontend:** Interface SPA moderna servida na porta 4000.
* **Execução Rápida:**
  ```bash
  cd plataforma-influenciadores/backend
  npm install && npm run seed && npm start
  # Acesse http://localhost:4000
  ```

---

## Ambiente 2: `jogo-truco/`
Engenharia formal de software do tradicional jogo de cartas **Truco Brasileiro**, cobrindo com rigor matemático as variantes **Truco Paulista** (manilhas dinâmicas por Vira) e **Truco Mineiro** (manilhas fixas), nas modalidades 1v1 e 2v2 em duplas.

* **Documentos e Artefatos (PT-BR):**
  - **Regras de Negócio (RN-001 a RN-016):** Manilhas, naipes, baralho limpo, canga/empate, blefe encoberto, escalonamento (Truco, Seis, Nove, Doze), Mão de 11 e Mão de Ferro.
  - **Especificação de Requisitos (SRS):** Requisitos Funcionais (RF-001 a RF-015), Não Funcionais (RNF-001 a RNF-006) e Matriz de Rastreabilidade.
  - **Casos de Uso (UC-001 a UC-012):** Fluxos detalhados, alternativos e exceções.
  - **Diagramas UML:** Casos de Uso e Sequência temporal completa em PlantUML, PNG e PDF.
* **Motor Executável & Testes:**
  ```bash
  cd jogo-truco/engine
  python3 test_truco.py
  ```
* **Compilação de Documentos:**
  ```bash
  cd jogo-truco/tools
  python3 build_all_docs.py
  ```
