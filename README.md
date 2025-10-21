# Projeto Desenvolvimento de Software

Sistema completo de gerenciamento financeiro pessoal desenvolvido com Node.js, React e TypeScript.

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm 10+

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/dejardim/Projeto-DS.git
cd Projeto-DS

# 2. Instala o Turbo para gerenciar o ambiente dev
npm install

# 3. Instala as dependências do servidor
npm install -w apps/server

# 4. Instala as dependências do frontend
npm install -w apps/web

# 5. Inicia o projeto completo
npm run dev
```

Acesse:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **API Docs**: http://localhost:8080/health

## 📁 Estrutura do Projeto

```
Projeto-DS/
├── apps/
│   ├── server/          # Backend API (Node.js + Express + Drizzle)
│   │   ├── src/
│   │   │   ├── resources/     # Módulos da API (auth, revenues, expenses, etc.)
│   │   │   ├── config/        # Configurações (DB, CORS, Logger)
│   │   │   ├── middleware/    # Middlewares (Auth, Error handling)
│   │   │   └── index.ts       # Entry point
│   │   └── README.md          # Documentação da API
│   └── web/             # Frontend (React + TypeScript + Vite)
│       ├── src/
│       │   ├── components/    # Componentes reutilizáveis
│       │   ├── pages/         # Páginas (Login, Dashboard)
│       │   ├── contexts/      # Context API (Auth)
│       │   ├── services/      # API calls (Axios)
│       │   └── types/         # TypeScript types
│       └── README.md          # Documentação do Frontend
├── turbo.json           # Configuração do Turbo (monorepo)
├── CONTRIBUTING.md      # Guia de contribuição
└── README.md           # Este arquivo
```

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro e login de usuários
- JWT tokens para sessões
- Middleware de autenticação

### 💰 Gestão Financeira
- **Receitas**: Criação, listagem, edição e exclusão
- **Despesas**: Gestão completa com categorias
- **Categorias**: Organização de despesas
- **Métodos de Pagamento**: Configuração de formas de pagamento

### 📊 Analytics e Relatórios
- **Abstracts Mensais**: Resumos financeiros por mês
- **Orçamentos**: Planejamento vs. realizado
- **Transações Recentes**: Histórico paginado
- **Análises**: Tendências, variações e projeções

### 🎨 Interface
- Design moderno e responsivo
- Dashboard intuitivo seguindo padrões UX
- PWA (Progressive Web App)
- Tema claro otimizado para produtividade

## 🛠️ Tecnologias

### Backend
- **Node.js** + **Express** - API REST
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **SQLite** - Database
- **JWT** - Autenticação
- **Helmet** + **CORS** - Segurança
- **Pino** - Logging estruturado

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **React Router** - Navegação
- **Axios** - HTTP client
- **Context API** - Estado global
- **CSS Modules** - Estilização

### DevOps
- **Turbo** - Monorepo management
- **Biome** - Linting e formatação
- **Drizzle Studio** - Database GUI

## 📚 Documentação

### API Endpoints

#### Autenticação
```
POST /spreadsheets/auth/signup    # Criar conta
POST /spreadsheets/auth/login     # Fazer login
```

#### Receitas
```
POST   /revenues                  # Criar receita
GET    /revenues                  # Listar receitas
GET    /revenues/:id              # Buscar receita
PUT    /revenues/:id              # Atualizar receita
DELETE /revenues/:id              # Deletar receita
```

#### Despesas
```
POST   /expenses                  # Criar despesa
GET    /expenses                  # Listar despesas
GET    /expenses/:id              # Buscar despesa
PUT    /expenses/:id              # Atualizar despesa
DELETE /expenses/:id              # Deletar despesa
```

#### Abstracts (Relatórios)
```
POST /spreadsheets/abstracts           # Criar abstract mensal
GET  /spreadsheets/abstracts/:m/:y     # Buscar abstract
PUT  /spreadsheets/abstracts/:id/notes # Atualizar notas
GET  /spreadsheets/transactions        # Transações recentes
```

### Schemas de Dados

Veja documentação completa em:
- [Backend README](./apps/server/README.md)
- [Frontend README](./apps/web/README.md)

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Inicia ambos os apps
```

### Backend Individual
```bash
cd apps/server
npm run dev              # Desenvolvimento
npm run build            # Build
npm run db:studio        # Database GUI
npm run db:migrate       # Migrações
```

### Frontend Individual
```bash
cd apps/web
npm run dev              # Desenvolvimento
npm run build            # Build
npm run preview          # Preview build
```

## 🌍 Configuração de Ambiente

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key"
NODE_ENV="development"
```

### Portas Padrão
- **Backend**: 8080
- **Frontend**: 5173
- **Drizzle Studio**: 4000

## 🤝 Contribuindo

1. Leia o [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Fork o projeto
3. Crie uma feature branch
4. Faça suas alterações
5. Teste localmente com `npm run dev`
6. Abra um Pull Request

## 📝 Regras de Negócio

- Usuários têm spreadsheets únicos
- Abstracts são mensais e únicos por mês/ano
- Receitas e despesas são vinculadas a abstracts
- Categorias e métodos de pagamento são por usuário
- Valores em centavos para precisão
- Soft delete para auditoria

## 🐛 Troubleshooting

### Problemas Comuns
```bash
# Limpar dependências
rm -rf node_modules apps/*/node_modules
npm install && npm install -w apps/server && npm install -w apps/web

# Resetar banco de dados
rm apps/server/dev.db
npm run dev

# Verificar portas ocupadas
lsof -ti:8080 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

## 📄 Licença

ISC License - veja [LICENSE](LICENSE) para detalhes.
