# Contributing to Projeto Desenvolvimento de Software

Obrigado por contribuir com o projeto de gerenciamento financeiro pessoal! Este guia ajudará você a configurar o ambiente de desenvolvimento e entender o fluxo de trabalho.

## 📋 Pré-requisitos

- **Node.js** 22+ 
- **npm** 10+
- **Git**

## 🚀 Configuração do Ambiente

### 1. Clone o Repositório
```bash
git clone https://github.com/dejardim/Projeto-DS.git
cd Projeto-DS
```

### 2. Instalação das Dependências

O projeto usa **Turbo** como gerenciador de monorepo. Execute os comandos na seguinte ordem:

```bash
# 1. Instala o Turbo para gerenciar o ambiente dev
npm install

# 2. Instala as dependências do servidor
npm install -w apps/server

# 3. Instala as dependências do frontend
npm install -w apps/web
```

### 3. Executar o Projeto

```bash
# Inicia tanto o servidor quanto o frontend simultaneamente
npm run dev
```

Isso iniciará:
- **Backend**: `http://localhost:8080`
- **Frontend**: `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
Projeto-DS/
├── apps/
│   ├── server/          # Backend (Node.js + Express + Drizzle)
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── web/             # Frontend (React + TypeScript + Vite)
│       ├── src/
│       ├── package.json
│       └── README.md
├── package.json         # Configuração do monorepo
├── turbo.json          # Configuração do Turbo
└── README.md
```

## 🔧 Scripts Disponíveis

### Raiz do Projeto
```bash
npm run dev              # Inicia ambos os apps em modo desenvolvimento
```

### Backend (`apps/server`)
```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm run start            # Executa versão buildada
npm run db:migrate       # Executa migrações do banco
npm run db:studio        # Abre Drizzle Studio
```

### Frontend (`apps/web`)
```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm run preview          # Preview da versão buildada
```

## 🗄️ Banco de Dados

O projeto usa **SQLite** com **Drizzle ORM**:

1. **Configuração**: Arquivo `.env` no backend
2. **Migrações**: Automáticas no primeiro run
3. **Studio**: `npm run db:studio` para interface visual

### Variáveis de Ambiente

Crie `.env` em `apps/server/`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

## 📚 Tecnologias

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Drizzle ORM** + **SQLite**
- **JWT** para autenticação
- **Helmet** + **CORS** para segurança

### Frontend
- **React 19** + **TypeScript**
- **Vite** como bundler
- **React Router** para navegação
- **Axios** para requisições
- **Context API** para estado global

## 🔄 Fluxo de Desenvolvimento

### 1. Criar Feature Branch
```bash
git checkout -b feature/nome-da-feature
```

### 2. Fazer Alterações
- Backend: Modificar arquivos em `apps/server/src/`
- Frontend: Modificar arquivos em `apps/web/src/`

### 3. Testar
```bash
npm run dev  # Testa ambos os apps
```

### 4. Commit e Push
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nome-da-feature
```

### 5. Criar Pull Request
- Descreva as mudanças
- Inclua screenshots se necessário
- Aguarde review

## 🐛 Debugging

### Backend
- Logs aparecem no terminal do servidor
- Use `console.log()` ou debugger do VS Code
- Drizzle Studio para visualizar dados

### Frontend
- DevTools do browser
- React DevTools extension
- Network tab para requisições

## 📝 Convenções de Código

### Commits
Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
```

### Código
- **TypeScript** obrigatório
- **ESLint** + **Biome** para linting
- **Prettier** para formatação
- Nomes em **camelCase** (JS/TS) e **kebab-case** (arquivos)

## 🚨 Problemas Comuns

### Erro de Porta
Se a porta estiver ocupada:
```bash
# Matar processo na porta 8080
lsof -ti:8080 | xargs kill -9

# Matar processo na porta 5173
lsof -ti:5173 | xargs kill -9
```

### Dependências Desatualizadas
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules apps/*/node_modules
npm install
npm install -w apps/server
npm install -w apps/web
```

### Banco de Dados
```bash
# Resetar banco (cuidado em produção!)
rm apps/server/dev.db
npm run dev  # Recria automaticamente
```
