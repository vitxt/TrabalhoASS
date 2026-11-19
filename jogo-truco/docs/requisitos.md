# Documento de Especificação de Requisitos de Software (SRS) — Engenharia do Jogo de Truco Brasileiro
**Projeto:** Motor e Plataforma do Jogo Tradicional de Truco (Truco Paulista & Mineiro)  
**Disciplina:** ANÁLISE DE SISTEMAS DE SOFTWARE — Universidade Estadual de Maringá (UEM)  
**Autores:**  
- Vitor Teodoro Correa — RA 143757  
- Arthur Spirandelli — RA 144136  

---

## 1. Introdução

O presente documento detalha os **Requisitos de Software (SRS)** para o desenvolvimento do motor de regras, gestão de mesa e interface do clássico jogo de cartas **Truco Brasileiro**. O sistema modela a lógica competitiva, comunicação em tempo real, apostas progressivas (Truco, Seis, Nove e Doze), variantes regionais (Paulista e Mineiro), rodadas especiais (Mão de 11 e Mão de Ferro) e integridade criptográfica contra adulterações.

---

## 2. Stakeholders e Atores

| Identificador | Papel / Ator | Descrição e Responsabilidades |
|---|---|---|
| **STK-01** | **Jogador** | Participante individual que ingressa em uma sala, visualiza suas cartas autorizadas, descarta cartas (abertas ou encobertas), pede aumento de aposta, responde a desafios e envia sinais. |
| **STK-02** | **Equipe / Dupla** | Entidade lógica formada por dois jogadores que compartilham pontuação, turnos e estratégias no modo 2v2. |
| **STK-03** | **Motor de Regras (Juiz Virtual)** | Componente central e automatizado de software que orquestra estados da partida, distribui cartas, calcula forças, valida apostas, arbitra empates e aplica punições. |
| **STK-04** | **Auditoria / Moderador** | Agente humano ou serviço supervisor com acesso aos logs da mesa para verificação de imparcialidade e conformidade de regras. |
| **EXT-01** | **Gerador Pseudoaleatório Seguro (CSPRNG)** | Componente externo/biblioteca criptográfica responsável pela geração de entropia segura para o embaralhamento imparcial do baralho (Fisher-Yates). |

---

## 3. Requisitos Funcionais (RF)

---

### RF-001 — Gestão de Salas e Configuração da Modalidade de Truco
* **Título:** Criação, configuração e ingresso em salas de jogo de Truco.
* **Descrição:** O sistema deve permitir que jogadores criem salas personalizadas escolhendo a modalidade (Truco Paulista ou Truco Mineiro), o formato de jogadores (1v1 Mano a Mano ou 2v2 em Duplas) e o tipo de baralho (Baralho Limpo de 40 cartas).
* **Objetivo:** Estabelecer o ambiente e os parâmetros normativos sob os quais a partida ocorrerá.
* **Stakeholders:** Jogador (STK-01), Motor de Regras (STK-03).
* **Ator Principal:** Jogador.
* **Pré-condições:** Jogador autenticado ou identificado por pseudônimo.
* **Entradas:** Nome da sala, modalidade (`Paulista` ou `Mineiro`), formato (`1v1` ou `2v2`), senha de acesso opcional.
* **Processamento Esperado:** Validar dados, criar o registro da sala no motor, reservar os assentos na mesa e aguardar a lotação necessária (2 ou 4 participantes).
* **Saídas/Resultados:** Sala criada com código identificador e jogadores alocados em seus assentos.
* **Pós-condições:** Partida habilitada para início quando todos os assentos forem ocupados.
* **Regras de Negócio Relacionadas:** RN-001, RN-002, RN-005.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-001.

---

