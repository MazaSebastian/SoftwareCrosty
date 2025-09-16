import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Login from '../pages/Login';

const ProtectedRoute = ({ children }) => {
  const { usuario } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Verificar si hay usuario en el contexto
        if (usuario) {
          setIsLoggedIn(true);
          setIsLoading(false);
          return;
        }

        // Verificar localStorage
        const storedUser = localStorage.getItem('crosty_usuario_actual');
        const loggedIn = localStorage.getItem('crosty_logged_in');

        if (storedUser && loggedIn === 'true') {
          // Usuario encontrado en localStorage, pero no en contexto
          // Esto puede pasar en recargas de página
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [usuario]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #722F37 0%, #8B3A42 100%)',
        color: '#FFFFFF',
        fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
          <div>Cargando CROSTY Software...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;
