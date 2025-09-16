# 👥 Sistema de Usuarios - CROSTY Software

## 📋 **Descripción del Sistema**

El sistema de usuarios permite **distinguir las acciones entre usuarios** mientras mantiene un **saldo general de CROSTY** que suma todas las operaciones.

### **🎯 Concepto Principal:**
- **Usuarios individuales** con acciones separadas y trazables
- **Saldo general de CROSTY** que consolida todas las operaciones
- **Trazabilidad completa** de quién hizo qué y cuándo
- **Reportes** tanto por usuario como generales

## 🏗️ **Arquitectura del Sistema**

### **1. Servicio de Usuarios (`usuariosService.js`)**
```javascript
// Funciones principales:
- obtenerUsuarios()           // Lista todos los usuarios
- obtenerUsuarioActual()      // Usuario logueado
- establecerUsuarioActual()   // Cambiar usuario activo
- crearUsuario()              // Crear nuevo usuario
- actualizarUsuario()         // Modificar usuario
- eliminarUsuario()           // Desactivar usuario
- validarPermisos()           // Verificar permisos
```

### **2. Servicio de Caja Actualizado (`cajaService.js`)**
```javascript
// Nuevas funciones:
- obtenerSaldoGeneralCrosty()     // Saldo total de CROSTY
- obtenerMovimientosPorUsuario()  // Movimientos por usuario
- obtenerEstadisticasPorUsuario() // Stats por usuario
- obtenerResumenCajaCompleto()    // Resumen completo
```

### **3. Componente Selector de Usuario (`UsuarioSelector.jsx`)**
- **Selector visual** de usuario activo
- **Modal de selección** con lista de usuarios
- **Información del usuario** actual
- **Cambio dinámico** de usuario

## 👤 **Tipos de Usuarios**

### **🔑 Administrador (admin)**
- **Permisos**: Crear, leer, actualizar, eliminar, configurar
- **Acceso**: Todas las funcionalidades
- **Responsabilidades**: Gestión completa del sistema

### **👤 Usuario (usuario)**
- **Permisos**: Crear, leer, actualizar
- **Acceso**: Funcionalidades operativas
- **Responsabilidades**: Operaciones diarias

### **👋 Invitado (invitado)**
- **Permisos**: Solo lectura
- **Acceso**: Consultas y reportes
- **Responsabilidades**: Visualización de datos

## 💰 **Sistema de Caja con Usuarios**

### **📊 Saldo General de CROSTY**
```
🏢 SALDO GENERAL CROSTY
├── 💵 Efectivo: $15,000
├── 💳 Transferencia: $8,500
├── 📈 Total: $23,500
├── 💰 Ingresos: $25,000
├── 💸 Egresos: $1,500
└── 📊 Utilidad: $23,500
```

### **👥 Saldos por Usuario**
```
👤 Sebastián Maza
├── 💵 Efectivo: $8,000
├── 💳 Transferencia: $4,500
└── 📈 Total: $12,500

👤 María González
├── 💵 Efectivo: $7,000
├── 💳 Transferencia: $4,000
└── 📈 Total: $11,000
```

### **🔄 Trazabilidad de Movimientos**
```
📋 MOVIMIENTOS RECIENTES
├── 💰 Venta Tartas - Sebastián Maza - +$2,500
├── 💸 Compra Insumos - María González - -$1,500
├── 💰 Venta Pollo BBQ - Sebastián Maza - +$3,000
└── 💸 Servicios - María González - -$800
```

## 🎯 **Funcionalidades Implementadas**

### **1. ✅ Selector de Usuario**
- **Ubicación**: En todas las páginas que requieren identificación
- **Funcionalidad**: Cambio dinámico de usuario activo
- **Persistencia**: Se mantiene entre sesiones

### **2. ✅ Caja Diaria con Usuarios**
- **Saldo General**: Muestra el total de CROSTY
- **Saldos Individuales**: Por cada usuario
- **Trazabilidad**: Quién hizo cada movimiento
- **Reportes**: Por usuario y generales

### **3. ✅ Gestión de Usuarios**
- **CRUD Completo**: Crear, leer, actualizar, eliminar
- **Roles y Permisos**: Admin, Usuario, Invitado
- **Estadísticas**: Total de usuarios, por rol, último acceso
- **Estado**: Activo/Inactivo

### **4. ✅ Integración con Context**
- **Usuario Global**: Disponible en toda la aplicación
- **Persistencia**: Se guarda en localStorage
- **Sincronización**: Entre componentes

