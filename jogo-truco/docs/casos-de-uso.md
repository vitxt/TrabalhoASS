# Documento de Especificação de Casos de Uso (UC) — Engenharia do Jogo de Truco Brasileiro
**Projeto:** Motor e Plataforma do Jogo Tradicional de Truco (Truco Paulista & Mineiro)  
**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE — Universidade Estadual de Maringá (UEM)  
**Autores:**  
- Vitor Teodoro Correa — RA 143757  
- Arthur Spirandelli — RA 144136  

---

## 1. Introdução

O presente documento formaliza os **Casos de Uso (UC)** que especificam a dinâmica operacional, as transições de estado e o fluxo de interação dos participantes com o motor do jogo de Truco Brasileiro.

---

## 2. Atores do Sistema

* **Jogador:** Participante humano ativo alocado em um assento da mesa, responsável por tomar decisões táticas, descartar cartas e interagir com apostas.
* **Motor de Regras (Juiz Virtual):** Componente central de software que aplica rigorosamente as regras do Truco, gerencia turnos, calcula potências das cartas, detecta empates, computa tentos e declara vencedores.
* **Sistema Criptográfico (CSPRNG):** Provedor de números pseudoaleatórios criptograficamente seguros para garantia da imparcialidade do embaralhamento.
* **Moderador / Auditor:** Agente com permissão de inspeção de logs e conferência de regras.

---

## 3. Especificação Detalhada dos Casos de Uso

---

### UC-001 — Criar e Configurar Partida de Truco

* **Identificador:** UC-001
* **Nome:** Criar e Configurar Partida de Truco
* **Objetivo:** Permitir que um jogador crie uma sala de jogo definindo a modalidade (Paulista ou Mineiro) e a quantidade de jogadores (1v1 ou 2v2).
* **Ator Principal:** Jogador.
* **Atores Secundários:** Motor de Regras.
* **Pré-condições:** O jogador deve estar autenticado ou possuir pseudônimo no lobby.
* **Fluxo Principal:**
  1. O jogador seleciona a opção "Criar Mesa de Truco".
  2. O sistema solicita os parâmetros da partida:
     - Formato: Individual (1v1) ou Duplas (2v2).
     - Variante de Regras: Truco Paulista (com Vira dinâmica) ou Truco Mineiro (manilhas fixas).
     - Tipo de Baralho: Baralho Limpo (40 cartas - padrão oficial).
  3. O jogador confirma os parâmetros configurados.
  4. O sistema gera a sala, reserva o primeiro assento para o criador e gera um código de convite para os demais participantes.
  5. Os outros jogadores entram na sala ocupando os assentos restantes.
  6. Quando a lotação é preenchida, o sistema habilita o botão de início de jogo.
* **Fluxos Alternativos:**
  * *FA1 — Entrada via Partida Rápida (Matchmaking):* O jogador escolhe entrar em qualquer mesa pública disponível com regras padrão (Paulista 2v2); o sistema o aloca automaticamente na primeira vaga aberta.
* **Exceções:**
  * *E1 — Parâmetros inválidos:* O sistema exibe mensagem de advertência e mantém os valores padrão de fábrica.
* **Pós-condições:** Mesa configurada, jogadores alocados em seus assentos e partida pronta para iniciar.
* **Regras de Negócio Relacionadas:** RN-001, RN-002, RN-005.
* **Requisitos Relacionados:** RF-001.

---

### UC-002 — Iniciar Rodada e Distribuir Cartas

* **Identificador:** UC-002
* **Nome:** Iniciar Rodada e Distribuir Cartas
* **Objetivo:** Embaralhar as 40 cartas, distribuir 3 cartas para cada jogador, definir o Vira/Manilhas e posicionar o "Mão" e o "Pé".
* **Ator Principal:** Motor de Regras.
* **Atores Secundários:** CSPRNG, Jogador.
* **Pré-condições:** Partida ativa e placar geral menor que 12 tentos para ambas as equipes.
* **Fluxo Principal:**
  1. O motor de regras atualiza a rotação dos papéis de "Mão" (primeiro a jogar) e "Pé" (distribuidor das cartas) no sentido horário.
  2. O motor solicita sementes de entropia ao CSPRNG e aplica o algoritmo de embaralhamento de Fisher-Yates sobre as 40 cartas do baralho limpo.
  3. O motor simula o corte de cartas e distribui 3 cartas fechadas para cada jogador.
  4. O sistema envia a cada participante apenas o pacote das suas próprias 3 cartas (RNF-003).
  5. *Se a modalidade for Truco Paulista:* O motor retira a carta imediatamente posterior do topo do maço e a expõe virada para cima no centro da mesa ("Vira"). O motor calcula as 4 manilhas da rodada (`valor_vira + 1`) e sinaliza nas interfaces dos jogadores quais cartas em suas mãos são manilhas.
  6. *Se a modalidade for Truco Mineiro:* O motor ativa as 4 manilhas fixas tradicionais (Zap 4♣, 7♥, Espadilha A♠, 7♦).
  7. O motor inicia o temporizador de 15 segundos e concede o turno inicial ao jogador que detém a "Mão".
