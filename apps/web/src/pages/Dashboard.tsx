/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { spreadsheetsAPI, categoriesAPI, paymentOptionsAPI } from '../services/api';
import { TransactionsResponse, Category, PaymentOption } from '../types';
import { Plus, FileText, Calendar, LogOut, MoreHorizontal } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsRes, categoriesRes, paymentOptionsRes] = await Promise.all([
        spreadsheetsAPI.getTransactions(),
        categoriesAPI.getAll(),
        paymentOptionsAPI.getAll(),
      ]);

      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
      setPaymentOptions(paymentOptionsRes.data);
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

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{user?.name}</h2>
              <p>@{user?.username}</p>
            </div>
          </div>
          <button onClick={logout} className="logout-button">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Resumos Section */}
        <section className="section">
          <div className="section-header">
            <h3>Resumos</h3>
            <button className="more-button">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="cards-grid">
            <div className="summary-card add-card">
              <Plus size={32} />
            </div>
            
            <div className="summary-card">
              <FileText size={24} />
              <span>Novo Abstract</span>
            </div>
            
            <div className="summary-card">
              <Calendar size={24} />
              <span>Relatório Mensal</span>
            </div>
          </div>
        </section>

        {/* Base de dados Section */}
        <section className="section">
          <div className="section-header">
            <h3>Base de dados</h3>
            <div className="section-actions">
              <button className="more-button">
                <MoreHorizontal size={20} />
              </button>
              <button className="add-button">
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="database-list">
            {/* Categories */}
            {categories.map((category) => (
              <div key={category.uid} className="database-item">
                <div className="item-icon">
                  <FileText size={20} />
                </div>
                <span>{category.name}</span>
              </div>
            ))}

            {/* Payment Options */}
            {paymentOptions.map((option) => (
              <div key={option.uid} className="database-item">
                <div className="item-icon payment-icon">
                  💳
                </div>
                <span>{option.name}</span>
              </div>
            ))}

            {/* Recent Transactions */}
            {transactions?.transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.uid} className="database-item transaction-item">
                <div className={`item-icon ${transaction.type === 'revenue' ? 'revenue-icon' : 'expense-icon'}`}>
                  {transaction.type === 'revenue' ? '💰' : '💸'}
                </div>
                <div className="transaction-info">
                  <span className="transaction-description">{transaction.description}</span>
                  <span className="transaction-amount">
                    {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <span className="transaction-date">{formatDate(transaction.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        {transactions && (
          <section className="section">
            <div className="section-header">
              <h3>Transações Recentes</h3>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total de Transações</h4>
                <p>{transactions.transactions.length}</p>
              </div>
              
              <div className="stat-card">
                <h4>Receitas</h4>
                <p>{transactions.transactions.filter(t => t.type === 'revenue').length}</p>
              </div>
              
              <div className="stat-card">
                <h4>Despesas</h4>
                <p>{transactions.transactions.filter(t => t.type === 'expense').length}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
