# Documento de Regras de Negócio (RN) — Engenharia do Jogo de Truco Brasileiro
**Projeto:** Motor e Plataforma do Jogo Tradicional de Truco (Truco Paulista & Mineiro)  
**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE — Universidade Estadual de Maringá (UEM)  
**Autores:**  
- Vitor Teodoro Correa — RA 143757  
- Arthur Spirandelli — RA 144136  

---

## 1. Introdução

O presente documento formaliza a engenharia de **Regras de Negócio (RN)** que regem a lógica, mecânica, fluxo de apostas e resolução de partidas do tradicional jogo de cartas brasileiro **Truco**.

O sistema modela computacionalmente as duas variantes mais consagradas no Brasil:
1. **Truco Paulista:** Manilhas dinâmicas determinadas a cada rodada pela carta virada na mesa ("Vira").
2. **Truco Mineiro:** Manilhas fixas (Zap / 4 de Paus, 7 de Copas, Espadilha / Ás de Espadas e 7 de Ouros).

---

## 2. Identificação e Notação Normativa

As regras de negócio seguem o padrão identificador `RN-XXX`, contendo:
- **Título e Descrição:** Definição objetiva do conceito ou política.
- **Origem:** Tradição cultural do Truco Brasileiro e regulamentações oficiais da Federação/Confederação de Truco.
- **Stakeholders Envolvidos:** Jogadores (STK-01), Duplas/Equipes (STK-02), Motor de Regras e Juiz Virtual (STK-03).
- **Condição de Aplicação:** Gatilho que dispara a validação da regra.
- **Regra:** Procedimento formal e determinístico a ser executado pelo motor de software.
- **Exceções:** Desvios e condições especiais (ex: Mão de 11, Mão de Ferro).
- **Dados Envolvidos:** Estruturas de dados (cartas, naipes, pontuações, turnos).
- **Prioridade:** Nível de relevância para a integridade da partida (`Crítica`, `Alta`, `Média`).
- **Status:** Estado atual da regra (`Aprovado`).
- **Requisitos Relacionados:** Vínculos diretos com Requisitos Funcionais (RF) e Casos de Uso (UC).

---

## 3. Especificação Detalhada das Regras de Negócio

---

### RN-001 — Modalidades de Partida (Mano a Mano e Duplas)

* **Título:** Suporte a partidas individuais (1 contra 1) e em duplas (2 contra 2).
* **Descrição:** O sistema deve suportar duas modalidades oficiais de disputa: individual (2 jogadores em posições opostas) e duplas (4 jogadores dispostos de forma intercalada: Equipe A vs Equipe B).
* **Origem:** Regra clássica do Truco Brasileiro.
* **Stakeholders envolvidos:** Jogador (STK-01), Duplas (STK-02), Motor de Regras (STK-03).
* **Condição:** Escolhida na criação da sala/partida e imutável durante o jogo.
* **Regra:**
  1. No modo **1v1 (Mano a Mano)**, a partida ocorre estritamente entre 2 jogadores.
  2. No modo **2v2 (Em Duplas)**, participam 4 jogadores divididos em duas equipes de dois integrantes (Jogador 1 + Jogador 3 contra Jogador 2 + Jogador 4).
  3. A ordem de turnos nas duplas é sempre em sentido horário e intercalada entre membros de equipes adversárias.
* **Exceções:** Nenhuma.
* **Dados envolvidos:** Identificador da sala, lista de jogadores, mapeamento de equipes, índice do jogador atual.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-001, RF-002.

---

### RN-002 — Composição do Baralho Oficial (Baralho Limpo)

* **Título:** Estrutura de cartas do baralho limpo (40 cartas).
* **Descrição:** O baralho do jogo é composto exatamente por 40 cartas de baralho francês ou espanhol, excluindo-se completamente os 8s, 9s, 10s e coringas.
* **Origem:** Regulamento Oficial de Torneios de Truco.
* **Stakeholders envolvidos:** Motor de Regras (STK-03).
* **Condição:** Preparação do baralho antes de cada rodada.
* **Regra:**
  1. As 40 cartas aceitas compreendem 10 valores em cada um dos 4 naipes (Paus ♣, Copas ♥, Espadas ♠, Ouros ♦):
     `{4, 5, 6, 7, Q, J, K, A, 2, 3}`.
  2. As cartas `8`, `9`, `10` e os `Jokers/Coringas` não existem no baralho ativo do jogo.
