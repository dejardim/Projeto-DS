import { useState, useId } from 'react';
import './AddItemModal.css';

interface Props {
  title: string;
  onClose: () => void;
  onSave: (name: string) => void;
  loading: boolean;
}

export function AddItemModal({ title, onClose, onSave, loading }: Props) {
  const id = useId();
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="add-item-modal-overlay">
      <div className="add-item-modal-content">
        <h2>{title}</h2>
        <div className="form-group">
          <label htmlFor={id + '-name'}>Nome</label>
          <input
            id={id + '-name'}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome..."
          />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
            Cancelar
          </button>
          <button type="button" onClick={handleSubmit} className="btn-save" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
