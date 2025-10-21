import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { spreadsheetsAPI, revenuesAPI, expensesAPI, paymentOptionsAPI } from '../services/api';
import type { AbstractWithAnalytics, Revenue, Expense, PaymentOption } from '../types';
import { RevenueBreakdown } from '../components/RevenueBreakdown';
import { ExpenseBreakdown } from '../components/ExpenseBreakdown';
import './AbstractView.css';

export function AbstractView() {
  const { month, year } = useParams<{ month: string; year: string }>();
  const [abstractData, setAbstractData] = useState<AbstractWithAnalytics | null>(null);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (month && year) {
      Promise.all([
        spreadsheetsAPI.getAbstract(Number(month), Number(year)),
        revenuesAPI.getAll(Number(month), Number(year)),
        expensesAPI.getAll(Number(month), Number(year)),
        paymentOptionsAPI.getAll(),
      ]).then(([abstractRes, revenuesRes, expensesRes, paymentOptionsRes]) => {
        setAbstractData(abstractRes.data);
        setRevenues(revenuesRes.data);
        setExpenses(expensesRes.data);
        setPaymentOptions(paymentOptionsRes.data);
        setLoading(false);
      }).catch(err => {
        console.error('Erro ao buscar dados do resumo:', err);
        setError('Não foi possível carregar os dados do resumo.');
        setLoading(false);
      });
    }
  }, [month, year]);

  if (loading) {
    return <div className="loading">Carregando resumo...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!abstractData) {
    return <div className="error-message">Resumo não encontrado.</div>;
  }

  return (
    <div className="abstract-view">
      <header className="abstract-header">
        <h1>{abstractData.abstract.name}</h1>
        <Link to="/" className="back-link">Voltar ao Dashboard</Link>
      </header>
      {/* O conteúdo da planilha virá aqui */}
      <div className="spreadsheet-container">
        <RevenueBreakdown 
          planned={abstractData.abstract.budgets.revenue.planned}
          revenues={revenues}
          paymentOptions={paymentOptions}
        />
        <ExpenseBreakdown 
          planned={abstractData.abstract.budgets.expenses}
          expenses={expenses}
          paymentOptions={paymentOptions}
        />
      </div>
    </div>
  );
}
