# Finddo

### Instruções de instalação/execução

-  `yarn install`
-  `npx react-native run-android` para Android
   -  Se aparecer um erro de processo do Node, rodar `react-native start` depois
-  `npx react-native run-ios` para iOS

## [Documentação do React Native](https://reactnative.dev/)

## [Configuração do ambiente de desenvolvimento do React Native](https://reactnative.dev/docs/environment-setup)

## Fluxo de atendimento ao cliente (requisições/status)

1. Cliente cria serviço em new-service -> status:"analise" / http: "POST: /orders"
2. Profissional pega o serviço -> http: "PUT: /orders/associate/${service.id}/${professional.id}":
   1. Caso orçamento prévio -> status: "orcamento_previo";
      1. Orçamento feito pelo profissional e aceito pelo cliente -> status: status: "agendando_visita" / "POST: /orders/propose_budget"
   2. Caso orçamento presencial -> status: "agendando_visita";
3. Agendamento aprovado, a ou faltando 1 dia para o serviço -> status: "a_caminho" / "PUT: /orders/${order.id}/reschedulings/${accepted} || "NAO TEM RODA PARA ACEITAR O PROPOSTO" || "UseEffect comparando as datas""
4. Nessa etapa aparece um botão de o usuário está no local -> status: "em_servico" / "NAO POSSUI ROTA"
5. Após clicar nesse botao libera um acesso para o profissional cobrar onde diz que o serviço foi encerrado -> "NAO POSSUI STATUS PARA AGUARDANDO PAGAMENTO" / "STATUS MUDA INTERNAMENTE APOS PAGAMENTO"