### RF-002 — Gestão de Turnos, Posições na Mesa e Alternância de Mão/Pé
* **Título:** Controle determinístico da ordem de jogada e alternância do primeiro e último a jogar.
* **Descrição:** O sistema deve gerenciar o ponteiro do turno ativo, garantindo o rodízio em sentido horário e determinando quem é o "Mão" (primeiro a jogar na rodada) e o "Pé" (último a jogar / distribuidor).
* **Objetivo:** Garantir a equidade posicional consagrada no Truco a cada rodada.
* **Stakeholders:** Jogador (STK-01), Motor de Regras (STK-03).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Sala lotada e partida iniciada.
* **Entradas:** Evento de início de rodada ou conclusão de jogada.
* **Processamento Esperado:** Incrementar a posição do "Mão" a cada nova rodada e atribuir o turno na 2ª e 3ª vazas ao jogador que venceu a vaza anterior.
* **Saídas/Resultados:** Indicação visual na interface destacando o jogador da vez com temporizador regressivo (15 segundos por turno).
* **Regras de Negócio Relacionadas:** RN-001, RN-015.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-002, UC-003.

---

### RF-003 — Embaralhamento Criptográfico e Distribuição de Cartas
* **Título:** Geração de maço imparcial e distribuição segura de 3 cartas por jogador.
* **Descrição:** A cada nova rodada, o motor deve gerar o baralho limpo de 40 cartas, aplicar o algoritmo de Fisher-Yates com entropia criptográfica e distribuir 3 cartas privadas para a mão de cada jogador.
* **Objetivo:** Impedir previsibilidade, leitura de cartas na memória ou trapaças no embaralhamento.
* **Stakeholders:** Jogador (STK-01), Motor de Regras (STK-03), CSPRNG (EXT-01).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Início de nova rodada com placar < 12 pontos.
* **Entradas:** Sinal de disparo de nova rodada emitido pelo motor.
* **Processamento Esperado:** Instanciar as 40 cartas, embaralhar com CSPRNG, extrair 3 cartas por participante e reservar o topo do maço para a Vira (quando Paulista).
* **Saídas/Resultados:** Carga criptografada das cartas enviada exclusivamente ao cliente do respectivo jogador (payload seguro).
* **Regras de Negócio Relacionadas:** RN-002, RN-003.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-002.

---

### RF-004 — Determinação e Exibição da Carta Vira e das Manilhas da Rodada
* **Título:** Cálculo dinâmico ou estático das quatro manilhas vigentes.
* **Descrição:** No modo Truco Paulista, o sistema deve revelar a carta Vira e calcular automaticamente as 4 cartas manilhas correspondentes com sua respectiva hierarquia de naipes (Zap, Copas, Espadilha, Ouros). No Truco Mineiro, o sistema fixa as 4 manilhas tradicionais.
* **Objetivo:** Estabelecer as cartas de maior poder de combate daquela rodada.
* **Stakeholders:** Jogador (STK-01), Motor de Regras (STK-03).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Cartas distribuídas na mesa.
* **Entradas:** Carta retirada do topo do baralho.
* **Processamento Esperado:** Aplicar a regra cíclica `valor_vira + 1 = manilha` (RN-004) ou configurar manilhas fixas (RN-005). Notificar todos os clientes.
* **Saídas/Resultados:** Exibição gráfica da carta Vira no centro da mesa e indicação visual de quais cartas na mão do jogador são manilhas.
* **Regras de Negócio Relacionadas:** RN-004, RN-005, RN-006.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-002.

---

### RF-005 — Descarte de Carta Aberta na Vaza
* **Título:** Ação padrão de jogar uma carta virada para cima na mesa durante o seu turno.
* **Descrição:** O jogador seleciona uma de suas cartas disponíveis e a lança na mesa aberta com o valor visível para todos os participantes.
* **Objetivo:** Disputar a posse da vaza com base na hierarquia de força da carta jogada.
* **Stakeholders:** Jogador (STK-01), Motor de Regras (STK-03).
* **Ator Principal:** Jogador.
* **Pré-condições:** Ser o turno do jogador e possuir a carta em sua mão.
* **Entradas:** Identificador da carta escolhida (`valor`, `naipe`).
* **Processamento Esperado:** Remover a carta da mão do jogador, inseri-la no estado da vaza corrente da mesa e calcular sua força relativa contra as cartas já jogadas.
* **Saídas/Resultados:** Carta exibida na mesa para todos os participantes e avanço do turno para o próximo jogador.
* **Regras de Negócio Relacionadas:** RN-006, RN-007.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-003.

