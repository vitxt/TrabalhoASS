# Regras de Negócio e Requisitos de Software

## Fluxo de evolução

```text
NECESSIDADE / PROBLEMA
        ↓
STAKEHOLDERS
        ↓
REGRAS DE NEGÓCIO (RN)
        ↓
REQUISITOS DE SOFTWARE (RF / RNF)
        ↓
CASOS DE USO / COMPORTAMENTO
        ↓
TAREFAS DE DESENVOLVIMENTO
        ↓
IMPLEMENTAÇÃO
        ↓
TESTES
        ↓
VALIDAÇÃO
        ↓
EVOLUÇÃO
```

---

## Identificação padronizada

| Artefato | Prefixo | Exemplo |
|---|---|---|
| Regra de Negócio | `RN` | `RN-001` |
| Requisito Funcional | `RF` | `RF-001` |
| Requisito Não Funcional | `RNF` | `RNF-001` |
| Caso de Uso | `UC` | `UC-001` |
| História/Tarefa | `TASK` | `TASK-001` |
| Caso de Teste | `CT` | `CT-001` |
| Diagrama | `DG` | `DG-001` |

---

## Stakeholders

| ID | Papel | Descrição |
|---|---|---|
| STK-01 | **Contratado** | Influenciador / freelancer que oferta serviços de criação de conteúdo |
| STK-02 | **Contratante** | Empresa que busca criadores de conteúdo para campanhas |
| STK-03 | **Plataforma** | Negócio que intermedia, cobra comissão e garante segurança financeira |
| STK-04 | **Suporte** | Equipe que resolve disputas, fraudes e reembolsos |

---

# REGRAS DE NEGÓCIO

---

## RN-001 — Comissão da Plataforma

**Título:**  
Cobrança de comissão sobre contratos fechados.

**Descrição:**  
A plataforma retém 12,5% sobre o valor total de cada contrato fechado entre contratante e contratado. Esse desconto já é incorporado ao valor exibido para o freelancer, ou seja, o valor que o contratado vê na vaga é o valor líquido que receberá.

**Origem:**  
Requisito de negócio — modelo de monetização da plataforma.

**Stakeholders envolvidos:**  
Contratante, Contratado, Plataforma.

**Condição:**  
Aplicada toda vez que um contrato for formalmente fechado entre as partes.

**Regra:**  
- O contratante paga o valor bruto (valor acordado).  
- A plataforma retém 12,5% do valor bruto como comissão.  
- O contratado recebe o valor líquido (valor bruto − 12,5%).  
- O valor líquido deve ser exibido para o contratado no momento da candidatura.

**Exceções:**  
Nenhuma no MVP. Descontos promocionais poderão ser previstos em versões futuras.

**Dados envolvidos:**  
Valor bruto do contrato, percentual de comissão (12,5%), valor líquido calculado.

**Prioridade:**  
Crítica

**Status:**  
Aprovado

**Requisitos relacionados:**  
RF-010, RF-011

**Observações:**  
O percentual de 12,5% poderá ser revisto após análise de custo operacional e viabilidade financeira.

---

## RN-002 — Liberação de Pagamento Condicional à Aprovação de Conteúdo

**Título:**  
Pagamento bloqueado até aprovação do conteúdo entregue.

**Descrição:**  
O valor pago pelo contratante é retido pela plataforma (modelo escrow) e só liberado ao contratado após a entrega e aprovação formal do conteúdo prometido em contrato.

**Origem:**  
Requisito de negócio — proteção ao contratante e redução de fraudes.

**Stakeholders envolvidos:**  
Contratante, Contratado, Plataforma, Suporte.

**Condição:**  
Aplicada em todos os contratos vigentes na plataforma.

**Regra:**  
- O contratante realiza o pagamento no momento da formalização do contrato.  
- O valor fica retido pela plataforma até que o contratado poste o conteúdo para avaliação.  
- O contratante tem prazo definido em contrato para aprovar ou recusar o conteúdo.  
- Aprovado o conteúdo, o pagamento é liberado ao contratado (descontada a comissão RN-001).  
- Em caso de recusa com justificativa, o contrato entra em disputa mediada pelo suporte.

**Exceções:**  
- Se o contratante não se manifestar dentro do prazo, o pagamento é liberado automaticamente.

