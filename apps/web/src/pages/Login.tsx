/** biome-ignore-all lint/correctness/useUniqueElementIds: IDs are unique within this component's scope */
/** biome-ignore-all lint/a11y/useButtonType: O botão de alternância não submete o formulário. */

import { type FC, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';
import logo from '/imagens/logo_numo.webp';

const Login: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (e: import('react').FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await signup(formData.name, formData.username, formData.password, formData.email);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: import('react').ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="Numo Logo" className="logo" />
        </div>
        <h1>{isLogin ? 'Acesse seu espaço pessoal' : 'Crie seu espaço pessoal'}</h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nome do seu espaço"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Seu espaço"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar')}
          </button>
        </form>
      </div>

      <div className="toggle-form-container">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="toggle-button"
        >
          {isLogin ? (
            <span>Ainda não possui seu espaço? <strong>Crie-o Aqui!</strong></span>
          ) : (
            <span>Já possui seu espaço? <strong>Faça login</strong></span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