* **Fluxos Alternativos:**
  * *FA1 — Mão de 11:* Se uma das equipes estiver com 11 pontos, desvia para o caso de uso [UC-008: Processar Mão de 11].
  * *FA2 — Mão de Ferro:* Se o placar estiver empatado em 11 a 11, desvia para o caso de uso [UC-009: Executar Mão de Ferro].
* **Pós-condições:** Cartas em posse dos jogadores, Vira visível (se Paulista) e turno aberto para o primeiro descarte.
* **Regras de Negócio Relacionadas:** RN-002, RN-003, RN-004, RN-005, RN-015.
* **Requisitos Relacionados:** RF-002, RF-003, RF-004, RNF-002, RNF-003.

---

### UC-003 — Jogar Carta Aberta na Vaza

* **Identificador:** UC-003
* **Nome:** Jogar Carta Aberta na Vaza
* **Objetivo:** Lançar uma carta aberta na mesa durante o seu turno para disputar o ponto da vaza corrente.
* **Ator Principal:** Jogador.
* **Atores Secundários:** Motor de Regras.
* **Pré-condições:** Ser o turno do jogador e haver carta disponível em sua mão.
* **Fluxo Principal:**
  1. O jogador visualiza as cartas de sua mão na interface e seleciona a carta desejada.
  2. O jogador clica na carta e a direciona para a mesa.
  3. O sistema valida se a jogada pertence ao turno ativo do jogador e se o temporizador não expirou.
  4. O sistema remove a carta da mão do jogador e a posiciona de face visível no centro da mesa.
  5. O motor registra a carta no histórico da vaza.
  6. *Se houver jogadores restantes na vaza:* O motor passa o turno para o próximo participante à esquerda.
  7. *Se todos os jogadores da vaza já jogaram:* O caso de uso [UC-007: Apurar Vencedor da Vaza] é disparado automaticamente.
* **Fluxos Alternativos:**
  * *FA1 — Tempo esgotado (Time-out):* Se o temporizador de 15 segundos expirar sem ação do jogador, o motor descarta automaticamente a carta de menor poder da mão do participante de forma aberta.
* **Exceções:**
  * *E1 — Tentativa de jogar fora de turno:* O sistema bloqueia a ação e emite aviso auditivo de turno inválido.
* **Pós-condições:** Carta exposta na mesa e turno transferido ou vaza apurada.
* **Regras de Negócio Relacionadas:** RN-006, RN-007.
* **Requisitos Relacionados:** RF-002, RF-005.

---

### UC-004 — Jogar Carta Encoberta (Blefe)

* **Identificador:** UC-004
* **Nome:** Jogar Carta Encoberta (Carta Virada / Queimada)
* **Objetivo:** Descartar uma carta de face para baixo, mantendo o valor oculto e renunciando ao poder de combate daquela carta na vaza.
* **Ator Principal:** Jogador.
* **Atores Secundários:** Motor de Regras.
* **Pré-condições:** Ser o turno do jogador e a disputa estar na **2ª ou 3ª vaza** da rodada (RN-009).
* **Fluxo Principal:**
  1. O jogador seleciona uma carta de sua mão e aciona a opção "Jogar Encoberta" (ou arrasta a carta virada).
  2. O motor valida se a rodada está na 2ª ou 3ª vaza.
  3. O sistema remove a carta da mão do jogador e a posiciona com o verso voltado para cima na mesa.
  4. O sistema oculta o valor nominal e o naipe da carta para todos os demais participantes.
  5. O motor atribui peso nulo àquela carta na avaliação de força da vaza.
  6. O turno é transferido para o próximo jogador ou a vaza é apurada se for o último a jogar.