**Dados envolvidos:**  
Contrato, valor bruto, status do pagamento, conteúdo entregue, aprovação do contratante, prazo de resposta.

**Prioridade:**  
Crítica

**Status:**  
Aprovado

**Requisitos relacionados:**  
RF-009, RF-011, RF-012

**Observações:**  
O prazo para aprovação deve ser configurável por tipo de contrato. Definição do prazo padrão a ser feita em versão posterior.

---

## RN-003 — Reembolso em Caso de Golpe ou Disputa

**Título:**  
Política de reembolso para contratante e contratado em caso de fraude.

**Descrição:**  
Ambos os lados (contratante e contratado) podem acionar o suporte para solicitar reembolso caso identifiquem má-fé ou descumprimento de contrato.

**Origem:**  
Requisito de negócio — segurança e confiança na plataforma.

**Stakeholders envolvidos:**  
Contratante, Contratado, Suporte, Plataforma.

**Condição:**  
Acionada quando qualquer das partes reportar fraude ou descumprimento de contrato.

**Regra:**  
- O contratante pode solicitar reembolso total enquanto o pagamento ainda estiver retido (antes da aprovação do conteúdo).  
- O contratado pode solicitar proteção caso o contratante recuse indevidamente o conteúdo entregue.  
- O suporte analisa a disputa e decide sobre o reembolso ou liberação do pagamento.

**Exceções:**  
- Se o pagamento já foi liberado, o reembolso depende de análise manual pelo suporte.

**Dados envolvidos:**  
Contrato, status do pagamento, relatos de fraude, histórico de comunicação, conteúdo entregue.

**Prioridade:**  
Alta

**Status:**  
Em análise

**Requisitos relacionados:**  
RF-012, RF-013

**Observações:**  
A política de reembolso detalhada (prazos, critérios) deve ser formalizada antes do lançamento.

---

## RN-004 — Conformidade com LGPD e Direitos de Imagem

**Título:**  
Tratamento de dados pessoais e proteção de direitos de imagem.

**Descrição:**  
A plataforma deve operar em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e garantir que os direitos de imagem dos contratados sejam formalizados nos contratos.

**Origem:**  
Legislação brasileira (LGPD) e requisito de negócio.

**Stakeholders envolvidos:**  
Contratado, Contratante, Plataforma.

**Condição:**  
Aplicada permanentemente em todas as operações que envolvam dados pessoais e conteúdo de imagem.

**Regra:**  
- Dados pessoais coletados (CPF, RG, dados bancários) devem ser armazenados com criptografia.  
- O contratado deve autorizar explicitamente o uso de seu conteúdo e imagem pelo contratante no momento da assinatura do contrato.  
- O usuário pode solicitar exclusão de seus dados a qualquer momento (direito ao esquecimento).  
- A plataforma não pode compartilhar dados pessoais com terceiros sem consentimento.

**Exceções:**  
Dados podem ser compartilhados com autoridades em caso de investigação legal.

**Dados envolvidos:**  
Dados pessoais do contratado e do contratante, contratos, autorizações de uso de imagem.

**Prioridade:**  
Crítica

**Status:**  
Em análise

**Requisitos relacionados:**  
RNF-001, RNF-002, RF-001, RF-004

**Observações:**  
Recomendável consultar assessoria jurídica antes do lançamento.

---

## RN-005 — Portfólio com Limite de Vídeos

**Título:**  
Limite de itens multimídia no portfólio do contratado.

**Descrição:**  
O contratado pode adicionar ao seu portfólio documentos, textos, fotos e vídeos, porém com um limite de itens de vídeo para incentivar a curadoria do melhor trabalho.

**Origem:**  
Decisão de produto — experiência do usuário e performance da plataforma.

**Stakeholders envolvidos:**  
Contratado, Contratante.

**Condição:**  
Aplicada no momento de edição e publicação do portfólio.

**Regra:**  
- O contratado pode adicionar: links externos (YouTube, Instagram, TikTok), fotos, documentos e textos descritivos sem limite definido.  
- Vídeos hospedados diretamente na plataforma ficam limitados a **5 itens** por portfólio.  
- Links externos para vídeos (ex: YouTube) não contam no limite.

**Exceções:**  
O limite de vídeos poderá ser revisado em versões futuras.

