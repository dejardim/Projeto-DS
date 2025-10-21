import { useState, useMemo } from 'react';
import type { Revenue, PaymentOption } from '../types';
import './Breakdown.css';

interface Props {
  planned: number;
  revenues: Revenue[];
  paymentOptions: PaymentOption[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount / 100);
};

const formatDate = (date: number, month: number, year: number) => {
  return new Date(year, month - 1, date).toLocaleDateString('pt-BR');
};

export function RevenueBreakdown({ planned, revenues, paymentOptions }: Props) {
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredRevenues = useMemo(() => {
    return revenues
      .filter(r => paymentFilter === 'all' || r.paymentOption?.uid === paymentFilter)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [revenues, paymentFilter]);

  const totalLaunched = revenues.reduce((sum, r) => sum + r.amount, 0);
  const filteredTotal = filteredRevenues.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="breakdown-card">
      <h3>Receitas</h3>
      <div className="breakdown-table">
        <div className="breakdown-header">
          <div>Planejado</div>
          <div>Lançado</div>
          <div>Diferença</div>
        </div>
        <div className="breakdown-row planned-row">
          <div>{formatCurrency(planned)}</div>
          <div>{formatCurrency(totalLaunched)}</div>
          <div className={totalLaunched - planned >= 0 ? 'positive' : 'negative'}>
            {formatCurrency(totalLaunched - planned)}
          </div>
        </div>

        <div className="filters-section">
          <h4>Filtros</h4>
          <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
            <option value="all">Todas as formas de pagamento</option>
            {paymentOptions.map(opt => <option key={opt.uid} value={opt.uid}>{opt.name}</option>)}
          </select>
        </div>

        <div className="transactions-title">Lançamentos</div>
        {filteredRevenues.map(r => (
          <div key={r.uid} className="transaction-item">
            <span className="transaction-date">{formatDate(r.date, r.month, r.year)}</span>
            <span className="transaction-payment">Creditado em: {r.paymentOption?.name || 'N/A'}</span>
            <span className="transaction-desc">{r.description}</span>
            <div className="transaction-summary">
              <span className="transaction-amount positive">+{formatCurrency(r.amount)}</span>
            </div>
          </div>
        ))}
        {filteredRevenues.length > 0 && (
          <div className="breakdown-row filtered-total-row">
            <span>Total</span>
            <span className="positive">+{formatCurrency(filteredTotal)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