* **Exceções:**
  * *E1 — Tentativa de cobrir carta na 1ª vaza:* O sistema impede o descarte encoberto e emite notificação: "A regra oficial RN-009 proíbe jogar carta encoberta na primeira vaza!".
* **Pós-condições:** Carta encoberta registrada e valor ocultado até o final da rodada.
* **Regras de Negócio Relacionadas:** RN-009.
* **Requisitos Relacionados:** RF-006.

---

### UC-005 — Solicitar Aumento de Aposta (Truco, Seis, Nove, Doze)

* **Identificador:** UC-005
* **Nome:** Solicitar Aumento de Aposta
* **Objetivo:** Elevar o valor em pontos disputados na rodada, desafiando a equipe adversária a aceitar, correr ou retrucar.
* **Ator Principal:** Jogador.
* **Atores Secundários:** Equipe adversária, Motor de Regras.
* **Pré-condições:** Rodada ativa; pontuação da rodada inferior a 12 tentos; o último aumento não pertencer à própria equipe; não ser Mão de 11 (RN-012) nem Mão de Ferro (RN-013).
* **Fluxo Principal:**
  1. O jogador aciona o botão correspondente de aposta ("Truco!", "Seis!", "Nove!" ou "Doze!").
  2. O motor valida se a solicitação respeita a ordem escalonar dos degraus (1 -> 3 -> 6 -> 9 -> 12).
  3. O motor congela os descartes de cartas de todos os jogadores na mesa.
  4. O sistema dispara a animação e o som característico do pedido de aposta.
  5. O sistema exibe o painel de resposta exclusivamente para os integrantes da equipe adversária.
  6. O sistema aguarda a resolução do caso de uso [UC-006: Responder a Pedido de Aposta].
* **Exceções:**
  * *E1 — Pedido de Truco na Mão de 11:* O sistema veta a ação imediatamente. Se tentado, aplica penalidade de perda da rodada ou partida conforme RN-012.
* **Pós-condições:** Negociação de aposta aberta na mesa com jogadas suspensas até resolução.
* **Regras de Negócio Relacionadas:** RN-010, RN-011, RN-012.
* **Requisitos Relacionados:** RF-008.

---

### UC-006 — Responder a Pedido de Aposta

* **Identificador:** UC-006
* **Nome:** Responder a Pedido de Aposta
* **Objetivo:** Processar a resposta dos adversários desafiados (Aceitar, Correr ou Retrucar).
* **Ator Principal:** Jogador da Equipe Desafiada.
* **Atores Secundários:** Motor de Regras.
* **Pré-condições:** Desafio de aposta pendente de resposta.
* **Fluxo Principal:**
  1. O jogador desafiado recebe as opções:
     - **Aceitar ("Cai pra dentro"):** O novo valor solicitado passa a valer para a rodada.
     - **Correr ("Foge"):** A equipe desiste da mão; a equipe desafiante leva os pontos anteriores.
     - **Aumentar / Retrucar:** A equipe eleva para o próximo degrau (ex: pede Seis sobre Truco).
  2. O jogador clica na opção desejada.
  3. *Se a resposta for "Aceitar":* O motor fixa o novo valor da aposta (3, 6, 9 ou 12), desbloqueia os descartes e devolve o turno de jogo.
  4. *Se a resposta for "Correr":* O motor encerra imediatamente a rodada, credita os pontos do degrau anterior à equipe que solicitou o aumento, e dispara o [UC-010: Atualizar Placar].
  5. *Se a resposta for "Aumentar":* O motor passa o status de proponente para a equipe que retrucou e abre o painel de resposta para a equipe oposta.
* **Fluxos Alternativos:**
  * *FA1 — Decisão em Duplas (2v2):* Qualquer um dos parceiros pode responder. Se um parceiro aceitar e o outro correr, prevalece a decisão de aceitar (ou quem decidir primeiro).
* **Pós-condições:** Aposta consolidada e jogo retomado, ou rodada encerrada por fuga.
* **Regras de Negócio Relacionadas:** RN-010, RN-011.
* **Requisitos Relacionados:** RF-009.

---

### UC-007 — Apurar Vencedor da Vaza e Arbitrar Empate ("Cangou")