**Dados envolvidos:**  
Portfólio, itens de vídeo, links externos, fotos, documentos.

**Prioridade:**  
Média

**Status:**  
Proposto

**Requisitos relacionados:**  
RF-002

**Observações:**  
O limite exato (5 vídeos) está sujeito a revisão após análise de infraestrutura e armazenamento.

---

# REQUISITOS FUNCIONAIS

---

## RF-001 — Cadastro do Contratado

**Título:**  
Cadastro e autenticação de contratado.

**Descrição:**  
O sistema deve permitir que um influenciador/freelancer se cadastre na plataforma, informando seus dados pessoais, cadastrais e bancários.

**Objetivo:**  
Habilitar o contratado a acessar vagas, montar portfólio e receber pagamentos.

**Stakeholders:**  
Contratado.

**Ator principal:**  
Contratado.

**Pré-condições:**  
- Nenhuma conta ativa com o mesmo CPF ou e-mail.

**Entradas:**  
- Nome completo, CPF, RG, telefone, e-mail, senha.  
- Nacionalidade, escolaridade.  
- Dados bancários: banco, agência, conta, chave PIX.

**Processamento esperado:**  
O sistema valida os dados, verifica duplicidade de CPF/e-mail e cria a conta do usuário com status "ativo".

**Saídas/Resultados:**  
Conta criada, e-mail de confirmação enviado.

**Pós-condições:**  
O contratado pode fazer login e editar seu perfil/portfólio.

**Fluxos alternativos/exceções:**  
- CPF ou e-mail já cadastrado → exibir mensagem de erro.  
- Dados bancários inválidos → solicitar correção.

**Regras de negócio relacionadas:**  
RN-004

**Prioridade:**  
Crítica

**Status:**  
Aprovado

**Critérios de aceite:**  
- Não permitir dois cadastros com o mesmo CPF.  
- Não permitir dois cadastros com o mesmo e-mail.  
- Validar formato de CPF e chave PIX.  
- Enviar e-mail de confirmação de cadastro.

**Casos de uso relacionados:**  
UC-001

**Tarefas relacionadas:**  
TASK-001

**Casos de teste relacionados:**  
CT-001

---

## RF-002 — Gestão de Portfólio do Contratado

**Título:**  
Criação e edição de portfólio multimídia.

**Descrição:**  
O sistema deve permitir que o contratado crie e gerencie um portfólio contendo vídeos (com limite), fotos, documentos, textos descritivos e links externos para trabalhos anteriores.

**Objetivo:**  
Permitir que o contratado exiba seus trabalhos para contratantes e aumente suas chances de ser contratado.

**Stakeholders:**  
Contratado, Contratante.

**Ator principal:**  
Contratado.

**Pré-condições:**  
- Contratado autenticado na plataforma.

**Entradas:**  
- Vídeos (upload direto, máximo 5), fotos, documentos, textos e links externos.

**Processamento esperado:**  
O sistema valida o tipo e tamanho dos arquivos, aplica o limite de vídeos (RN-005) e salva os itens no perfil público do contratado.

**Saídas/Resultados:**  
Portfólio atualizado e visível para contratantes.

**Pós-condições:**  
As informações do portfólio são exibidas na página de perfil público do contratado.

**Fluxos alternativos/exceções:**  
- Tentativa de upload do 6º vídeo → bloquear e exibir mensagem de limite atingido.  
- Arquivo com formato não suportado → exibir mensagem de erro.

**Regras de negócio relacionadas:**  
RN-005

**Prioridade:**  
Alta

**Status:**  
Aprovado

**Critérios de aceite:**  
- Permitir upload de no máximo 5 vídeos diretos.  
- Aceitar links externos sem limite.  
- Exibir portfólio em perfil público visível para contratantes.  
- Bloquear upload além do limite com mensagem clara.

**Casos de uso relacionados:**  
UC-002

**Tarefas relacionadas:**  
TASK-002

**Casos de teste relacionados:**  
CT-002

---

## RF-003 — Cadastro do Contratante

**Título:**  
Cadastro e autenticação de contratante (empresa).

**Descrição:**  
O sistema deve permitir que uma empresa se cadastre na plataforma informando dados institucionais e de contato.

