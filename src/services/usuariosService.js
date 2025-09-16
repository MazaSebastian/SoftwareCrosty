// Servicio de gestión de usuarios para CROSTY Software

// Datos mock de usuarios
const usuariosMock = [
  {
    id: 1,
    nombre: 'Sebastián',
    apellido: 'Maza',
    email: 'sebastian@crosty.com',
    rol: 'admin',
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z',
    ultimoAcceso: '2024-01-15T10:30:00Z',
    configuracion: {
      tema: 'claro',
      idioma: 'es',
      notificaciones: true
    }
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    email: 'maria@crosty.com',
    rol: 'usuario',
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z',
    ultimoAcceso: '2024-01-15T09:15:00Z',
    configuracion: {
      tema: 'claro',
      idioma: 'es',
      notificaciones: true
    }
  }
];

// Usuario actual (se establece al iniciar sesión)
let usuarioActual = null;

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return usuariosMock.filter(usuario => usuario.activo);
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return usuariosMock.find(usuario => usuario.id === id);
};

// Obtener usuario actual
export const obtenerUsuarioActual = () => {
  return usuarioActual;
};

// Establecer usuario actual
export const establecerUsuarioActual = (usuario) => {
  usuarioActual = usuario;
  // Guardar en localStorage
  if (usuario) {
    localStorage.setItem('crosty_usuario_actual', JSON.stringify(usuario));
  } else {
    localStorage.removeItem('crosty_usuario_actual');
  }
};

// Cargar usuario actual desde localStorage
export const cargarUsuarioActual = () => {
  try {
    const usuarioGuardado = localStorage.getItem('crosty_usuario_actual');
    if (usuarioGuardado) {
      usuarioActual = JSON.parse(usuarioGuardado);
      return usuarioActual;
    }
  } catch (error) {
    console.error('Error al cargar usuario actual:', error);
    localStorage.removeItem('crosty_usuario_actual');
  }
  return null;
};

// Crear nuevo usuario
export const crearUsuario = async (datosUsuario) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nuevoUsuario = {
    id: Date.now(),
    ...datosUsuario,
    activo: true,
    fechaCreacion: new Date().toISOString(),
    ultimoAcceso: new Date().toISOString(),
    configuracion: {
      tema: 'claro',
      idioma: 'es',
      notificaciones: true,
      ...datosUsuario.configuracion
    }
  };

  usuariosMock.push(nuevoUsuario);
  return nuevoUsuario;
};

// Actualizar usuario
export const actualizarUsuario = async (id, datosActualizacion) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const indice = usuariosMock.findIndex(usuario => usuario.id === id);
  if (indice === -1) {
    throw new Error('Usuario no encontrado');
  }

  usuariosMock[indice] = {
    ...usuariosMock[indice],
    ...datosActualizacion,
    ultimoAcceso: new Date().toISOString()
  };

  return usuariosMock[indice];
};

// Eliminar usuario (desactivar)
export const eliminarUsuario = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const indice = usuariosMock.findIndex(usuario => usuario.id === id);
  if (indice === -1) {
    throw new Error('Usuario no encontrado');
  }

  usuariosMock[indice].activo = false;
  return true;
};

// Actualizar último acceso
export const actualizarUltimoAcceso = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const usuario = usuariosMock.find(u => u.id === id);
  if (usuario) {
    usuario.ultimoAcceso = new Date().toISOString();
  }
};

// Obtener estadísticas de usuarios
export const obtenerEstadisticasUsuarios = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const usuariosActivos = usuariosMock.filter(u => u.activo);
  const usuariosPorRol = usuariosActivos.reduce((acc, usuario) => {
    acc[usuario.rol] = (acc[usuario.rol] || 0) + 1;
    return acc;
  }, {});

  return {
    totalUsuarios: usuariosActivos.length,
    usuariosPorRol,
    ultimoAcceso: usuariosActivos
      .sort((a, b) => new Date(b.ultimoAcceso) - new Date(a.ultimoAcceso))
      .slice(0, 5)
  };
};

// Validar permisos de usuario
export const validarPermisos = (usuario, accion) => {
  if (!usuario) return false;
  
  const permisos = {
    admin: ['crear', 'leer', 'actualizar', 'eliminar', 'configurar'],
    usuario: ['crear', 'leer', 'actualizar'],
    invitado: ['leer']
  };

  return permisos[usuario.rol]?.includes(accion) || false;
};

// Obtener nombre completo del usuario
export const obtenerNombreCompleto = (usuario) => {
  if (!usuario) return 'Usuario no identificado';
  return `${usuario.nombre} ${usuario.apellido}`;
};

// Obtener iniciales del usuario
export const obtenerIniciales = (usuario) => {
  if (!usuario) return 'U';
  return `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();
};

// Cambiar configuración del usuario
export const cambiarConfiguracionUsuario = async (id, configuracion) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const usuario = usuariosMock.find(u => u.id === id);
  if (usuario) {
    usuario.configuracion = {
      ...usuario.configuracion,
      ...configuracion
    };
    
    // Si es el usuario actual, actualizar también
    if (usuarioActual && usuarioActual.id === id) {
      usuarioActual.configuracion = usuario.configuracion;
      establecerUsuarioActual(usuarioActual);
    }
    
    return usuario;
  }
  
  throw new Error('Usuario no encontrado');
};

// Obtener historial de actividades del usuario
export const obtenerHistorialUsuario = async (id, limite = 50) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simular historial de actividades
  const actividades = [
    {
      id: 1,
      usuarioId: id,
      accion: 'venta_creada',
      descripcion: 'Creó una nueva venta',
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      detalles: { monto: 2500, producto: 'Tarta de Pollo' }
    },
    {
      id: 2,
      usuarioId: id,
      accion: 'gasto_registrado',
      descripcion: 'Registró un gasto',
      fecha: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      detalles: { monto: 1500, categoria: 'Insumos' }
    },
    {
      id: 3,
      usuarioId: id,
      accion: 'receta_actualizada',
      descripcion: 'Actualizó una receta',
      fecha: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      detalles: { receta: 'Pollo BBQ', cambios: ['precio', 'ingredientes'] }
    }
  ];

  return actividades.slice(0, limite);
};

export default {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioActual,
  establecerUsuarioActual,
  cargarUsuarioActual,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  actualizarUltimoAcceso,
  obtenerEstadisticasUsuarios,
  validarPermisos,
  obtenerNombreCompleto,
  obtenerIniciales,
  cambiarConfiguracionUsuario,
  obtenerHistorialUsuario
};
