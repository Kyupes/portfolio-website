---
project: employee-management-api
locale: pt
title: "API de gerenciamento de funcionários"
summary: "Serviço para gerenciar registros de funcionários, controlar o acesso a eles e consultar dados resumidos."
technicalOverview: |
  A API oferece cadastro e autenticação de usuários, operações de criação, consulta, atualização e exclusão de funcionários, busca com filtros e paginação, além de estatísticas agregadas. Requisições são validadas com Zod; consultas a funcionários exigem autenticação e respeitam o papel e a identidade do usuário.
architecture: |
  O fluxo de uma requisição passa por middlewares de autenticação, autorização e validação antes de chegar aos controllers. Os services aplicam as regras de negócio e coordenam o cache; os repositories concentram as consultas ao PostgreSQL. Um tratador global transforma erros da aplicação em respostas JSON consistentes.

  O Redis acelera leituras de listas e detalhes, mas o PostgreSQL continua sendo a fonte de verdade. As chaves de cache incluem o escopo de acesso do usuário, e versões são incrementadas após alterações para tornar entradas antigas inacessíveis até expirarem.
technicalDecisions:
  - "Separei controllers, services e repositories para manter HTTP, regras de negócio e acesso a dados em camadas distintas."
  - "Usei consultas SQL parametrizadas para combinar filtros e paginação sem interpolar valores fornecidos pelo cliente."
  - "Tratei o Redis como cache opcional: falhas de leitura ou escrita não impedem as operações apoiadas pelo PostgreSQL."
  - "Reaproveitei esquemas Zod na validação de entradas e na geração da documentação OpenAPI."
challenges:
  - "Manter as respostas em cache coerentes após alterações em funcionários, considerando listas e registros individuais."
  - "Preservar o isolamento dos dados entre usuários comuns e administradores em consultas e chaves de cache."
testing: |
  A suíte usa Vitest e Supertest. Os testes unitários exercitam serviços com dependências simuladas; os testes de integração cobrem autenticação e endpoints de funcionários com um banco PostgreSQL de teste. A execução dos testes de integração exige esse banco configurado e com as migrações aplicadas.
demoExplanation: |
  A API foi feita para execução local, não como uma demonstração interativa no navegador. O repositório contém instruções para iniciar a aplicação com Docker Compose.
---

Desenvolvi esta API REST como projeto pessoal de estudo de engenharia backend. Ela permite administrar registros de funcionários com controle de acesso, pesquisa e estatísticas, reunindo em uma aplicação práticas de autenticação, persistência relacional, validação de dados, cache e testes. Implementei a lógica da aplicação e a integração entre suas camadas; o serviço foi pensado para execução local, sem uma implantação pública.
