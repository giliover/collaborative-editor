# Frontend:

- Interface do Editor: deve ter uma interface amigável usando um framework JavaScript moderno (React, Vue.js ou Angular).

- Renderização de Markdown: deve renderizar o Markdown em tempo real para pré-visualizar o documento enquanto é editado.

- Colaboração de Usuários: deve mostrar a presença de vários usuários editando o documento e destacar a seção de texto que está sendo editada por cada usuário.

- Histórico do Documento: deve mostrar histórico simples do documento com a capacidade de desfazer/refazer alterações.

- [Acessar documento](./frontend/README.md)

# Backend:

- Integração com WebSocket: deve ter comunicação em tempo real usando WebSockets (ex.: Socket.IO) para gerenciar a edição colaborativa.

- Gerenciamento de Usuários: deve ter autenticação básica de usuários (nome de usuário/e-mail e senha).

- Integração com Banco de Dados: deve armazenar os dados do documento e as informações dos usuários em um banco de dados (ex.: MongoDB, PostgreSQL).

- Controle de Versão: deve ter versionamento do documento, permitindo que os usuários revertam para versões anteriores.

- [Acessar documento](./backend/README.md)

# Testes:

- Testes unitários para os componentes de frontend e backend, garantindo funcionalidade e confiabilidade.

- Criar testes de integração para simular múltiplos usuários editando o mesmo documento simultaneamente.
