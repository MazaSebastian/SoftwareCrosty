import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../config/supabase';
import { useApp } from '../context/AppContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #722F37;
`;

const Title = styled.h1`
  color: #722F37;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: #6B7280;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #722F37;
    box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
  color: #FFFFFF;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(114, 47, 55, 0.3);
  }
  
  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #FEE2E2;
  color: #DC2626;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid #FECACA;
`;

const SuccessMessage = styled.div`
  background: #D1FAE5;
  color: #065F46;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid #A7F3D0;
`;

const UserList = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #E5E7EB;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #F9FAFB;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #F3F4F6;
    transform: translateX(5px);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  .user-details {
    text-align: left;
  }
  
  .user-name {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }
  
  .user-role {
    color: #6B7280;
    font-size: 0.8rem;
  }
  
  .user-status {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
    
    &.online {
      background: #D1FAE5;
      color: #065F46;
    }
    
    &.offline {
      background: #F3F4F6;
      color: #6B7280;
    }
  }
`;

const Login = () => {
  const { setUsuario } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('activo', true)
        .order('nombre');

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Buscar usuario por email
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('activo', true)
        .single();

      if (userError || !usuario) {
        throw new Error('Usuario no encontrado o inactivo');
      }

      // Simular login exitoso (en un sistema real usarías autenticación de Supabase)
      setSuccess(`¡Bienvenido, ${usuario.nombre} ${usuario.apellido}!`);
      
      // Actualizar último acceso
      await supabase
        .from('usuarios')
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq('id', usuario.id);

      // Establecer usuario actual
      setUsuario(usuario);
      
      // Guardar en localStorage
      localStorage.setItem('crosty_usuario_actual', JSON.stringify(usuario));
      localStorage.setItem('crosty_logged_in', 'true');

      // Redirigir después de 1 segundo
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (usuario) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      setSuccess(`¡Bienvenido, ${usuario.nombre} ${usuario.apellido}!`);
      
      // Actualizar último acceso
      await supabase
        .from('usuarios')
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq('id', usuario.id);

      // Establecer usuario actual
      setUsuario(usuario);
      
      // Guardar en localStorage
      localStorage.setItem('crosty_usuario_actual', JSON.stringify(usuario));
      localStorage.setItem('crosty_logged_in', 'true');

      // Redirigir después de 1 segundo
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (nombre, apellido) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (ultimoAcceso) => {
    if (!ultimoAcceso) return 'offline';
    
    const lastAccess = new Date(ultimoAcceso);
    const now = new Date();
    const diffMinutes = (now - lastAccess) / (1000 * 60);
    
    return diffMinutes < 5 ? 'online' : 'offline';
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>🍽️</Logo>
        <Title>CROSTY Software</Title>
        <Subtitle>Sistema de Gestión Gastronómica</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleLogin}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </InputGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </Form>

        <UserList>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ color: '#374151', fontSize: '1rem', margin: 0 }}>
              Usuarios Disponibles
            </h3>
            <button
              onClick={() => setShowUserList(!showUserList)}
              style={{
                background: 'none',
                border: 'none',
                color: '#722F37',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              {showUserList ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {showUserList && (
            <div>
              {usuarios.map(usuario => (
                <UserItem 
                  key={usuario.id} 
                  onClick={() => handleQuickLogin(usuario)}
                >
                  <div className="user-info">
                    <div className="user-avatar">
                      {getInitials(usuario.nombre, usuario.apellido)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {usuario.nombre} {usuario.apellido}
                      </div>
                      <div className="user-role">
                        {usuario.rol === 'admin' ? '👑 Administrador' : 
                         usuario.rol === 'usuario' ? '👤 Usuario' : '👋 Invitado'}
                      </div>
                    </div>
                  </div>
                  <div className={`user-status ${getStatusColor(usuario.ultimo_acceso)}`}>
                    {getStatusColor(usuario.ultimo_acceso) === 'online' ? '🟢 En línea' : '⚪ Desconectado'}
                  </div>
                </UserItem>
              ))}
            </div>
          )}
        </UserList>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
