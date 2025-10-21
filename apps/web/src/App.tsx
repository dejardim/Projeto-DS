import { type ReactNode, useId } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AbstractView } from './pages/AbstractView';
import PWABadge from './PWABadge';
import './App.css';
import logo from '/imagens/logo_numo.webp';
import { Settings } from 'lucide-react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route 
        path="/" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route 
        path="/abstracts/:month/:year"
        element={<ProtectedRoute><AbstractView /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Header() {
  const { user, logout } = useAuth();
  // const id = useId();

  if (!user) {
    return null;
  }

  return (
    <header className="main-header">
      <div className="header-container">
      <img src={logo} alt="Numo Logo" className="logo-img" />
      {/* <div className="nav-buttons">
        <button id={id + '-btn-dashboard'} type="button" className="nav-btn active">Dashboard</button>
        <button id={id + '-btn-chat'} type="button" className="nav-btn">Chat</button>
      </div> */}
      <div className="user-controls">
        <Settings className="settings-icon" />
        <span className="user-name">{user.name}</span>
        <button onClick={logout} type="button" className="user-avatar" style={{ background: 'var(--gold)', color: 'var(--green)', border: 'none', cursor: 'pointer' }}>
          {user.name.charAt(0).toUpperCase()}
        </button>
      </div>
      </div>
    </header>
  );
}

function App() {
  const id = useId();
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main id={id + '-screens'}>
            <AppRoutes />
          </main>
          <PWABadge />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