---

### RF-006 — Descarte de Carta Encoberta (Blefe / Carta Queimada)
* **Título:** Descarte estratégico de carta com a face virada para baixo.
* **Descrição:** O sistema deve permitir que o jogador descarte uma carta encoberta na 2ª ou na 3ª vaza, ocultando seu valor e anulando seu poder de vitória na vaza corrente.
* **Objetivo:** Oportunizar jogadas de blefe e descarte de cartas desnecessárias sem revelar informações ao adversário.
* **Stakeholders:** Jogador (STK-01), Motor de Regras (STK-03).
* **Ator Principal:** Jogador.
* **Pré-condições:** Ser a 2ª ou 3ª vaza da rodada (proibido na 1ª vaza conforme RN-009).
* **Entradas:** Seleção de carta com a opção "Jogar Encoberta".
* **Processamento Esperado:** Validar que não é a 1ª vaza; atribuir força zero à carta; manter o valor oculto para os adversários.
* **Saídas/Resultados:** Carta exibida com verso na mesa.
* **Regras de Negócio Relacionadas:** RN-009.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-004.

---

### RF-007 — Apuração de Vencedor da Vaza e Resolução de Empates ("Canga")
* **Título:** Cálculo algorítmico do vencedor da vaza ou declaração de empate.
* **Descrição:** Ao final dos descartes de todos os jogadores em uma vaza, o motor deve comparar os pesos das cartas jogadas, declarar a equipe vencedora ou aplicar as regras de desempate de canga (RN-008).
* **Objetivo:** Determinar a evolução do placar de vazas e quem torna na vaza seguinte.
* **Stakeholders:** Motor de Regras (STK-03).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Todos os jogadores ativos descartaram sua carta na vaza.
* **Entradas:** Coleção de cartas jogadas na vaza.
* **Processamento Esperado:**
  1. Identificar a(s) maior(es) carta(s) da vaza.
  2. Se houver uma única carta mais forte (ou manilha com naipe superior): declarar o vencedor.
  3. Se houver duas maiores cartas comuns de mesmo valor de equipes opostas: declarar "Canga" (empate) e aplicar as diretrizes da RN-008.
* **Saídas/Resultados:** Anúncio visual do vencedor ou empate da vaza; recolhimento das cartas da mesa; atribuição do turno de saída da próxima vaza.
* **Regras de Negócio Relacionadas:** RN-006, RN-007, RN-008.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-003, UC-007.

---

### RF-008 — Solicitação de Aumento de Aposta (Truco, Seis, Nove e Doze)
* **Título:** Elevação do valor em tentos disputados na rodada.
* **Descrição:** O jogador em seu turno pode acionar a ação de pedir aumento de aposta respeitando os degraus: Truco (3), Seis (6), Nove (9) ou Doze (12).
* **Objetivo:** Aumentar a tensão e o valor da vitória da rodada.
* **Stakeholders:** Jogador (STK-01), Equipes (STK-02), Motor de Regras (STK-03).
* **Ator Principal:** Jogador.
* **Pré-condições:** Rodada ativa valendo menos que 12 tentos; não estar em Mão de 11 (RN-012) nem Mão de Ferro (RN-013); o último aumento não ter sido solicitado pela sua própria equipe.
* **Entradas:** Clique no botão correspondente de aposta ("Truco", "Pedir 6", "Pedir 9", "Cair do 12").
* **Processamento Esperado:** Congelar as jogadas de cartas; atualizar o valor proposto; transferir o foco de resposta exclusivamente para a equipe adversária.
* **Saídas/Resultados:** Notificação audiovisual em tela ("TRUCO!", "SEIS!", etc.) e painel de decisão aberto para os oponentes.
* **Regras de Negócio Relacionadas:** RN-010, RN-011.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-005.

---