* **Exceções:** O modo Baralho Sujo (com 8, 9 e 10 totalizando 52 cartas) pode existir como variação opcional configurada pelo criador da sala, sendo o Baralho Limpo o padrão normativo.
* **Dados envolvidos:** Array de 40 instâncias de Carta `{valor, naipe}`.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-003, RNF-002.

---

### RN-003 — Distribuição de Cartas e Determinação da Carta "Vira"

* **Título:** Entrega de três cartas por jogador e abertura da carta definidora de manilhas.
* **Descrição:** A cada rodada da partida, o motor embaralha o maço de forma pseudoaleatória criptograficamente segura, distribui 3 cartas para cada jogador e, no Truco Paulista, revela uma carta sobre a mesa denominada "Vira".
* **Origem:** Mecânica fundamental do Truco.
* **Stakeholders envolvidos:** Jogador (STK-01), Motor de Regras (STK-03).
* **Condição:** Início de cada nova rodada (mão) da partida.
* **Regra:**
  1. O motor realiza o embaralhamento e simula o corte do baralho pelo jogador anterior ao distribuidor.
  2. São distribuídas exatamente 3 cartas fechadas para cada participante.
  3. No Truco Paulista, a carta subsequente do topo do maço é virada de face para cima na mesa ("Vira"). As cartas restantes permanecem ocultas no maço de descarte.
  4. No Truco Mineiro, nenhuma carta é virada, pois as manilhas são pré-fixadas (RN-005).
* **Exceções:** Na Mão de Ferro (11x11), as cartas são entregues aos jogadores com a face voltada para baixo, sem que eles próprios as possam inspecionar (RN-013).
* **Dados envolvidos:** Mão de cada jogador (3 cartas), Carta Vira, Maço de descarte.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-003, RF-004, RNF-002.

---

### RN-004 — Cálculo Dinâmico de Manilhas no Truco Paulista

* **Título:** Determinação cíclica das quatro maiores cartas a partir da Vira.
* **Descrição:** No Truco Paulista, as quatro manilhas da rodada são definidas pelo valor imediatamente superior ao da carta Vira, respeitando uma ordem cíclica de valores.
* **Origem:** Variante Paulista do Truco.
* **Stakeholders envolvidos:** Jogador (STK-01), Motor de Regras (STK-03).
* **Condição:** Aplicada imediatamente após a revelação da Vira.
* **Regra:**
  1. A sequência de valores do baralho para cálculo da Manilha é:
     `4 -> 5 -> 6 -> 7 -> Q -> J -> K -> A -> 2 -> 3 -> 4` (o 4 é manilha quando a vira for 3).
  2. A Manilha é a carta de valor exatamente subsequente ao valor da Vira.
     - *Exemplo 1:* Vira é `6` -> As Manilhas são os `7`.
     - *Exemplo 2:* Vira é `7` -> As Manilhas são as `Damas (Q)`.
     - *Exemplo 3:* Vira é `Valete (J)` -> As Manilhas são os `Reis (K)`.
     - *Exemplo 4:* Vira é `Ás (A)` -> As Manilhas são os `2`.
     - *Exemplo 5:* Vira é `3` -> As Manilhas são os `4`.
  3. O naipe da carta Vira não afeta o valor da manilha.
* **Exceções:** Não se aplica quando a partida estiver no modo Truco Mineiro.
* **Dados envolvidos:** Valor da Vira, Valor da Manilha da rodada.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-004, RF-006.

---

### RN-005 — Manilhas Fixas do Truco Mineiro

* **Título:** Conjunto estático e invariável de manilhas no Truco Mineiro.
* **Descrição:** Quando a modalidade configurada for Truco Mineiro, as manilhas não dependem de vira e mantêm-se constantes durante toda a partida.
* **Origem:** Variante Mineira Tradicional.
* **Stakeholders envolvidos:** Jogador (STK-01), Motor de Regras (STK-03).
* **Condição:** Partida configurada com a regra Truco Mineiro.
* **Regra:**
  As quatro manilhas, em ordem decrescente de poder absoluto, são fixas:
  1. **Zap:** 4 de Paus (♣).
  2. **Sete de Copas:** 7 de Copas (♥).
  3. **Espadilha:** Ás de Espadas (♠).
  4. **Picafumo / Sete de Ouros:** 7 de Ouros (♦).
