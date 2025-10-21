# Personal Finance API

API backend para gerenciamento de planilhas financeiras pessoais com funcionalidades de orçamento, receitas, despesas e análises.

## Estrutura do Sistema

### Conceitos Principais

- **Spreadsheets**: Contas de usuário (equivalente a users)
- **Abstracts**: Visualizações mensais com orçamentos e análises
- **Revenues**: Receitas do mês
- **Expenses**: Despesas do mês
- **Categories**: Categorias de despesas configuráveis
- **Payment Options**: Métodos de pagamento configuráveis

## Endpoints da API

### Autenticação

```
POST /spreadsheets/auth/signup
POST /spreadsheets/auth/login
```

### Abstracts (Visualizações Mensais)

```
POST /spreadsheets/abstracts
GET /spreadsheets/abstracts/:month/:year
PUT /spreadsheets/abstracts/:abstractUid/notes
```

### Receitas

```
POST /revenues
GET /revenues?month=1&year=2024
GET /revenues/:revenueUid
PUT /revenues/:revenueUid
DELETE /revenues/:revenueUid
```

### Despesas

```
POST /expenses
GET /expenses?month=1&year=2024&category=categoryUid
GET /expenses/category/:category
GET /expenses/:expenseUid
PUT /expenses/:expenseUid
DELETE /expenses/:expenseUid
```

### Categorias de Despesas

```
POST /categories
GET /categories
GET /categories/:categoryUid
PUT /categories/:categoryUid
DELETE /categories/:categoryUid
```

### Opções de Pagamento

```
POST /payment-options
GET /payment-options
GET /payment-options/:paymentOptionUid
PUT /payment-options/:paymentOptionUid
DELETE /payment-options/:paymentOptionUid
```

## Schemas de Dados

### Abstract Budget Schema

```typescript
interface BudgetSchema {
  revenue: {
    planned: number;
  };
  expenses: Array<{
    category: string;
    planned: number;
  }>;
}
```

### Analytics Response

```typescript
interface AnalyticsResponse {
  abstract: Abstract;
  analytics: {
    actual: {
      revenue: number;
      expenses: number;
      balance: number;
    };
    planned: {
      revenue: number;
      expenses: number;
    };
    variance: {
      revenue: number;
      expenses: number;
    };
    trends: {
      revenue: 'up' | 'down' | 'stable';
      expenses: 'up' | 'down' | 'stable';
    };
    projections: {
      revenue: number;
      expenses: number;
    };
  };
}
```

## Funcionalidades Implementadas

### ✅ Autenticação
- Signup/Login com JWT
- Middleware de autenticação
- Hash de senhas com bcrypt

### ✅ Gestão de Abstracts
- Criação de visualizações mensais (sem duplicatas)
- Cálculo de real vs orçado
- Projeções baseadas no mês atual
- Tendências comparando com mês anterior
- Sistema de anotações/notes

### ✅ CRUD Completo
- Revenues com filtros por mês/ano
- Expenses com filtros por mês/ano/categoria
- Categories configuráveis por spreadsheet
- Payment Options configuráveis por spreadsheet

### ✅ Analytics Avançados
- Comparação real vs planejado
- Cálculo de variância
- Tendências (up/down/stable) com threshold de 5%
- Projeções anuais baseadas no progresso atual

## Variáveis de Ambiente

```env
DATABASE_URL=file:local.db
DATABASE_AUTH_TOKEN=optional_for_remote_db
JWT_SECRET=your_jwt_secret_here
```

## Estrutura de Arquivos

```
src/
├── database/
│   ├── connection.ts
│   └── schema.ts
├── middleware/
│   └── auth.ts
├── resources/
│   ├── spreadsheets/
│   ├── revenues/
│   ├── expenses/
│   ├── categories/
│   └── payment-options/
└── routes.ts
```

## Como Usar

1. **Criar conta**: `POST /spreadsheets/auth/signup`
2. **Fazer login**: `POST /spreadsheets/auth/login`
3. **Configurar categorias**: `POST /categories`
4. **Configurar métodos de pagamento**: `POST /payment-options`
5. **Criar abstract mensal**: `POST /spreadsheets/abstracts`
6. **Adicionar receitas/despesas**: `POST /revenues` e `POST /expenses`
7. **Ver analytics**: `GET /spreadsheets/abstracts/:month/:year`

## Regras de Negócio

- Não é possível criar abstracts duplicados para o mesmo mês/ano
- Todas as operações são isoladas por spreadsheet (usuário)
- Soft delete em todas as entidades
- Cálculos de tendência usam threshold de 5%
- Projeções são calculadas com base no progresso atual do ano