### RF-009 — Tratamento de Respostas a Pedidos de Aposta
* **Título:** Processamento das opções de Aceitar, Correr ou Retrucar.
* **Descrição:** O sistema deve capturar a decisão da equipe desafiada: aceitar a aposta, correr da rodada concedendo os pontos anteriores, ou aumentar o desafio para o próximo nível.
* **Objetivo:** Resolver a negociação da aposta antes de prosseguir a partida.
* **Stakeholders:** Jogadores da equipe desafiada (STK-01), Motor de Regras (STK-03).
* **Ator Principal:** Jogador desafiado.
* **Pré-condições:** Pedido de aposta pendente de resposta.
* **Entradas:** Opção selecionada (`Aceitar`, `Correr`, `Aumentar`).
* **Processamento Esperado:**
  - *Se Aceitar:* Definir o novo valor oficial da rodada e retomar o turno de descarte.
  - *Se Correr:* Encerrar a rodada imediatamente, creditar os pontos do degrau anterior à equipe desafiante e iniciar nova rodada.
  - *Se Aumentar:* Passar o status de aposta para o próximo nível e repassar o direito de resposta para a outra equipe.
* **Saídas/Resultados:** Feedback sonoro/visual da resposta e atualização de estado da rodada.
* **Regras de Negócio Relacionadas:** RN-010, RN-011.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-006.

---

### RF-010 — Computação de Pontos da Rodada e Atualização do Placar Geral
* **Título:** Crédito formal dos tentos disputados no placar da partida.
* **Descrição:** Quando uma equipe vence a melhor de 3 vazas ou quando o adversário corre de uma aposta, os pontos conquistados são somados ao placar da equipe vencedora.
* **Objetivo:** Manter a contagem oficial de tentos até os 12 pontos de encerramento.
* **Stakeholders:** Motor de Regras (STK-03).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Conclusão de rodada por vazas ou por desistência.
* **Entradas:** Equipe vencedora e valor final em tentos da rodada.
* **Processamento Esperado:** Incrementar placar da equipe correspondente; avaliar condição de vitória (placar >= 12); se < 12, verificar gatilhos de Mão de 11 (RN-012) ou Mão de Ferro (RN-013).
* **Saídas/Resultados:** Placar atualizado na interface central e log da rodada.
* **Regras de Negócio Relacionadas:** RN-007, RN-010, RN-014.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-010.

---

### RF-011 — Execução do Protocolo de "Mão de 11"
* **Título:** Condução especial da rodada quando uma equipe atinge 11 tentos.
* **Descrição:** Ao detectar que uma equipe possui 11 tentos (e o oponente menos de 11), o motor deve exibir as cartas compartilhadas entre os parceiros daquela equipe e solicitar que decidam se jogam valendo 3 pontos ou correm cedendo 1 ponto.
* **Objetivo:** Executar com exatidão a regra tradicional de pré-vitória.
* **Stakeholders:** Equipe com 11 pontos (STK-02), Motor de Regras (STK-03).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Uma das equipes com exatamente 11 pontos.
* **Entradas:** Escolha conjunta da equipe (`Jogar` ou `Fugir`).
* **Processamento Esperado:**
  - Compartilhar a visão das mãos entre os parceiros da equipe.
  - Bloquear terminantemente os botões de pedir Truco para todos os participantes da mesa.
  - Se decidirem correr: creditar 1 ponto ao oponente. Se decidirem jogar: fixar a rodada em 3 pontos.
* **Saídas/Resultados:** Interface adaptada para Mão de 11 e partida direcionada conforme decisão.
* **Regras de Negócio Relacionadas:** RN-012.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-008.

---