* **Exceções:** Não se aplica quando a partida estiver no modo Truco Paulista.
* **Dados envolvidos:** Conjunto estático de cartas manilhas.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-004, RF-006.

---

### RN-006 — Hierarquia de Força das Cartas e dos Naipes das Manilhas

* **Título:** Ordem decrescente de poder entre cartas comuns e desempate entre manilhas por naipe.
* **Descrição:** As cartas possuem pesos estritos de comparação. As manilhas são sempre superiores a qualquer carta comum, e entre si são desempatadas exclusivamente pelo seu naipe.
* **Origem:** Fundamentos matemáticos e normativos do Truco Brasileiro.
* **Stakeholders envolvidos:** Motor de Regras (STK-03).
* **Condição:** Comparação de cartas jogadas em qualquer vaza.
* **Regra:**
  1. **Hierarquia das Manilhas (Decrescente por Naipe):**
     - **Zap / Gato / Zape:** Naipe de **Paus (♣)** — A carta mais forte do jogo.
     - **Copilha / Copas:** Naipe de **Copas (♥)** — 2ª maior carta.
     - **Espadilha:** Naipe de **Espadas (♠)** — 3ª maior carta.
     - **Picafumo / Ouros:** Naipe de **Ouros (♦)** — 4ª maior carta.
  2. **Hierarquia das Cartas Comuns (Decrescente por Valor):**
     As cartas que não forem manilha na rodada seguem a ordem fixa (onde naipes não importam, gerando empate em caso de valores idênticos):
     `3 > 2 > A > K > J > Q > 7 > 6 > 5 > 4`.
  3. Qualquer Manilha vence impreterivelmente qualquer carta comum (ex: um 4 de Ouros manilha vence um 3 de Paus comum).
* **Exceções:** Nenhuma.
* **Dados envolvidos:** Peso da carta, Valor nominal, Naipe, Indicador de manilha.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-006, RF-007.

---

### RN-007 — Estrutura da Rodada em Melhor de Três Quedas (Vazas)

* **Título:** Conquista da rodada mediante vitória em duas de até três vazas.
* **Descrição:** Cada rodada (mão) é disputada em até 3 vazas consecutivas. A equipe ou jogador que vencer duas vazas primeiro conquista os pontos em disputa daquela rodada.
* **Origem:** Regra cardeal do Truco.
* **Stakeholders envolvidos:** Jogadores (STK-01), Equipes (STK-02), Motor de Regras (STK-03).
* **Condição:** Disputa regular de uma rodada sem desistência prévia.
* **Regra:**
  1. Cada jogador descarta 1 carta por vaza, respeitando sua ordem de turno.
  2. A carta de maior peso define o jogador/equipe vencedor da vaza.
  3. O jogador que venceu a vaza anterior torna-se o primeiro a jogar na vaza seguinte ("torna").
  4. Se a mesma equipe vencer a **1ª vaza e a 2ª vaza**, a rodada encerra-se imediatamente por 2 a 0, sem necessidade da 3ª vaza.
  5. Se equipes diferentes vencerem a 1ª e a 2ª vaza, a decisão vai para a **3ª vaza**. Quem vencer a 3ª vaza vence a rodada.
* **Exceções:** Casos de empate ("canga") descritos na RN-008, ou desistência mediante pedido de aposta (RN-011).
* **Dados envolvidos:** Placar de vazas da rodada `{equipe_a: X, equipe_b: Y}`, histórico de cartas da mesa.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-006, RF-007, RF-010.

---

### RN-008 — Regra de Desempate em Caso de Empate ("Canga / Empate") na Vaza

