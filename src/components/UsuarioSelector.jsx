import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { obtenerUsuarios, establecerUsuarioActual, obtenerUsuarioActual } from '../services/usuariosService';

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const UsuarioInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #722F37, #8B3A42);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .info {
    .nombre {
      font-weight: 600;
      color: #722F37;
      margin: 0;
      font-size: 1rem;
    }
    
    .rol {
      font-size: 0.8rem;
      color: #6B7280;
      margin: 0;
      text-transform: capitalize;
    }
  }
`;

const SelectorButton = styled.button`
  background: #722F37;
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #8B3A42;
    transform: translateY(-1px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    color: #722F37;
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  p {
    color: #6B7280;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const UsuarioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const UsuarioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#722F37' : '#E5E7EB'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? '#F9F9F9' : '#FFFFFF'};
  
  &:hover {
    border-color: #722F37;
    background: #F9F9F9;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #722F37, #8B3A42);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  .info {
    flex: 1;
    
    .nombre {
      font-weight: 600;
      color: #722F37;
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
    }
    
    .email {
      color: #6B7280;
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }
    
    .rol {
      color: #6B7280;
      margin: 0;
      font-size: 0.8rem;
      text-transform: capitalize;
    }
  }
  
  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    
    &.activo {
      background: #D1FAE5;
      color: #065F46;
    }
    
    &.inactivo {
      background: #FEE2E2;
      color: #991B1B;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: #722F37;
    color: #FFFFFF;
    border: none;
    
    &:hover {
      background: #8B3A42;
    }
  }
  
  &.secondary {
    background: #FFFFFF;
    color: #6B7280;
    border: 1px solid #E5E7EB;
    
    &:hover {
      background: #F9F9F9;
    }
  }
`;

const UsuarioSelector = ({ onUsuarioChange }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario actual y lista de usuarios
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [usuarioActualData, usuariosData] = await Promise.all([
          Promise.resolve(obtenerUsuarioActual()),
          obtenerUsuarios()
        ]);
        
        setUsuarioActual(usuarioActualData);
        setUsuarios(usuariosData);
        
        // Si no hay usuario actual, establecer el primero por defecto
        if (!usuarioActualData && usuariosData.length > 0) {
          const primerUsuario = usuariosData[0];
          establecerUsuarioActual(primerUsuario);
          setUsuarioActual(primerUsuario);
          if (onUsuarioChange) onUsuarioChange(primerUsuario);
        }
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [onUsuarioChange]);

  const handleSeleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const handleConfirmarSeleccion = () => {
    if (usuarioSeleccionado) {
      establecerUsuarioActual(usuarioSeleccionado);
      setUsuarioActual(usuarioSeleccionado);
      setMostrarModal(false);
      if (onUsuarioChange) onUsuarioChange(usuarioSeleccionado);
    }
  };

  const handleCancelar = () => {
    setMostrarModal(false);
    setUsuarioSeleccionado(null);
  };

  const obtenerIniciales = (usuario) => {
    if (!usuario) return 'U';
    return `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <SelectorContainer>
        <div>Cargando usuarios...</div>
      </SelectorContainer>
    );
  }

  return (
    <>
      <SelectorContainer>
        {usuarioActual ? (
          <UsuarioInfo>
            <div className="avatar">
              {obtenerIniciales(usuarioActual)}
            </div>
            <div className="info">
              <p className="nombre">{usuarioActual.nombre} {usuarioActual.apellido}</p>
              <p className="rol">{usuarioActual.rol}</p>
            </div>
          </UsuarioInfo>
        ) : (
          <div>No hay usuario seleccionado</div>
        )}
        
        <SelectorButton onClick={() => setMostrarModal(true)}>
          Cambiar Usuario
        </SelectorButton>
      </SelectorContainer>

      {mostrarModal && (
        <ModalOverlay onClick={handleCancelar}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Seleccionar Usuario</h3>
              <p>Elige el usuario que realizará las operaciones</p>
            </ModalHeader>

            <UsuarioList>
              {usuarios.map((usuario) => (
                <UsuarioItem
                  key={usuario.id}
                  selected={usuarioSeleccionado?.id === usuario.id}
                  onClick={() => handleSeleccionarUsuario(usuario)}
                >
                  <div className="avatar">
                    {obtenerIniciales(usuario)}
                  </div>
                  <div className="info">
                    <p className="nombre">{usuario.nombre} {usuario.apellido}</p>
                    <p className="email">{usuario.email}</p>
                    <p className="rol">{usuario.rol}</p>
                  </div>
                  <div className={`status ${usuario.activo ? 'activo' : 'inactivo'}`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </div>
                </UsuarioItem>
              ))}
            </UsuarioList>

            <ModalActions>
              <Button className="secondary" onClick={handleCancelar}>
                Cancelar
              </Button>
              <Button 
                className="primary" 
                onClick={handleConfirmarSeleccion}
                disabled={!usuarioSeleccionado}
              >
                Seleccionar
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default UsuarioSelector;