**Objetivo:**  
Habilitar o contratante a publicar vagas, explorar perfis e contratar influenciadores.

**Stakeholders:**  
Contratante.

**Ator principal:**  
Contratante.

**Pré-condições:**  
- Nenhuma conta ativa com o mesmo CNPJ ou e-mail.

**Entradas:**  
- CNPJ, razão social, ramo de atuação, endereço, e-mail, telefone, senha.

**Processamento esperado:**  
O sistema valida o CNPJ, verifica duplicidade e cria a conta.

**Saídas/Resultados:**  
Conta criada, e-mail de confirmação enviado.

**Pós-condições:**  
O contratante pode publicar vagas e explorar perfis.

**Fluxos alternativos/exceções:**  
- CNPJ já cadastrado → exibir mensagem de erro.  
- CNPJ com formato inválido → solicitar correção.

**Regras de negócio relacionadas:**  
RN-004

**Prioridade:**  
Crítica

**Status:**  
Aprovado

**Critérios de aceite:**  
- Não permitir dois cadastros com o mesmo CNPJ.  
- Validar formato de CNPJ.  
- Enviar e-mail de confirmação de cadastro.

**Casos de uso relacionados:**  
UC-003

**Tarefas relacionadas:**  
TASK-003

**Casos de teste relacionados:**  
CT-003

---

## RF-004 — Publicação de Vaga pelo Contratante

**Título:**  
Criar e publicar uma vaga de criação de conteúdo.

**Descrição:**  
O sistema deve permitir que o contratante publique uma vaga detalhando o perfil buscado, tipo de conteúdo, remuneração e tipo de contrato.

**Objetivo:**  
Conectar contratantes com influenciadores adequados ao seu perfil de campanha.

**Stakeholders:**  
Contratante, Contratado.

**Ator principal:**  
Contratante.

**Pré-condições:**  
- Contratante autenticado e com cadastro ativo.

**Entradas:**  
- Título da vaga, descrição, tipo de conteúdo esperado, exemplos de referência (links/imagens), remuneração (valor bruto), tipo de contrato, prazo de entrega, regras e exigências da empresa.

**Processamento esperado:**  
O sistema salva a vaga e a publica no hub de vagas. O valor líquido exibido ao contratado é calculado automaticamente (valor bruto − 12,5%).

**Saídas/Resultados:**  
Vaga publicada e visível para contratados.

**Pós-condições:**  
A vaga aparece no hub de vagas para candidatura.

**Fluxos alternativos/exceções:**  
- Campos obrigatórios não preenchidos → impedir publicação com mensagem de erro.

**Regras de negócio relacionadas:**  
RN-001, RN-004

**Prioridade:**  
Crítica

**Status:**  
Aprovado

**Critérios de aceite:**  
- Vaga visível para todos os contratados após publicação.  
- Valor líquido calculado e exibido corretamente (bruto × 0,875).  
- Campos obrigatórios validados antes da publicação.

**Casos de uso relacionados:**  
UC-004

**Tarefas relacionadas:**  
TASK-004

**Casos de teste relacionados:**  
CT-004

---

## RF-005 — Consulta e Candidatura a Vagas pelo Contratado

**Título:**  
Consultar e se candidatar a vagas disponíveis.

**Descrição:**  
O sistema deve permitir que o contratado visualize as vagas publicadas no hub e se candidate às que lhe interessam.

**Objetivo:**  
Conectar freelancers com oportunidades de trabalho na plataforma.

**Stakeholders:**  
Contratado, Contratante.

**Ator principal:**  
Contratado.

**Pré-condições:**  
- Contratado autenticado.  
- Ao menos uma vaga publicada.

**Entradas:**  
- Seleção da vaga; opcional: mensagem de candidatura.

**Processamento esperado:**  
O sistema registra a candidatura e notifica o contratante.

**Saídas/Resultados:**  
Candidatura registrada e contratante notificado.

**Pós-condições:**  
A candidatura aparece na lista de aplicados da vaga para o contratante.

**Fluxos alternativos/exceções:**  
- Candidatura duplicada → impedir e informar o contratado.

**Regras de negócio relacionadas:**  
—

**Prioridade:**  
Crítica

**Status:**  
Aprovado

