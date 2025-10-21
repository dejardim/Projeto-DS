/** biome-ignore-all lint/a11y/useButtonType: Using buttons for actions, not form submission */
import { type FC, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { spreadsheetsAPI, categoriesAPI, paymentOptionsAPI, revenuesAPI, expensesAPI } from '../services/api';
import type { TransactionsResponse, Category, PaymentOption, Abstract } from '../types';
import { Link } from 'react-router-dom';
import { Plus, FileText, Settings } from 'lucide-react';
import { CreateAbstractModal } from '../components/CreateAbstractModal';
import { AddItemModal } from '../components/AddItemModal';
import { AddTransactionModal } from '../components/AddTransactionModal';
import './Dashboard.css';

const Dashboard: FC = () => {
  useAuth();
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [abstracts, setAbstracts] = useState<Abstract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatabase, setShowDatabase] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
  const [addItemType, setAddItemType] = useState<'category' | 'paymentOption' | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isSavingTransaction, setIsSavingTransaction] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // biome-ignore lint/correctness/useExhaustiveDependencies: `loadData` is stable and should only run once on mount.
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsRes, categoriesRes, paymentOptionsRes, abstractsRes] = await Promise.all([
        spreadsheetsAPI.getTransactions(),
        categoriesAPI.getAll(),
        paymentOptionsAPI.getAll(),
        spreadsheetsAPI.getAllAbstracts(),
      ]);

      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
      setPaymentOptions(paymentOptionsRes.data);
      setAbstracts(abstractsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100); // Assumindo que valores estão em centavos
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  
  const handleSaveAbstract = async (budgetsData: { budgets: { revenue: { planned: number }, expenses: { category: string, planned: number }[] } }) => {
    try {
      const now = new Date();
      const mount = now.getMonth() + 1;
      const year = now.getFullYear();
      const name = new Date(year, mount - 1).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      });

      const payload = {
        name,
        mount,
        year,
        budgets: budgetsData.budgets,
      };

      await spreadsheetsAPI.createAbstract(payload);
      setCreateModalOpen(false);
      setFeedback({ message: 'Resumo criado com sucesso!', type: 'success' });
      // TODO: Recarregar dados ou adicionar o novo resumo à lista na UI
    } catch (error) {
      setFeedback({ message: 'Erro ao criar resumo. Talvez já exista um para este mês.', type: 'error' });
      console.error('Erro ao criar resumo:', error);
    }
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const openAddItemModal = (type: 'category' | 'paymentOption') => {
    setAddItemType(type);
    setAddItemModalOpen(true);
  };

  const handleSaveItem = async (name: string) => {
    if (!addItemType) return;

    setIsSavingItem(true);
    try {
      if (addItemType === 'category') {
        await categoriesAPI.create({ name });
        setFeedback({ message: 'Categoria adicionada!', type: 'success' });
      } else {
        await paymentOptionsAPI.create({ name });
        setFeedback({ message: 'Opção de pagamento adicionada!', type: 'success' });
      }
      loadData(); // Recarrega os dados para exibir o novo item
      setAddItemModalOpen(false);
    } catch (error) {
      setFeedback({ message: 'Erro ao salvar item.', type: 'error' });
      console.error(`Erro ao salvar ${addItemType}:`, error);
    }
    finally {
      setIsSavingItem(false);
      setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
    }
  };

  const handleSaveTransaction = async (data: { type: 'revenue' | 'expense'; description: string; amount: number; year: number; month: number; date: number; paymentOption?: string; category?: string; fixed?: boolean; }) => {
    setIsSavingTransaction(true);
    try {
      if (data.type === 'revenue') {
        await revenuesAPI.create({
          description: data.description,
          amount: data.amount,
          year: data.year,
          month: data.month,
          date: data.date,
          paymentOption: data.paymentOption,
        });
        setFeedback({ message: 'Receita adicionada!', type: 'success' });
      } else {
        await expensesAPI.create({
          description: data.description,
          amount: data.amount,
          year: data.year,
          month: data.month,
          date: data.date,
          paymentOption: data.paymentOption,
          category: data.category,
          fixed: data.fixed ?? false,
        });
        setFeedback({ message: 'Despesa adicionada!', type: 'success' });
      }
      loadData();
      setTransactionModalOpen(false);
    } catch (error) {
      setFeedback({ message: 'Erro ao adicionar transação.', type: 'error' });
      console.error('Erro ao salvar transação:', error);
    }
    finally {
      setIsSavingTransaction(false);
      setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      {feedback.message && (
        <div className={`feedback-toast ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Resumos Section */}
        <section className="section">
          <div className="section-header">
            <h3>Resumos</h3>
          </div>
          <div className="cards-grid">
            <button className="summary-card add-card" onClick={() => setCreateModalOpen(true)}>
              <Plus size={32} />
            </button>
            {abstracts.map(abs => (
              <Link to={`/abstracts/${abs.mount}/${abs.year}`} key={abs.uid} className="summary-card">
                <FileText size={24} />
                <span>{abs.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Base de dados Section */}
        <section className="section">
          <div className="section-header">
            <h3>Base de dados</h3>
            <div className="section-actions">
              <button className="add-button" onClick={() => setTransactionModalOpen(true)}>
                <Plus size={20} />
              </button>
              <button className="add-button" onClick={() => setShowDatabase(!showDatabase)}>
                <Settings size={20} />
              </button>
            </div>
          </div>

          {showDatabase && (
            <div className="database-cards-container">
              <div className="database-card">
                <div className="database-card-header">
                  <h4>Categorias</h4>
                  <button onClick={() => openAddItemModal('category')} className="add-icon-button"><Plus size={16} /></button>
                </div>
                <div className="database-card-list">
                  {categories.map((category) => (
                    <div key={category.uid} className="database-item">
                      <div className="item-icon"><FileText size={20} /></div>
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="database-card">
                <div className="database-card-header">
                  <h4>Opções de Pagamento</h4>
                  <button onClick={() => openAddItemModal('paymentOption')} className="add-icon-button"><Plus size={16} /></button>
                </div>
                <div className="database-card-list">
                  {paymentOptions.map((option) => (
                    <div key={option.uid} className="database-item">
                      <div className="item-icon payment-icon">💳</div>
                      <span>{option.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Recent Transactions Section */}
        <section className="section">
          {/* <div className="section-header">
            <h3>Transações Recentes</h3>
          </div> */}
          <div className="database-list recent-transactions-list">
            {transactions?.transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.uid} className="database-item transaction-item">
                <div className="item-icon">
                  {transaction.type === 'revenue' ? '💰' : '💸'}
                </div>
                <div className="transaction-info">
                  <span className="transaction-description">{transaction.description}</span>
                </div>
                <span className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                <span className="transaction-date">{formatDate(transaction.createdAt)}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {isCreateModalOpen && (
        <CreateAbstractModal
          categories={categories}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleSaveAbstract}
        />
      )}

      {isAddItemModalOpen && addItemType && (
        <AddItemModal
          title={`Adicionar ${addItemType === 'category' ? 'Categoria' : 'Opção de Pagamento'}`}
          loading={isSavingItem}
          onClose={() => setAddItemModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}

      {isTransactionModalOpen && (
        <AddTransactionModal
          categories={categories}
          paymentOptions={paymentOptions}
          loading={isSavingTransaction}
          onClose={() => setTransactionModalOpen(false)}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  );
};

export default Dashboard;
