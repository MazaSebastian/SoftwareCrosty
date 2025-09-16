import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

const LogoutContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #F9FAFB;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  
  .user-avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
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
`;

const LogoutButtonComponent = () => {
  const { usuario, setUsuario } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    // Limpiar usuario actual
    setUsuario(null);
    
    // Limpiar localStorage
    localStorage.removeItem('crosty_usuario_actual');
    localStorage.removeItem('crosty_logged_in');
    
    // Redirigir a login
    window.location.href = '/login';
  };

  const getInitials = (nombre, apellido) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  if (!usuario) return null;

  return (
    <LogoutContainer>
      {showConfirm ? (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          background: '#FFFFFF', 
          border: '1px solid #E5E7EB', 
          borderRadius: '8px', 
          padding: '1rem', 
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <UserInfo>
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
          </UserInfo>
          
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            justifyContent: 'flex-end' 
          }}>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                background: '#6B7280',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      ) : (
        <LogoutButton onClick={() => setShowConfirm(true)}>
          <span>👤</span>
          {usuario.nombre}
          <span>▼</span>
        </LogoutButton>
      )}
    </LogoutContainer>
  );
};

export default LogoutButtonComponent;