* **Título:** Critérios normativos para vazas empatadas com cartas comuns de mesmo valor.
* **Descrição:** Se as duas maiores cartas jogadas em uma vaza tiverem valores comuns idênticos (duas manilhas nunca empatam entre si, pois têm naipes distintos), ocorre a "canga" (empate).
* **Origem:** Diretriz tradicional de desempate do Truco Brasileiro.
* **Stakeholders envolvidos:** Motor de Regras (STK-03).
* **Condição:** Ocorrência de empate de cartas mais fortes em uma vaza.
* **Regra:**
  1. **Empate na 1ª Vaza:** A decisão é transferida para a 2ª vaza. Quem vencer a 2ª vaza leva a rodada inteira. Se a 2ª vaza também empatar, vence quem ganhar a 3ª vaza. Se todas as 3 vazas empatarem, ninguém pontua (ou vence quem estiver com a "Mão" / primeiro a jogar).
  2. **Empate na 2ª Vaza:** Quem tiver vencido a 1ª vaza é automaticamente declarado vencedor da rodada.
  3. **Empate na 3ª Vaza:** Quem tiver vencido a 1ª vaza é declarado vencedor da rodada.
  4. **Empate na 1ª e 2ª Vazouras:** Quem vencer a 3ª vaza leva a rodada.
* **Exceções:** Nenhuma.
* **Dados envolvidos:** Vencedores de cada vaza, status de empate.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-006, RF-007.

---

### RN-009 — Jogada de Blefe com Carta Encoberta (Carta Virada / Queimada)

* **Título:** Possibilidade de jogar uma carta virada com a face para baixo.
* **Descrição:** O jogador pode optar por descartar sua carta com o valor oculto para os adversários e para a mesa.
* **Origem:** Estratégia de blefe tradicional do Truco.
* **Stakeholders envolvidos:** Jogador (STK-01), Motor de Regras (STK-03).
* **Condição:** Turno de jogada do participante na 2ª ou 3ª vaza.
* **Regra:**
  1. Ao jogar a carta encoberta, seu valor é anulado para a disputa daquela vaza (ela perde para qualquer carta aberta adversária, inclusive um 4 comum).
  2. O valor real da carta não é revelado aos adversários durante a rodada.
  3. **Restrição Oficial:** É terminantemente proibido jogar carta encoberta na **1ª vaza**. Na 1ª vaza, todas as cartas devem ser obrigatoriamente abertas.
* **Exceções:** Mão de Ferro (onde todas as cartas são encobertas compulsoriamente).
* **Dados envolvidos:** Carta descartada, flag booleana `is_encoberta = true`.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-005, RF-006.

---

### RN-010 — Escalonamento de Apostas e Valor da Rodada

* **Título:** Ciclo de elevação progressiva de tentos (Normal -> Truco -> Seis -> Nove -> Doze).
* **Descrição:** Qualquer jogador no seu turno de direito pode solicitar a elevação da aposta da rodada.
* **Origem:** Aposta nuclear do jogo de Truco.
* **Stakeholders envolvidos:** Jogadores (STK-01), Equipes (STK-02), Motor de Regras (STK-03).
* **Condição:** Rodada em andamento antes do término da 3ª vaza, excluindo regras de Mão de 11 (RN-012).
* **Regra:**
  1. A rodada tem início valendo **1 tento (ponto)** no Truco Paulista (ou 2 no Mineiro tradicional).
  2. O primeiro pedido de elevação é o **"Truco!"**, elevando a rodada para **3 tentos**.
  3. Havendo Truco aceito ou retrucado, o próximo degrau é o **"Seis!"**, elevando para **6 tentos**.
  4. Havendo Seis aceito ou retrucado, o próximo degrau é o **"Nove!"**, elevando para **9 tentos**.
  5. O degrau máximo de aposta é o **"Doze!" / "Cai do Doze!"**, elevando a rodada para **12 tentos** (o valor total de uma partida).
  6. Não é permitido pular degraus de aposta (ex: não se pode pedir Nove diretamente sobre o Truco sem passar pelo Seis).
* **Exceções:** Mão de 11 (RN-012) e Mão de Ferro (RN-013).
* **Dados envolvidos:** Valor corrente da aposta `{1, 3, 6, 9, 12}`, equipe proponente da aposta.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-008, RF-009, RF-010.

---

### RN-011 — Respostas aos Pedidos de Aposta e Direito de Retruco

