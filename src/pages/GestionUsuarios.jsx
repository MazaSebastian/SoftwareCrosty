import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  obtenerUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario,
  obtenerEstadisticasUsuarios
} from '../services/usuariosService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #FFFFFF;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #722F37;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .subtitle {
    color: #6B7280;
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const Button = styled.button`
  background: #722F37;
  border: 1px solid #E5E7EB;
  color: #F5F5DC;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #F5F5DC;
    color: #722F37;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(114, 47, 55, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  color: #722F37;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #722F37;
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    
    .stat-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #722F37;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .stat-icon {
      font-size: 1.5rem;
      color: #722F37;
    }
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #722F37;
  }
  
  .stat-subtitle {
    font-size: 0.85rem;
    color: #6B7280;
  }
`;

const UsuariosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const UsuarioCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #722F37;
  }
  
  .usuario-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    
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
      font-size: 1.2rem;
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
        margin: 0;
        font-size: 0.9rem;
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
  }
  
  .usuario-details {
    margin-bottom: 1rem;
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      
      .label {
        color: #6B7280;
      }
      
      .value {
        color: #722F37;
        font-weight: 500;
      }
    }
  }
  
  .usuario-actions {
    display: flex;
    gap: 0.5rem;
    
    button {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &.edit {
        background: #F3F4F6;
        color: #374151;
        
        &:hover {
          background: #E5E7EB;
        }
      }
      
      &.delete {
        background: #FEE2E2;
        color: #991B1B;
        
        &:hover {
          background: #FECACA;
        }
      }
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  
  h2 {
    margin: 0 0 1.5rem 0;
    color: #722F37;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
  
  label {
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
  }
  
  input, select {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #722F37;
      box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'usuario'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuariosData, estadisticasData] = await Promise.all([
        obtenerUsuarios(),
        obtenerEstadisticasUsuarios()
      ]);
      setUsuarios(usuariosData);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.email) return;

    try {
      if (usuarioEditando) {
        await actualizarUsuario(usuarioEditando.id, formData);
      } else {
        await crearUsuario(formData);
      }
      
      await cargarDatos();
      setIsModalOpen(false);
      setUsuarioEditando(null);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        rol: 'usuario'
      });
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const handleEdit = (usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await eliminarUsuario(id);
        await cargarDatos();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUsuarioEditando(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      rol: 'usuario'
    });
  };

  const obtenerIniciales = (usuario) => {
    return `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>Gestión de Usuarios</h1>
          <div className="subtitle">Administrar usuarios del sistema</div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          ➕ Nuevo Usuario
        </Button>
      </Header>

      {estadisticas && (
        <StatsGrid>
          <StatCard>
            <div className="stat-header">
              <div className="stat-title">Total Usuarios</div>
              <div className="stat-icon">👥</div>
            </div>
            <div className="stat-value">{estadisticas.totalUsuarios}</div>
            <div className="stat-subtitle">Usuarios activos</div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-title">Administradores</div>
              <div className="stat-icon">👑</div>
            </div>
            <div className="stat-value">{estadisticas.usuariosPorRol.admin || 0}</div>
            <div className="stat-subtitle">Con permisos completos</div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-title">Usuarios</div>
              <div className="stat-icon">👤</div>
            </div>
            <div className="stat-value">{estadisticas.usuariosPorRol.usuario || 0}</div>
            <div className="stat-subtitle">Permisos estándar</div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-title">Último Acceso</div>
              <div className="stat-icon">🕒</div>
            </div>
            <div className="stat-value">
              {estadisticas.ultimoAcceso.length > 0 ? 
                formatDate(estadisticas.ultimoAcceso[0].ultimoAcceso) : 
                'N/A'
              }
            </div>
            <div className="stat-subtitle">
              {estadisticas.ultimoAcceso.length > 0 ? 
                estadisticas.ultimoAcceso[0].nombre : 
                'Sin actividad'
              }
            </div>
          </StatCard>
        </StatsGrid>
      )}

      <UsuariosGrid>
        {usuarios.map((usuario) => (
          <UsuarioCard key={usuario.id}>
            <div className="usuario-header">
              <div className="avatar">
                {obtenerIniciales(usuario)}
              </div>
              <div className="info">
                <p className="nombre">{usuario.nombre} {usuario.apellido}</p>
                <p className="email">{usuario.email}</p>
              </div>
              <div className={`status ${usuario.activo ? 'activo' : 'inactivo'}`}>
                {usuario.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            <div className="usuario-details">
              <div className="detail-row">
                <span className="label">Rol:</span>
                <span className="value">{usuario.rol}</span>
              </div>
              <div className="detail-row">
                <span className="label">Creado:</span>
                <span className="value">{formatDate(usuario.fechaCreacion)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Último acceso:</span>
                <span className="value">{formatDate(usuario.ultimoAcceso)}</span>
              </div>
            </div>

            <div className="usuario-actions">
              <button 
                className="edit"
                onClick={() => handleEdit(usuario)}
              >
                ✏️ Editar
              </button>
              <button 
                className="delete"
                onClick={() => handleDelete(usuario.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </UsuarioCard>
        ))}
      </UsuariosGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2>{usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Apellido *</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Apellido"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@crosty.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Rol</label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </FormGroup>

            <ModalActions>
              <Button
                type="button"
                onClick={handleCancel}
                style={{ background: '#6b7280' }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {usuarioEditando ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            </ModalActions>
          </Form>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default GestionUsuarios;