### RF-012 — Execução do Protocolo de "Mão de Ferro" (11 a 11)
* **Título:** Condução da disputa cega na rodada final de desempate.
* **Descrição:** Se ambas as equipes alcançarem 11 tentos, o sistema deve iniciar a Mão de Ferro, mantendo as cartas de todos os jogadores viradas para baixo sem revelação prévia.
* **Objetivo:** Proporcionar o clímax tradicional do Truco no escuro.
* **Stakeholders:** Jogadores (STK-01), Motor de Regras (STK-03).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Placar oficial em 11 x 11.
* **Entradas:** Distribuição de cartas da rodada final.
* **Processamento Esperado:** Ocultar o valor das cartas na interface do próprio usuário; permitir apenas o comando "Descartar no Escuro"; revelar a carta na mesa somente no momento do descarte; vedar qualquer aumento de aposta.
* **Saídas/Resultados:** Cartas jogadas às cegas e vencedor consagrado campeão da partida.
* **Regras de Negócio Relacionadas:** RN-013.
* **Prioridade:** Alta.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-009.

---

### RF-013 — Detecção de Vitória da Partida e Encerramento
* **Título:** Reconhecimento do campeão ao atingir 12 tentos e encerramento da mesa.
* **Descrição:** O motor deve identificar quando uma equipe atingir 12 tentos, bloquear novas rodadas, declarar a equipe vencedora e disponibilizar estatísticas finais.
* **Objetivo:** Concluir a sessão competitiva e consolidar o resultado.
* **Stakeholders:** Jogadores (STK-01), Motor de Regras (STK-03).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Placar de uma das equipes >= 12 tentos.
* **Entradas:** Atualização final do placar.
* **Processamento Esperado:** Emitir tela de vitória/derrota com animação comemorativa, gravar o histórico completo da partida e liberar os jogadores para uma revanche ou retorno ao lobby.
* **Saídas/Resultados:** Modal de fim de partida e salvamento de dados estatísticos.
* **Regras de Negócio Relacionadas:** RN-014.
* **Prioridade:** Crítica.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-010.

---

### RF-014 — Envio de Sinais Tradicionais de Dupla e Efeitos de Blefe
* **Título:** Módulo imersivo de comunicação de sinais de cartas e expressões de Truco.
* **Descrição:** No modo duplas, o jogador pode enviar sinais secretos ao seu parceiro para indicar manilhas em mãos (Zap = piscar de olho, Copas = bochecha, Espadilha = sobrancelha, Ouros = morder lábio) e acionar gritos culturais de provocação esportiva.
* **Objetivo:** Reproduzir a atmosfera folclórica e estratégica presencial das mesas de Truco.
* **Stakeholders:** Jogadores (STK-01).
* **Ator Principal:** Jogador.
* **Pré-condições:** Partida no modo 2v2 em andamento.
* **Entradas:** Gatilho de sinal ou expressão selecionada no painel de comunicação.
* **Processamento Esperado:** Transmitir o sinal exclusivamente para o canal de dados do parceiro de dupla (ou para a mesa inteira se for grito de Truco aberto).
* **Saídas/Resultados:** Animação de sinal visual no avatar do parceiro.
* **Regras de Negócio Relacionadas:** RN-016.
* **Prioridade:** Média.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-012.

---

### RF-015 — Log de Auditoria e Histórico da Partida
* **Título:** Registro cronológico de todas as jogadas, apostas e transições de estado.
* **Descrição:** O sistema deve manter um log detalhado de cada evento da partida (cartas distribuídas, vira aberta, descartes, pedidos de truco, respostas e placares parciais).
* **Objetivo:** Permitir auditoria contra trapaças e consulta de replay pós-jogo.
* **Stakeholders:** Auditoria (STK-04), Jogadores (STK-01).
* **Ator Principal:** Motor de Regras.
* **Pré-condições:** Partida em andamento.
* **Entradas:** Todos os eventos da partida com timestamps precisos.
* **Processamento Esperado:** Persistir a sequência de eventos em formato estruturado (JSON/SQLite).
* **Saídas/Resultados:** Relatório de auditoria consultável ao término da disputa.
* **Regras de Negócio Relacionadas:** RN-014.
* **Prioridade:** Média.
* **Status:** **Aprovado**.
* **Casos de Uso Relacionados:** UC-011.

---

## 4. Requisitos Não Funcionais (RNF)

---

### RNF-001 — Desempenho e Latência em Tempo Real
* **Descrição:** A propagação de ações críticas (descarte de cartas, pedidos de Truco e respostas) deve ocorrer com latência de rede inferior a **200 ms** para 99% das interações via protocolo bidirecional (WebSockets).
* **Prioridade:** Crítica.
* **Métrica:** Tempo de resposta p99 <= 200 ms.