* **Identificador:** UC-007
* **Nome:** Apurar Vencedor da Vaza e Arbitrar Empate ("Cangou")
* **Objetivo:** Avaliar a carta mais forte da vaza e declarar o vencedor ou resolver o empate de canga.
* **Ator Principal:** Motor de Regras.
* **Atores Secundários:** Jogadores.
* **Pré-condições:** Todas as cartas da vaza corrente foram descartadas.
* **Fluxo Principal:**
  1. O motor extrai as cartas descartadas na vaza atual.
  2. O motor aplica a ordenação hierárquica (RN-006):
     - Manilhas (Zap ♣ > Copas ♥ > Espadilha ♠ > Picafumo ♦).
     - Cartas Comuns (3 > 2 > A > K > J > Q > 7 > 6 > 5 > 4).
     - Cartas Encobertas (força = 0).
  3. O motor identifica a maior carta jogada:
     - *Cenário A — Maior carta única:* O jogador que a descartou é declarado vencedor da vaza. O placar de vazas da equipe é incrementado.
     - *Cenário B — Empate entre duas maiores cartas de equipes opostas:* A vaza é declarada "Cangada" (empate) e o motor aplica as regras da RN-008.
  4. O motor avalia se a rodada já tem um vencedor da melhor de 3:
     - Se uma equipe venceu 2 vazas (ou venceu a 2ª após empate na 1ª, etc.): A rodada encerra-se e dispara o [UC-010: Atualizar Placar].
     - Se a rodada ainda não estiver decidida: As cartas da mesa são recolhidas e a próxima vaza tem início com a saída ("torna") do jogador vencedor da vaza (ou da "Mão" se houve empate).
* **Pós-condições:** Vaza arquivada, vencedor ou empate registrado e continuidade da rodada.
* **Regras de Negócio Relacionadas:** RN-006, RN-007, RN-008.
* **Requisitos Relacionados:** RF-007.

---

### UC-008 — Processar Decisão na "Mão de 11"

* **Identificador:** UC-008
* **Nome:** Processar Decisão na "Mão de 11"
* **Objetivo:** Conduzir a conferência prévia e a decisão de jogar ou fugir quando uma equipe está com 11 tentos.
* **Ator Principal:** Jogadores da Equipe com 11 pontos.
* **Atores Secundários:** Motor de Regras.
* **Pré-condições:** Uma equipe atingiu 11 tentos e a equipe adversária possui menos de 11 tentos.
* **Fluxo Principal:**
  1. O motor distribui as cartas da rodada normalmente e abre a Vira (se Paulista).
  2. O motor concede aos dois parceiros da equipe com 11 pontos a visualização mútua de suas 6 cartas.
  3. O sistema bloqueia os botões de pedir Truco para todos os integrantes da mesa.
  4. O sistema apresenta aos parceiros a decisão:
     - **Jogar a Mão:** A rodada valerá automaticamente 3 pontos.
     - **Correr da Mão:** A equipe adversária recebe 1 ponto de imediato.
  5. Se os parceiros concordarem em jogar, a rodada inicia-se valendo 3 pontos com o primeiro descarte.
  6. Se decidirem correr, o adversário ganha 1 ponto e o sistema inicia uma nova rodada.
* **Exceções:**
  * *E1 — Tentativa de pedir Truco:* Ação impossibilitada pelo motor por ser proibida na Mão de 11 (RN-012).
* **Pós-condições:** Partida direcionada para disputa valendo 3 pontos ou pontuação de 1 ponto concedida ao adversário.
* **Regras de Negócio Relacionadas:** RN-012.
* **Requisitos Relacionados:** RF-011.

---

### UC-009 — Conduzir a "Mão de Ferro" (11 a 11)

* **Identificador:** UC-009
* **Nome:** Conduzir a "Mão de Ferro" (11 a 11 às Cegas)
* **Objetivo:** Realizar a rodada decisiva no escuro sem que os jogadores conheçam suas próprias cartas.
* **Ator Principal:** Motor de Regras.
* **Atores Secundários:** Jogadores.
* **Pré-condições:** O placar geral está empatado exatamente em 11 x 11.
* **Fluxo Principal:**
  1. O motor identifica a condição de 11x11 e notifica: "MÃO DE FERRO — A ÚLTIMA QUEDA NO ESCURO!".
  2. O motor embaralha e entrega 3 cartas viradas de costas para cada participante.
  3. Os valores das cartas permanecem estritamente mascarados na tela dos jogadores.
  4. No Truco Paulista, a Vira é aberta na mesa.
  5. O jogador no seu turno clica para descartar sua 1ª carta às cegas.
  6. A carta é revelada na mesa no momento exato em que toca o feltro.
  7. O motor apura as 3 vazas no escuro sucessivamente.
  8. A equipe que vencer a melhor de 3 conquista o 12º tento e é consagrada campeã da partida.
