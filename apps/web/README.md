# Personal Finance Web App

Frontend React para o sistema de gerenciamento financeiro pessoal.

## Funcionalidades

### ✅ Implementadas
- **Autenticação**: Login e cadastro de usuários
- **Dashboard**: Interface principal seguindo o design fornecido
- **Conexão com API**: Integração completa com o backend
- **Transações**: Visualização de receitas e despesas recentes
- **Categorias**: Listagem de categorias de despesas
- **Métodos de Pagamento**: Listagem de opções de pagamento
- **Design Responsivo**: Interface adaptável para mobile

### 🔄 Estrutura
```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React (Auth)
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Página de login/cadastro
│   └── Dashboard.tsx   # Dashboard principal
├── services/           # Serviços de API
│   └── api.ts          # Configuração do Axios
├── types/              # Tipos TypeScript
└── App.tsx             # Componente principal
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