---

### RNF-002 — Aleatoriedade Criptográfica e Imparcialidade do Baralho
* **Descrição:** O embaralhamento deve obrigatoriamente utilizar um gerador de números pseudoaleatórios criptograficamente seguro (CSPRNG) e o algoritmo Fisher-Yates, garantindo que todas as permutações de baralho tenham probabilidades estritamente iguais e imprevisíveis.
* **Prioridade:** Crítica.
* **Métrica:** Aprovado em testes estatísticos de aleatoriedade (Dieharder / NIST SP 800-22).

---

### RNF-003 — Segurança e Prevenção contra Trapaças (Anti-Cheat)
* **Descrição:** As cartas da mão de um jogador não devem sob hipótese alguma ser transmitidas na rede ou armazenadas na memória do navegador de jogadores adversários antes do descarte formal na mesa, prevenindo uso de inspetores de pacotes ou trapaças no cliente.
* **Prioridade:** Crítica.
* **Métrica:** Zero vazamento de metadados de cartas não descartadas nos payloads de rede.

---

### RNF-004 — Concorrência e Tolerância a Desconexões
* **Descrição:** Em caso de perda momentânea de conexão de um jogador, o sistema deve conceder uma tolerância de até **30 segundos** para reconexão sem perda da mão, transferindo o controle provisório para um agente de inteligência artificial de salvaguarda.
* **Prioridade:** Alta.
* **Métrica:** Reconexão com restauração do estado em menos de 2 segundos.

---

### RNF-005 — Usabilidade e Acessibilidade Visual do Baralho
* **Descrição:** As cartas na interface devem possuir alto contraste visual entre naipes (Copas e Ouros em vermelho vibrante; Espadas e Paus em preto escuro), com identificadores nítidos de Manilhas para evitar ambiguidades em dispositivos móveis e monitores compactos.
* **Prioridade:** Alta.
* **Métrica:** Conformidade com as diretrizes WCAG 2.1 nível AA.

---

### RNF-006 — Disponibilidade e Escalabilidade das Salas de Jogo
* **Descrição:** A arquitetura do motor deve suportar múltiplos pares e quartetos de partidas simultâneas de forma isolada, mantendo disponibilidade de serviço de **99,9%**.
* **Prioridade:** Alta.
* **Métrica:** Índice de disponibilidade mensal >= 99,9%.

---

## 5. Matriz de Rastreabilidade

| Requisito Funcional | Regras de Negócio Vinculadas | Casos de Uso Relacionados | Requisitos Não Funcionais |
|:---:|:---:|:---:|:---:|
| **RF-001** | RN-001, RN-002, RN-005 | UC-001 | RNF-006 |
| **RF-002** | RN-001, RN-015 | UC-002, UC-003 | RNF-001 |
| **RF-003** | RN-002, RN-003 | UC-002 | RNF-002, RNF-003 |
| **RF-004** | RN-004, RN-005, RN-006 | UC-002 | RNF-005 |
| **RF-005** | RN-006, RN-007 | UC-003 | RNF-001 |
| **RF-006** | RN-009 | UC-004 | RNF-003 |
| **RF-007** | RN-006, RN-007, RN-008 | UC-003, UC-007 | RNF-001 |
| **RF-008** | RN-010, RN-011 | UC-005 | RNF-001 |
| **RF-009** | RN-010, RN-011 | UC-006 | RNF-001 |
| **RF-010** | RN-007, RN-010, RN-014 | UC-010 | RNF-001 |
| **RF-011** | RN-012 | UC-008 | RNF-003, RNF-005 |
| **RF-012** | RN-013 | UC-009 | RNF-003 |
| **RF-013** | RN-014 | UC-010 | RNF-001 |
| **RF-014** | RN-016 | UC-012 | RNF-001 |
| **RF-015** | RN-014 | UC-011 | RNF-002, RNF-006 |
