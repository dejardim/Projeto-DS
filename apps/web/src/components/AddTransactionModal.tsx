import { useState, useId } from 'react';
import type { Category, PaymentOption } from '../types';
import './CreateAbstractModal.css'; // Reusing styles

interface TransactionPayload {
  type: 'revenue' | 'expense';
  description: string;
  amount: number;
  year: number;
  month: number;
  date: number;
  paymentOption?: string;
  category?: string;
  fixed?: boolean;
}

interface Props {
  categories: Category[];
  paymentOptions: PaymentOption[];
  onClose: () => void;
  onSave: (data: TransactionPayload) => void;
  loading: boolean;
}

export function AddTransactionModal({ categories, paymentOptions, onClose, onSave, loading }: Props) {
  const id = useId();
  const [type, setType] = useState<'revenue' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<string | undefined>(categories[0]?.uid);
  const [paymentOptionId, setPaymentOptionId] = useState<string | undefined>(paymentOptions[0]?.uid);
  const [fixed, setFixed] = useState(false);

  const handleSubmit = () => {
    const [year, month, day] = date.split('-').map(Number);
    const payload = {
      type,
      description,
      amount: Number(amount) * 100, // in cents
      year,
      month,
      date: day,
      paymentOption: paymentOptionId,
      category: type === 'expense' ? categoryId : undefined,
      fixed: type === 'expense' ? fixed : undefined,
    };
    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Transação</h2>
        <div className="tabs">
          <button type="button" onClick={() => setType('expense')} className={type === 'expense' ? 'active' : ''}>Despesa</button>
          <button type="button" onClick={() => setType('revenue')} className={type === 'revenue' ? 'active' : ''}>Receita</button>
        </div>

        <div className="form-group">
          <label htmlFor={id + '-desc'}>Descrição</label>
          <input id={id + '-desc'} type="text" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor={id + '-amount'}>Valor</label>
          <input id={id + '-amount'} type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor={id + '-date'}>Data</label>
          <input id={id + '-date'} type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        

        <div className="form-group">
          <label htmlFor={id + '-pay'}>{type === 'expense' ? 'Debitado em:' : 'Creditado em:'}</label>
          <select id={id + '-pay'} value={paymentOptionId} onChange={e => setPaymentOptionId(e.target.value)}>
            <option value="" disabled>Opção de pagamento</option>
            {paymentOptions.map(opt => <option key={opt.uid} value={opt.uid}>{opt.name}</option>)}
          </select>
        </div>

        {type === 'expense' && (
          <>
            <div className="form-group">
              <label htmlFor={id + '-cat'}>Categoria</label>
              <select id={id + '-cat'} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                {categories.map(cat => <option key={cat.uid} value={cat.uid}>{cat.name}</option>)}
              </select>
            </div>
            <div className="form-group-inline checkbox-group">
              <label htmlFor={id + '-fixed'}>É uma despesa fixa?</label>
              <input id={id + '-fixed'} type="checkbox" checked={fixed} onChange={e => setFixed(e.target.checked)} />
            </div>
          </>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Cancelar</button>
          <button type="button" onClick={handleSubmit} className="btn-save" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
