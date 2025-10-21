import { useState, useId } from 'react';
import type { Category } from '../types';
import './CreateAbstractModal.css';

interface BudgetsData {
  budgets: {
    revenue: { planned: number };
    expenses: { category: string; planned: number }[];
  };
}

interface Props {
  categories: Category[];
  onClose: () => void;
  onSave: (data: BudgetsData) => void;
}

export function CreateAbstractModal({ categories, onClose, onSave }: Props) {
  const id = useId();
  const [plannedRevenue, setPlannedRevenue] = useState(0);
  const [plannedExpenses, setPlannedExpenses] = useState<Record<string, number>>({});

  const handleExpenseChange = (categoryUid: string, value: string) => {
    const amount = Number(value) * 100; // Store in cents
    setPlannedExpenses((prev) => ({ ...prev, [categoryUid]: amount }));
  };

  const handleSubmit = () => {
    const expenses = Object.entries(plannedExpenses).map(([category, planned]) => ({
      category,
      planned,
    }));

    onSave({
      budgets: {
        revenue: { planned: plannedRevenue * 100 }, // Store in cents
        expenses,
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Novo Resumo Mensal</h2>
        <div className="form-group">
          <label htmlFor={id + '-plannedRevenue'}>Receita Planejada</label>
          <input
            id={id + '-plannedRevenue'}
            type="number"
            value={plannedRevenue}
            onChange={(e) => setPlannedRevenue(Number(e.target.value))}
          />
        </div>

        <h4>Despesas Planejadas</h4>
        <div className="expenses-list">
          {categories.map((cat) => (
            <div key={cat.uid} className="form-group-inline">
              <label htmlFor={id + `cat-${cat.uid}`}>{cat.name}</label>
              <input
                id={id + `cat-${cat.uid}`}
                type="number"
                placeholder="0"
                onChange={(e) => handleExpenseChange(cat.uid, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
          <button type="button" onClick={handleSubmit} className="btn-save">Salvar</button>
        </div>
      </div>
    </div>
  );
}