**Critérios de aceite:**  
- Contratado não pode se candidatar duas vezes à mesma vaga.  
- Contratante recebe notificação de nova candidatura.  
- Candidatura fica visível na área de gestão da vaga.

**Casos de uso relacionados:**  
UC-005

**Tarefas relacionadas:**  
TASK-005

**Casos de teste relacionados:**  
CT-005

---

## RF-006 — Exploração de Perfis pelo Contratante

**Título:**  
Explorar e contatar perfis de influenciadores na plataforma.

**Descrição:**  
O sistema deve permitir que o contratante explore perfis públicos de contratados (mesmo os que não se candidataram à vaga) e os contate diretamente.

**Objetivo:**  
Ampliar as opções de busca ativa por criadores de conteúdo.

**Stakeholders:**  
Contratante, Contratado.

**Ator principal:**  
Contratante.

**Pré-condições:**  
- Contratante autenticado.  
- Contratado com perfil público ativo.

**Entradas:**  
- Filtros opcionais (nicho, localização, etc.).

**Processamento esperado:**  
O sistema lista perfis públicos de contratados com preview de portfólio.

**Saídas/Resultados:**  
Lista de perfis exibida; contratante pode visualizar o portfólio completo e enviar mensagem.

**Pós-condições:**  
—

**Fluxos alternativos/exceções:**  
- Nenhum perfil encontrado com os filtros → exibir mensagem informativa.

**Regras de negócio relacionadas:**  
RN-004

**Prioridade:**  
Alta

**Status:**  
Aprovado

**Critérios de aceite:**  
- Exibir portfólio público do contratado.  
- Permitir envio de mensagem/convite para o contratado.

**Casos de uso relacionados:**  
UC-006

**Tarefas relacionadas:**  
TASK-006

**Casos de teste relacionados:**  
CT-006

---

## RF-007 — Formalização e Assinatura de Contrato

**Título:**  
Geração e aceite de contrato entre as partes.

**Descrição:**  
O sistema deve gerar um contrato digital com os termos acordados (valor, prazo, tipo de conteúdo, direitos de imagem) e exigir aceite de ambas as partes antes de iniciar o trabalho.

**Objetivo:**  
Formalizar o acordo e proteger legalmente contratante e contratado.

**Stakeholders:**  
Contratante, Contratado, Plataforma.

**Ator principal:**  
Contratante (inicia), Contratado (aceita).

**Pré-condições:**  
- Contratante selecionou o contratado.  
- Termos do contrato definidos.

**Entradas:**  
- Termos do contrato, valor, prazo, tipo de conteúdo, autorização de uso de imagem.

**Processamento esperado:**  
O sistema gera o contrato, notifica o contratado para aceite e registra o aceite de ambas as partes com timestamp.

**Saídas/Resultados:**  
Contrato assinado digitalmente e armazenado.

**Pós-condições:**  
O contrato entra em vigor; o contratante é solicitado a realizar o pagamento (RF-008).

**Fluxos alternativos/exceções:**  
- Contratado recusa os termos → contrato cancelado, partes notificadas.

**Regras de negócio relacionadas:**  
RN-002, RN-004

**Prioridade:**  
Crítica

**Status:**  
Aprovado

**Critérios de aceite:**  
- Contrato deve incluir cláusula de direitos de imagem.  
- Ambas as partes devem aceitar explicitamente antes do início do trabalho.  
- Timestamp de aceite deve ser registrado.

**Casos de uso relacionados:**  
UC-007

**Tarefas relacionadas:**  
TASK-007

**Casos de teste relacionados:**  
CT-007

---

## RF-008 — Pagamento via Gateway (Escrow)

**Título:**  
Realizar pagamento e retenção do valor pela plataforma.

**Descrição:**  
O sistema deve processar o pagamento do contratante via gateway de pagamentos e reter o valor até aprovação do conteúdo entregue.

**Objetivo:**  
Garantir segurança financeira para ambas as partes.

**Stakeholders:**  
Contratante, Contratado, Plataforma.

**Ator principal:**  
Contratante.

**Pré-condições:**  
- Contrato assinado por ambas as partes (RF-007).

**Entradas:**  
- Dados de pagamento do contratante (cartão, PIX ou outro método suportado).  
- Valor bruto do contrato.

**Processamento esperado:**  
O sistema envia os dados ao gateway de pagamentos, processa a transação e retém o valor em escrow na plataforma.

