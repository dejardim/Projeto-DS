import { useState, useMemo } from 'react';
import type { Expense, PaymentOption } from '../types';
import './Breakdown.css';

interface PlannedExpense {
  category: string;
  planned: number;
}

interface Props {
  planned: PlannedExpense[];
  expenses: Expense[];
  paymentOptions: PaymentOption[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount / 100);
};

const formatDate = (date: number, month: number, year: number) => {
  return new Date(year, month - 1, date).toLocaleDateString('pt-BR');
};

function CategoryBreakdown({ categoryName, transactions, plannedAmount, paymentOptions }: {
  categoryName: string;
  transactions: Expense[];
  plannedAmount: number;
  paymentOptions: PaymentOption[];
}) {
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [fixedFilter, setFixedFilter] = useState<string>('all'); // 'all', 'fixed', 'variable'

  const filteredExpenses = useMemo(() => {
    return transactions
      .filter(t => {
        const paymentMatch = paymentFilter === 'all' || t.paymentOption?.uid === paymentFilter;
        const fixedMatch = fixedFilter === 'all' || (fixedFilter === 'fixed' ? t.fixed : !t.fixed);
        return paymentMatch && fixedMatch;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [transactions, paymentFilter, fixedFilter]);

  const totalLaunched = transactions.reduce((sum, t) => sum + t.amount, 0);
  const filteredTotal = filteredExpenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="category-section">
      <h4>{categoryName}</h4>
      <div className="breakdown-table">
        <div className="breakdown-header">
          <div>Planejado</div>
          <div>Lançado</div>
          <div>Diferença</div>
        </div>
        <div className="breakdown-row planned-row">
          <div>{formatCurrency(plannedAmount)}</div>
          <div>{formatCurrency(totalLaunched)}</div>
          <div className={plannedAmount - totalLaunched >= 0 ? 'positive' : 'negative'}>
            {formatCurrency(plannedAmount - totalLaunched)}
          </div>
        </div>

        <div className="filters-section">
          <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
            <option value="all">Todas as formas de pagamento</option>
            {paymentOptions.map(opt => <option key={opt.uid} value={opt.uid}>{opt.name}</option>)}
          </select>
          <select value={fixedFilter} onChange={e => setFixedFilter(e.target.value)}>
            <option value="all">Todas as despesas</option>
            <option value="fixed">Fixas</option>
            <option value="variable">Variáveis</option>
          </select>
        </div>

        <div className="transactions-title">Lançamentos</div>
        {filteredExpenses.map(t => (
          <div key={t.uid} className="transaction-item">
            <span className="transaction-date">{formatDate(t.date, t.month, t.year)}</span>
            <span className="transaction-payment">Debitado em: {t.paymentOption?.name || 'N/A'}</span>
            <span className="transaction-desc">{t.description}</span>
            <div className="transaction-summary">
              <span className={`badge ${t.fixed ? 'fixed' : 'variable'}`}>{t.fixed ? 'Fixo' : 'Variável'}</span>
              <span className="transaction-amount negative">-{formatCurrency(t.amount)}</span>
            </div>
          </div>
        ))}
        {filteredExpenses.length > 0 && (
          <div className="breakdown-row filtered-total-row">
            <span>Total</span>
            <span className="negative">-{formatCurrency(filteredTotal)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExpenseBreakdown({ planned, expenses, paymentOptions }: Props) {
  const expensesByCategory = useMemo(() => expenses.reduce((acc, exp) => {
    const categoryName = exp.category?.name ?? 'Sem Categoria';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(exp);
    return acc;
  }, {} as Record<string, Expense[]>), [expenses]);

  return (
    <div className="breakdown-card">
      <h3>Despesas</h3>
      {Object.entries(expensesByCategory).map(([categoryName, transactions]) => {
        const plannedAmount = planned.find(p => p.category === transactions[0]?.category?.uid)?.planned ?? 0;
        return (
          <CategoryBreakdown
            key={categoryName}
            categoryName={categoryName}
            transactions={transactions}
            plannedAmount={plannedAmount}
            paymentOptions={paymentOptions}
          />
        );
      })}
    </div>
  );
}