* **Pós-condições:** Partida encerrada com declaração de campeão.
* **Regras de Negócio Relacionadas:** RN-013, RN-014.
* **Requisitos Relacionados:** RF-012, RF-013.

---

### UC-010 — Atualizar Placar e Declarar Campeão da Partida

* **Identificador:** UC-010
* **Nome:** Atualizar Placar e Declarar Campeão da Partida
* **Objetivo:** Adicionar os pontos da rodada concluída e verificar se a meta de 12 tentos foi alcançada.
* **Ator Principal:** Motor de Regras.
* **Atores Secundários:** Jogadores.
* **Pré-condições:** Rodada finalizada por vazas ou por desistência de aposta.
* **Fluxo Principal:**
  1. O motor soma os tentos disputados da rodada ao placar acumulado da equipe vencedora.
  2. O placar central da mesa é atualizado e transmitido a todos os participantes.
  3. O motor avalia o placar:
     - *Se o placar for menor que 12 para ambas:* O motor inicia uma nova rodada acionando o [UC-002: Iniciar Rodada].
     - *Se alguma equipe atingir 12 ou mais tentos:* O motor encerra formalmente a partida.
  4. O motor aciona a animação de vitória para a equipe vencedora e de derrota para os adversários.
  5. O motor persiste os dados e estatísticas no histórico da sala.
  6. Os jogadores têm a opção de solicitar revanche ou sair para o lobby.
* **Pós-condições:** Placar final consolidado e partida arquivada.
* **Regras de Negócio Relacionadas:** RN-014.
* **Requisitos Relacionados:** RF-010, RF-013.

---

### UC-011 — Consultar Histórico e Log da Mesa

* **Identificador:** UC-011
* **Nome:** Consultar Histórico e Log da Mesa
* **Objetivo:** Exibir o histórico de jogadas, apostas e cartas descartadas para fins de transparência e auditoria.
* **Ator Principal:** Jogador ou Auditor.
* **Atores Secundários:** Motor de Regras.
* **Pré-condições:** Partida em andamento ou recém-finalizada.
* **Fluxo Principal:**
  1. O usuário aciona o botão "Histórico da Mesa / Log".
  2. O sistema recupera a lista de eventos com carimbo de data/hora (vira aberta, cartas descartadas em cada vaza, pedidos de aposta, respostas e alterações de placar).
  3. O sistema renderiza o painel de histórico de forma legível e ordenada.
* **Pós-condições:** Histórico exibido na tela.
* **Regras de Negócio Relacionadas:** RN-014.
* **Requisitos Relacionados:** RF-015.

---

### UC-012 — Enviar Sinais Secretos e Expressões Folclóricas

* **Identificador:** UC-012
* **Nome:** Enviar Sinais Secretos e Expressões Folclóricas
* **Objetivo:** Enviar sinalizações corporais clássicas ao parceiro de dupla ou reproduzir expressões esportivas de blefe.
* **Ator Principal:** Jogador.
* **Atores Secundários:** Parceiro de Dupla.
* **Pré-condições:** Partida no formato em duplas (2v2).
* **Fluxo Principal:**
  1. O jogador abre o menu rápido de sinais e seleciona uma das opções folclóricas:
     - *Piscar de olho:* Indica posse do Zap (4♣).
     - *Inflar bochecha:* Indica posse do 7 de Copas (7♥).
     - *Levantar sobrancelha:* Indica posse da Espadilha (A♠).
     - *Morder o lábio:* Indica posse do 7 de Ouros / Picafumo (7♦).
     - *Gritos de Áudio/Texto:* "Truco Marreco!", "Cai pro pau!", "Nem a pau Juvenal!".
  2. Se for sinal secreto, o sistema envia o evento com animação sutil no avatar exclusivamente para a tela do seu parceiro de dupla.
  3. Se for grito folclórico aberto, a mensagem é projetada em balão de fala para todos os participantes da mesa.
* **Pós-condições:** Sinal emitido com sucesso ao destinatário correspondente.
* **Regras de Negócio Relacionadas:** RN-016.
* **Requisitos Relacionados:** RF-014.