## 📱 **Interfaz de Usuario**

### **🎨 Selector de Usuario**
```
┌─────────────────────────────────────┐
│ 👤 Sebastián Maza    [Cambiar]     │
│    admin                            │
└─────────────────────────────────────┘
```

### **📊 Dashboard de Caja**
```
┌─────────────────────────────────────┐
│ 🏢 Saldo General CROSTY            │
│    $23,500                         │
│    Efectivo: $15,000 • Trans: $8,500│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👥 Saldos por Usuario              │
│    Sebastián: $12,500              │
│    María: $11,000                  │
└─────────────────────────────────────┘
```

### **👥 Gestión de Usuarios**
```
┌─────────────────────────────────────┐
│ 👤 Sebastián Maza    [✏️] [🗑️]     │
│    sebastian@crosty.com             │
│    admin • Activo                   │
└─────────────────────────────────────┘
```

## 🔧 **Configuración y Uso**

### **🚀 Inicialización**
```javascript
// El sistema se inicializa automáticamente
// Carga el usuario desde localStorage
// Establece el primer usuario como activo si no hay ninguno
```

### **👤 Cambio de Usuario**
```javascript
// Desde cualquier página:
1. Hacer clic en "Cambiar Usuario"
2. Seleccionar usuario de la lista
3. Confirmar selección
4. El usuario se actualiza globalmente
```

### **💰 Crear Movimiento**
```javascript
// Los movimientos se asocian automáticamente al usuario activo:
- Se registra el usuarioId
- Se guarda el nombre del usuario
- Se actualiza el saldo general
- Se actualiza el saldo del usuario
```

## 📊 **Reportes y Estadísticas**

### **📈 Por Usuario**
- **Movimientos**: Lista de operaciones del usuario
- **Saldos**: Efectivo, transferencia, total
- **Estadísticas**: Ingresos, egresos, utilidad
- **Historial**: Actividad reciente

### **🏢 Generales de CROSTY**
- **Saldo Total**: Suma de todos los usuarios
- **Ingresos Totales**: Todos los ingresos
- **Egresos Totales**: Todos los egresos
- **Utilidad**: Diferencia entre ingresos y egresos

## 🔒 **Seguridad y Permisos**

### **🛡️ Validación de Permisos**
```javascript
// Ejemplo de validación:
const puedeEliminar = validarPermisos(usuario, 'eliminar');
const puedeConfigurar = validarPermisos(usuario, 'configurar');
```

### **🔐 Roles y Acceso**
- **Admin**: Acceso completo
- **Usuario**: Operaciones estándar
- **Invitado**: Solo lectura

## 🚀 **Próximas Funcionalidades**

### **📋 Corto Plazo**
- [ ] **Filtros por usuario** en reportes
- [ ] **Exportación** de datos por usuario
- [ ] **Notificaciones** de cambios de usuario

### **📈 Mediano Plazo**
- [ ] **Dashboard por usuario** personalizado
- [ ] **Métricas de rendimiento** por usuario
- [ ] **Comparativas** entre usuarios

### **🔮 Largo Plazo**
- [ ] **Autenticación** con contraseñas
- [ ] **Sesiones** con timeout
- [ ] **Auditoría** completa de acciones

## 📝 **Notas de Implementación**

### **✅ Completado**
- ✅ Servicio de usuarios completo
- ✅ Integración con caja diaria
- ✅ Selector de usuario
- ✅ Gestión de usuarios
- ✅ Saldo general de CROSTY
- ✅ Trazabilidad de movimientos

### **🔄 En Progreso**
- 🔄 Integración con otros módulos
- 🔄 Reportes avanzados
- 🔄 Optimizaciones de performance

### **📋 Pendiente**
- 📋 Autenticación segura
- 📋 Permisos granulares
- 📋 Auditoría completa

---

**Última actualización**: $(date)
**Versión**: 1.0.0
**Estado**: ✅ Implementado y funcionando

## 🎯 **Beneficios del Sistema**

### **👥 Para los Usuarios**
- **Identificación clara** de responsabilidades
- **Trazabilidad** de sus acciones
- **Saldo personal** visible
- **Fácil cambio** entre usuarios

### **🏢 Para CROSTY**
- **Control total** del negocio
- **Saldo general** consolidado
- **Reportes** por usuario y generales
- **Gestión** de permisos

### **📊 Para la Gestión**
- **Visibilidad** de quién hace qué
- **Métricas** por usuario
- **Control** de acceso
- **Auditoría** de operaciones
