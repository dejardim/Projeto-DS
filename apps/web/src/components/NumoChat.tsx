import { useState, useId } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { numoChatAPI } from '../services/api';
import './NumoChat.css';

interface NumoChatResponse {
  success: boolean;
  message: string;
  data?: {
    type: 'revenue' | 'expense';
    description: string;
    amount: number;
    category?: string;
    paymentOption?: string;
    date: string;
  };
}

export function NumoChat() {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<NumoChatResponse | null>(null);

  const handleSubmit = async () => {
    if (!command.trim() || loading) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await numoChatAPI.processCommand(command);
      setResponse(res.data);
      if (res.data.success) {
        setCommand('');
      }
    } catch (error) {
      setResponse({
        success: false,
        message: 'Erro ao processar comando. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Botao Flutuante */}
      <button
        type="button"
        className="numochat-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir NumoChat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Tela de Chat Full-Screen */}
      {isOpen && (
        <div className="numochat-overlay">
          <div className="numochat-container">
            {/* Header */}
            <header className="numochat-header">
              <h2>NumoChat</h2>
              <button
                type="button"
                className="numochat-close"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar NumoChat"
              >
                <X size={24} />
              </button>
            </header>

            {/* Conteudo */}
            <main className="numochat-content">
              <div className="numochat-instructions">
                <p>Diga o que deseja adicionar. Exemplos:</p>
                <ul>
                  <li>"Adiciona despesa de 50 reais em alimentacao"</li>
                  <li>"Receita de 1500 reais de salario"</li>
                  <li>"Gastei 30 reais em transporte no pix"</li>
                </ul>
              </div>

              {/* Area de Resposta */}
              {response && (
                <div className={`numochat-response ${response.success ? 'success' : 'error'}`}>
                  <p>{response.message}</p>
                  {response.data && (
                    <div className="numochat-response-data">
                      <p><strong>Tipo:</strong> {response.data.type === 'revenue' ? 'Receita' : 'Despesa'}</p>
                      <p><strong>Descricao:</strong> {response.data.description}</p>
                      <p><strong>Valor:</strong> R$ {(response.data.amount / 100).toFixed(2)}</p>
                      {response.data.category && <p><strong>Categoria:</strong> {response.data.category}</p>}
                      {response.data.paymentOption && <p><strong>Pagamento:</strong> {response.data.paymentOption}</p>}
                    </div>
                  )}
                </div>
              )}
            </main>

            {/* Input Area */}
            <footer className="numochat-footer">
              <div className="numochat-input-wrapper">
                <textarea
                  id={id + '-command'}
                  className="numochat-input"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite seu comando..."
                  rows={1}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="numochat-send"
                  onClick={handleSubmit}
                  disabled={loading || !command.trim()}
                  aria-label="Enviar comando"
                >
                  {loading ? <Loader2 size={20} className="spinner" /> : <Send size={20} />}
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