**Saídas/Resultados:**  
Pagamento confirmado, valor retido, contratado notificado para iniciar o trabalho.

**Pós-condições:**  
O contrato tem status "em andamento"; valor fica bloqueado até aprovação.

**Fluxos alternativos/exceções:**  
- Pagamento recusado pelo gateway → notificar contratante e aguardar nova tentativa.

**Regras de negócio relacionadas:**  
RN-001, RN-002

**Prioridade:**  
Crítica

**Status:**  
Em análise

**Critérios de aceite:**  
- Valor só pode ser processado após assinatura do contrato.  
- Confirmação de pagamento enviada a ambas as partes.  
- Valor retido não pode ser liberado sem aprovação do conteúdo ou decisão do suporte.

**Casos de uso relacionados:**  
UC-008

**Tarefas relacionadas:**  
TASK-008

**Casos de teste relacionados:**  
CT-008

---

## RF-009 — Entrega e Avaliação Prévia do Conteúdo

**Título:**  
Postagem do conteúdo para aprovação do contratante.

**Descrição:**  
O sistema deve permitir que o contratado poste o conteúdo produzido para avaliação prévia do contratante antes da liberação do pagamento.

**Objetivo:**  
Garantir que o contratante valide o conteúdo antes de o pagamento ser liberado.

**Stakeholders:**  
Contratado, Contratante.

**Ator principal:**  
Contratado.

**Pré-condições:**  
- Contrato com status "em andamento".  
- Pagamento retido em escrow.

**Entradas:**  
- Arquivo(s) de conteúdo produzido ou link para o conteúdo.

**Processamento esperado:**  
O sistema registra a entrega, notifica o contratante e inicia o prazo de aprovação.

**Saídas/Resultados:**  
Conteúdo disponível para avaliação do contratante.

**Pós-condições:**  
O contratante pode aprovar ou recusar o conteúdo.

**Fluxos alternativos/exceções:**  
- Contratante não se manifesta dentro do prazo → pagamento liberado automaticamente (RN-002).

**Regras de negócio relacionadas:**  
RN-002

**Prioridade:**  
Crítica

**Status:**  
Aprovado

**Critérios de aceite:**  
- Notificação enviada ao contratante assim que o conteúdo for postado.  
- Prazo de resposta iniciado automaticamente após a entrega.  
- Liberação automática do pagamento se o prazo expirar sem resposta.

**Casos de uso relacionados:**  
UC-009

**Tarefas relacionadas:**  
TASK-009

**Casos de teste relacionados:**  
CT-009

---

## RF-010 — Avaliação Mútua entre Contratante e Contratado

**Título:**  
Sistema de avaliação após conclusão do contrato.

**Descrição:**  
O sistema deve permitir que contratante avalie o contratado e que o contratado avalie o contratante ao fim de um contrato concluído.

**Objetivo:**  
Criar um histórico de reputação que aumente a confiança na plataforma.

**Stakeholders:**  
Contratante, Contratado.

**Ator principal:**  
Contratante ou Contratado (avaliação mútua).

**Pré-condições:**  
- Contrato com status "concluído".

**Entradas:**  
- Nota (escala a definir) e comentário opcional.

**Processamento esperado:**  
O sistema registra a avaliação e exibe no perfil público do avaliado.

**Saídas/Resultados:**  
Avaliação publicada no perfil do avaliado.

**Pós-condições:**  
Reputação do usuário atualizada.

**Fluxos alternativos/exceções:**  
- Avaliação só pode ser feita uma vez por contrato por cada parte.

**Regras de negócio relacionadas:**  
—

**Prioridade:**  
Alta

**Status:**  
Aprovado

**Critérios de aceite:**  
- Avaliação disponível apenas após conclusão do contrato.  
- Cada parte avalia apenas uma vez por contrato.  
- Avaliação exibida publicamente no perfil.

**Casos de uso relacionados:**  
UC-010

**Tarefas relacionadas:**  
TASK-010

**Casos de teste relacionados:**  
CT-010

---

## RF-011 — Liberação do Pagamento ao Contratado

**Título:**  
Liberar pagamento após aprovação do conteúdo.

**Descrição:**  
O sistema deve liberar o valor retido em escrow ao contratado após a aprovação do conteúdo pelo contratante, descontando a comissão da plataforma.