* **Título:** Opções concedidas à equipe desafiada após um pedido de aposta.
* **Descrição:** Quando uma equipe solicita Truco (ou Seis, Nove, Doze), a ação da partida é interrompida e a equipe adversária deve se manifestar.
* **Origem:** Mecânica dialógica e estratégica do Truco.
* **Stakeholders envolvidos:** Equipe desafiada (STK-02), Motor de Regras (STK-03).
* **Condição:** Pedido de aposta emitido.
* **Regra:**
  A equipe desafiada possui exclusivamente três condutas possíveis:
  1. **Aceitar ("Cai pra dentro" / "Desce"):** A rodada continua imediatamente com a disputa das cartas, agora valendo o novo valor solicitado.
  2. **Correr / Recusar ("Foge" / "Não quero"):** A rodada encerra-se imediatamente. A equipe que pediu a aposta recebe a pontuação do degrau anterior:
     - Fugir do Truco -> Equipe desafiante ganha 1 tento.
     - Fugir do Seis -> Equipe desafiante ganha 3 tentos.
     - Fugir do Nove -> Equipe desafiante ganha 6 tentos.
     - Fugir do Doze -> Equipe desafiante ganha 9 tentos.
  3. **Aumentar / Retrucar ("Pedir mais"):** A equipe desafiada contesta a aposta elevando para o próximo nível (ex: desafiado no Truco responde com Seis). O direito de resposta passa agora para a equipe contrária.
  4. Uma equipe não pode aumentar o seu próprio pedido de aposta consecutivamente; o direito de retruco é estritamente alternado.
* **Exceções:** Nenhuma.
* **Dados envolvidos:** Equipe desafiada, escolha de resposta, atualização de placar em caso de recusa.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-008, RF-009.

---

### RN-012 — Diretrizes Especiais da "Mão de 11"

* **Título:** Regras da rodada quando uma das equipes atinge exatamente 11 tentos.
* **Descrição:** A Mão de 11 é uma condição especial de pré-vitória, onde a equipe que está com 11 pontos tem privilégios de conferência e restrições severas de aposta.
* **Origem:** Tradição de cavalheirismo e balanceamento do Truco.
* **Stakeholders envolvidos:** Equipe com 11 pontos (STK-02), Adversários, Motor de Regras (STK-03).
* **Condição:** Placar da equipe atingir 11 pontos (com o adversário tendo pontuação inferior a 11).
* **Regra:**
  1. Antes do primeiro descarte, os dois parceiros da equipe com 11 pontos podem visualizar as cartas um do outro para decidir se jogam a mão.
  2. A equipe com 11 pontos pode:
     - **Jogar a mão:** A rodada é disputada normalmente e passa a valer **3 pontos** automaticamente.
     - **Correr da mão:** A equipe opta por não arriscar; o adversário recebe automaticamente **1 ponto** e inicia-se uma nova rodada.
  3. **Proibição Estrita de Truco:** Na Mão de 11, **é expressamente proibido pedir Truco**.
     - Se qualquer jogador pedir Truco na Mão de 11, sua equipe perde a rodada ou a partida automaticamente por infração grave às regras.
* **Exceções:** Quando ambas as equipes estiverem com 11 pontos (situação 11x11), aplica-se a Mão de Ferro (RN-013).
* **Dados envolvidos:** Placar das equipes, decisão de jogar/correr.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-011.

---

### RN-013 — Diretrizes da "Mão de Ferro" (Empate em 11 x 11)

* **Título:** Disputa às cegas quando ambas as equipes estão com 11 pontos.
* **Descrição:** Quando o placar alcança 11 tentos para ambas as equipes (11 a 11), a rodada final decisiva é disputada sob a regra da "Mão de Ferro" (ou "Mão Escura").
* **Origem:** Clímax esportivo do Truco Brasileiro.
* **Stakeholders envolvidos:** Todos os Jogadores (STK-01), Motor de Regras (STK-03).
* **Condição:** Placar em 11 a 11.
* **Regra:**
  1. As 3 cartas são distribuídas para cada jogador viradas com a face para baixo.
  2. Nenhum jogador tem permissão de ver suas próprias cartas nem as dos parceiros.
  3. Cada jogador joga suas cartas na mesa às cegas, revelando a carta somente no momento exato do descarte na mesa.
  4. É vedado qualquer pedido de aposta (Truco, Seis, etc.).
  5. A equipe que vencer a melhor de 3 vazas no escuro conquista o 12º ponto e vence a partida.
