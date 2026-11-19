# Engenharia do Jogo de Truco Brasileiro (Truco Paulista & Truco Mineiro)

**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE  
**Instituição:** Universidade Estadual de Maringá (UEM)  
**Repositório:** [TrabalhoASS](https://github.com/vitxt/TrabalhoASS)  

---

## Integrantes do Grupo

* **Vitor Teodoro Correa** — RA 143757
* **Arthur Spirandelli** — RA 144136

---

## Objetivo do Projeto

O projeto consiste na **engenharia de requisitos, modelagem orientada a objetos e especificação comportamental** completa do tradicional jogo de cartas brasileiro **Truco**, cobrindo com rigor matemático e normativo as variantes mais consagradas: **Truco Paulista** e **Truco Mineiro**.

O projeto contempla a arquitetura do motor de regras, gestão da mesa em tempo real, aleatoriedade criptográfica no embaralhamento, rodadas em melhor de três vazas, escalonamento formal de apostas e situações especiais:
1. Modalidades de disputa: **1v1 (Mano a Mano)** e **2v2 (Em Duplas)**.
2. Composição oficial em **Baralho Limpo** (40 cartas sem 8, 9 e 10).
3. Determinação de **Manilhas**:
   - **Truco Paulista:** Dinâmica cíclica calculada a cada rodada pela carta Vira (`valor_vira + 1 = manilha`).
   - **Truco Mineiro:** Manilhas fixas clássicas (Zap 4♣, 7♥, Espadilha A♠, 7♦).
4. Hierarquia rigorosa de naipes das Manilhas: Zap (Paus ♣) > Copilha (Copas ♥) > Espadilha (Espadas ♠) > Picafumo (Ouros ♦).
5. Desempate formal de vazas ("Canga / Empate") na 1ª, 2ª e 3ª quedas.
6. Blefe estratégico com descarte de **Carta Encoberta** (proibido na 1ª vaza).
7. Escalonamento e retruco de apostas: **Normal (1 tento) -> Truco (3) -> Seis (6) -> Nove (9) -> Doze (12)**.
8. Protocolo oficial de **Mão de 11** (inspeção compartilhada, opção de correr e veto absoluto a pedidos de Truco).
9. Protocolo oficial de **Mão de Ferro** (disputa no escuro às cegas em 11 x 11).
10. Condição de vitória aos **12 tentos** e log de auditoria.

---

## Estrutura da Documentação e Artefatos

Todos os documentos de engenharia de software foram elaborados em Markdown e PlantUML, com compilação automatizada para PDF e imagens de alta resolução na pasta [docs/](docs/):

| Artefato | Descrição | Fonte Editável | Arquivo Final (PDF / Imagem) |
|---|---|:---:|:---:|
| **Regras de Negócio** | Especificação normativa das 16 regras oficiais (RN-001 a RN-016): Manilhas, Vira, Canga, Apostas, Mão de 11 e Mão de Ferro | [regras-negocio.md](docs/regras-negocio.md) | [regras-negocio.pdf](docs/regras-negocio.pdf) |
| **Requisitos de Software** | Requisitos Funcionais (RF-001 a RF-015), Não Funcionais (RNF-001 a RNF-006) e Matriz de Rastreabilidade | [requisitos.md](docs/requisitos.md) | [requisitos.pdf](docs/requisitos.pdf) |
| **Casos de Uso** | Especificação detalhada dos fluxos principais, alternativos e exceções (UC-001 a UC-012) | [casos-de-uso.md](docs/casos-de-uso.md) | [casos-de-uso.pdf](docs/casos-de-uso.pdf) |
| **Diagrama de Casos de Uso** | Diagrama UML com limite do sistema, pacotes temáticos, atores e relações | [diagrama-casos-de-uso.puml](docs/diagrama-casos-de-uso.puml) | [PNG](docs/diagrama-casos-de-uso.png) \| [PDF](docs/diagrama-casos-de-uso.pdf) |
| **Diagrama de Sequência** | Ciclo de vida completo de uma rodada de Truco (embaralhamento, vira, vazas, pedido de Truco e pontuação) | [diagrama-sequencia.puml](docs/diagrama-sequencia.puml) | [PNG](docs/diagrama-sequencia.png) \| [PDF](docs/diagrama-sequencia.pdf) |