**Objetivo:**  
Finalizar a transação financeira de forma segura.

**Stakeholders:**  
Contratado, Contratante, Plataforma.

**Ator principal:**  
Sistema (automático) ou Suporte (em caso de disputa).

**Pré-condições:**  
- Conteúdo aprovado pelo contratante (ou prazo expirado sem resposta).

**Entradas:**  
- Aprovação do contratante ou trigger de prazo expirado.

**Processamento esperado:**  
O sistema calcula o valor líquido (valor bruto − 12,5%), realiza a transferência via gateway ao contratado e registra a comissão da plataforma.

**Saídas/Resultados:**  
Pagamento efetuado ao contratado. Contratado e contratante notificados.

**Pós-condições:**  
Contrato com status "concluído".

**Fluxos alternativos/exceções:**  
- Disputa aberta → pagamento bloqueado até resolução pelo suporte (RF-012).

**Regras de negócio relacionadas:**  
RN-001, RN-002

**Prioridade:**  
Crítica

**Status:**  
Em análise

**Critérios de aceite:**  
- Valor líquido calculado corretamente (valor bruto × 0,875).  
- Transferência só ocorre após aprovação ou expiração de prazo.  
- Ambas as partes notificadas após a liquidação.

**Casos de uso relacionados:**  
UC-011

**Tarefas relacionadas:**  
TASK-011

**Casos de teste relacionados:**  
CT-011

---

## RF-012 — Abertura de Disputa e Reembolso

**Título:**  
Acionar suporte para disputa ou reembolso.

**Descrição:**  
O sistema deve permitir que qualquer das partes acione o suporte para abertura de disputa, bloqueando o pagamento enquanto a resolução está pendente.

**Objetivo:**  
Proteger usuários contra fraudes e descumprimento de contrato.

**Stakeholders:**  
Contratante, Contratado, Suporte.

**Ator principal:**  
Contratante ou Contratado.

**Pré-condições:**  
- Contrato ativo ou conteúdo entregue aguardando aprovação.

**Entradas:**  
- Motivo da disputa, evidências (capturas, mensagens, arquivos).

**Processamento esperado:**  
O sistema registra a disputa, bloqueia o pagamento e notifica o suporte.

**Saídas/Resultados:**  
Disputa aberta, pagamento congelado, suporte notificado.

**Pós-condições:**  
O suporte analisa e decide pela liberação ou reembolso.

**Fluxos alternativos/exceções:**  
- Partes chegam a acordo antes da decisão do suporte → disputa encerrada manualmente.

**Regras de negócio relacionadas:**  
RN-003

**Prioridade:**  
Alta

**Status:**  
Em análise

**Critérios de aceite:**  
- Pagamento bloqueado imediatamente após abertura de disputa.  
- Suporte notificado com todas as evidências enviadas.  
- Resultado da disputa notificado a ambas as partes.

**Casos de uso relacionados:**  
UC-012

**Tarefas relacionadas:**  
TASK-012

**Casos de teste relacionados:**  
CT-012

---

# REQUISITOS NÃO FUNCIONAIS

---

## RNF-001 — Segurança de Dados Pessoais (LGPD)

**Categoria:**  
Segurança

**Descrição:**  
O sistema deve armazenar dados pessoais sensíveis (CPF, RG, dados bancários) com criptografia em repouso e em trânsito.

**Justificativa:**  
Conformidade com a LGPD (Lei nº 13.709/2018) e proteção dos usuários da plataforma.

**Métrica/Critério mensurável:**  
- Dados em trânsito protegidos por TLS 1.2 ou superior.  
- Dados em repouso criptografados com AES-256 ou equivalente.  
- Auditoria de acesso a dados sensíveis registrada em log.

**Escopo:**  
Todos os módulos que armazenam ou transmitem dados pessoais (cadastro, contrato, pagamento).

**Prioridade:**  
Crítica

**Status:**  
Em análise

**Requisitos relacionados:**  
RF-001, RF-003, RF-007, RF-008

**Casos de teste relacionados:**  
CT-013

---

## RNF-002 — Conformidade PCI-DSS para Pagamentos

**Categoria:**  
Segurança