* **Exceções:** Nenhuma.
* **Dados envolvidos:** Estado de visualização de cartas (`blind = true`).
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-011, RF-012.

---

### RN-014 — Critério de Vitória e Pontuação da Partida

* **Título:** Término da partida ao alcançar 12 tentos (pontos).
* **Descrição:** A partida é vencida pela primeira equipe ou jogador a acumular 12 ou mais tentos.
* **Origem:** Meta pontual do Truco Brasileiro.
* **Stakeholders envolvidos:** Jogadores (STK-01), Equipes (STK-02), Motor de Regras (STK-03).
* **Condição:** Atualização de pontuação ao final de qualquer rodada ou fuga de aposta.
* **Regra:**
  1. A partida começa em 0 a 0.
  2. Ao final de cada rodada ou fuga, os pontos daquela rodada são somados ao placar acumulado da equipe vencedora.
  3. No instante em que uma equipe atinge **12 tentos**, a partida é finalizada imediatamente e a equipe é declarada campeã.
  4. O sistema gera o log de auditoria e grava o histórico estatístico da partida.
* **Exceções:** Nenhuma.
* **Dados envolvidos:** Placar geral `{equipe_a, equipe_b}`, timestamp de término, indicador de vencedor.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-010, RF-013.

---

### RN-015 — Rodízio da "Mão" e do "Pé" e Ordem de Turnos

* **Título:** Alternância formal de papéis a cada nova rodada da partida.
* **Descrição:** A posição de início da jogada e a posição do último a jogar alternam-se no sentido horário a cada rodada.
* **Origem:** Dinâmica posicional do Truco.
* **Stakeholders envolvidos:** Jogadores (STK-01), Motor de Regras (STK-03).
* **Condição:** Transição de rodadas na partida.
* **Regra:**
  1. O **"Mão"** é o jogador que faz o primeiro descarte na 1ª vaza da rodada.
  2. O **"Pé"** é o distribuidor das cartas (último jogador a descartar na 1ª vaza).
  3. Ao término de cada rodada, o papel de "Mão" passa para o jogador imediatamente à esquerda (sentido horário).
  4. Nas vazas subsequentes (2ª e 3ª), a saída pertence a quem ganhou a vaza imediatamente anterior (o "vencedor da vaza torna").
* **Exceções:** Nenhuma.
* **Dados envolvidos:** Índice do distribuidor ("pé"), índice do primeiro jogador ("mão"), índice da jogada corrente.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-002, RF-003, RF-006.

---

### RN-016 — Sistema de Sinalização e Expressões Culturais

* **Título:** Emissão de sinais clássicos entre parceiros de duplas e gritos de Truco.
* **Descrição:** O sistema deve oferecer suporte a emoticons e sinais clássicos do Truco (piscar de olho para Zap, levantar sobrancelha para Espadilha, inflar a bochecha para 7 de Copas, morder os lábios para 7 de Ouros) e áudio/texto dos tradicionais gritos de Truco.
* **Origem:** Riqueza cultural e folclórica do Truco no Brasil.
* **Stakeholders envolvidos:** Jogadores (STK-01).
* **Condição:** Partidas no modo em duplas (2v2).
* **Regra:**
  1. O jogador pode acionar gatilhos de comunicação de sinais visuais no chat interno da equipe.
  2. O adversário não recebe o sinal se emitido pelo canal reservado de dupla, mas se enviado em mesa aberta pode ser interceptado.
  3. Textos e animações de Truco ("TRUUUCO!", "SEEEIS!", "LADRÃO!", "CAI PRA DENTRO!") são reproduzidos na interface para imersão.
* **Exceções:** Nenhuma.
* **Dados envolvidos:** Tipo de sinal, mensagem cultural, receptor.
* **Prioridade:** Média.
* **Status:** **Aprovado**.
* **Requisitos relacionados:** RF-014.