**Descrição:**  
O sistema não deve armazenar dados brutos de cartão de crédito. Todo o processamento de pagamentos deve ser delegado ao gateway de pagamentos, que deve ser certificado PCI-DSS.

**Justificativa:**  
Reduzir risco de vazamento de dados financeiros e responsabilidade legal da plataforma.

**Métrica/Critério mensurável:**  
- Nenhum dado de cartão armazenado no banco de dados da plataforma.  
- Integração exclusiva com gateway certificado PCI-DSS.  
- Tokens de pagamento utilizados no lugar dos dados brutos.

**Escopo:**  
Módulo de pagamentos (RF-008, RF-011).

**Prioridade:**  
Crítica

**Status:**  
Em análise

**Requisitos relacionados:**  
RF-008, RF-011

**Casos de teste relacionados:**  
CT-014

---

## RNF-003 — Tempo de Resposta das Operações Principais

**Categoria:**  
Desempenho

**Descrição:**  
O sistema deve responder às operações principais (listagem de vagas, carregamento de perfil, candidatura) em até 3 segundos para 95% das requisições em condições normais de operação.

**Justificativa:**  
Garantir boa experiência de uso, especialmente em dispositivos móveis com conexão variável.

**Métrica/Critério mensurável:**  
- Tempo de resposta P95 ≤ 3 segundos para listagem de vagas, carregamento de perfil e candidatura.

**Escopo:**  
Hub de vagas, perfis públicos e fluxo de candidatura.

**Prioridade:**  
Alta

**Status:**  
Proposto

**Requisitos relacionados:**  
RF-004, RF-005, RF-006

**Casos de teste relacionados:**  
CT-015

---

## RNF-004 — Disponibilidade da Plataforma

**Categoria:**  
Disponibilidade

**Descrição:**  
O sistema deve estar disponível pelo menos 99% do tempo, excluindo janelas de manutenção previamente comunicadas.

**Justificativa:**  
A plataforma intermedia transações financeiras; indisponibilidade causa prejuízo direto aos usuários.

**Métrica/Critério mensurável:**  
- Uptime ≥ 99% ao mês (downtime máximo de ~7,3 horas/mês).  
- Monitoramento contínuo com alertas automáticos.

**Escopo:**  
Todo o sistema.

**Prioridade:**  
Alta

**Status:**  
Proposto

**Requisitos relacionados:**  
RF-008, RF-009, RF-011

**Casos de teste relacionados:**  
CT-016

---

## RNF-005 — Usabilidade Mobile-First

**Categoria:**  
Usabilidade

**Descrição:**  
A interface deve ser responsiva e funcional em dispositivos móveis com telas a partir de 360px de largura, dado que o público-alvo (influenciadores) acessa majoritariamente via smartphone.

**Justificativa:**  
Influenciadores gerenciam seu trabalho predominantemente por celular.

**Métrica/Critério mensurável:**  
- Todas as funcionalidades principais acessíveis e utilizáveis em telas de 360px a 1920px.  
- Aprovação em testes de usabilidade com ao menos 5 usuários do público-alvo.

**Escopo:**  
Todo o frontend da plataforma.

**Prioridade:**  
Alta

**Status:**  
Proposto

**Requisitos relacionados:**  
RF-001, RF-002, RF-004, RF-005

**Casos de teste relacionados:**  
CT-017

---

# Rastreabilidade

```text
RN-001 (Comissão 12,5%)
   ↓
RF-004 (Publicação de Vaga — exibir valor líquido)
RF-008 (Pagamento via Escrow)
RF-011 (Liberação do Pagamento)

RN-002 (Escrow + Aprovação de Conteúdo)
   ↓
RF-007 (Formalização do Contrato)
RF-008 (Pagamento via Gateway)
RF-009 (Entrega e Avaliação do Conteúdo)
RF-011 (Liberação do Pagamento)

RN-003 (Reembolso e Disputas)
   ↓
RF-012 (Abertura de Disputa)

RN-004 (LGPD + Direitos de Imagem)
   ↓
RF-001 (Cadastro do Contratado)
RF-003 (Cadastro do Contratante)
RF-007 (Formalização do Contrato)
RNF-001 (Segurança de Dados)

RN-005 (Limite de Vídeos no Portfólio)
   ↓
RF-002 (Gestão de Portfólio)
```


