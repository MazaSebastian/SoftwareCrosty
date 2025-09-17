import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import backupService from './services/backupService';
import automatizacionPreciosService from './services/automatizacionPreciosService';
import Sidebar from './components/Sidebar';
import HamburgerMenuButton from './components/HamburgerButton';
import { SectionLoading } from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import LogoutButton from './components/LogoutButton';
import { ToastProvider } from './components/Toast';
import './App.css';

// Lazy loading de páginas para mejorar la velocidad de carga
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CajaDiaria = lazy(() => import('./pages/CajaDiaria'));
const Insumos = lazy(() => import('./pages/Insumos'));
const Recetas = lazy(() => import('./pages/Recetas'));
const Stock = lazy(() => import('./pages/Stock'));
const Ventas = lazy(() => import('./pages/Ventas'));
const Reportes = lazy(() => import('./pages/Reportes'));
const GestionUsuarios = lazy(() => import('./pages/GestionUsuarios'));
const Configuracion = lazy(() => import('./pages/Configuracion'));
const ConfiguracionSupabase = lazy(() => import('./pages/ConfiguracionSupabase'));
const AutomatizacionPrecios = lazy(() => import('./pages/AutomatizacionPrecios'));

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Funciones para manejar el menú móvil
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Cerrar menú al cambiar de sección en móviles
  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId);
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  // Inicializar sistemas automáticos
  useEffect(() => {
    try {
      // Configurar backup automático cada 2 horas (120 minutos)
      backupService.configurarBackupAutomatico(120);
      // Limpiar backups antiguos (más de 30 días)
      backupService.limpiarBackupsAntiguos(30);
      console.log('🔄 Sistema de backup inicializado');

      // Inicializar sistema de automatización de precios
      automatizacionPreciosService.inicializar();
      console.log('🤖 Sistema de automatización de precios inicializado');
    } catch (error) {
      console.error('Error inicializando sistemas:', error);
    }
  }, []);

  const sections = [
    // 🏠 HOME
    { id: 'dashboard', name: 'Dashboard', icon: '📊', category: 'Home' },
    
    // 💰 FINANZAS
    { id: 'caja', name: 'Caja Diaria', icon: '💰', category: 'Finanzas' },
    { id: 'ventas', name: 'Ventas', icon: '🛒', category: 'Finanzas' },
    
    // 📦 PRODUCTOS
    { id: 'insumos', name: 'Insumos', icon: '🥬', category: 'Productos' },
    { id: 'recetas', name: 'Recetas', icon: '🍽️', category: 'Productos' },
    { id: 'stock', name: 'Control de Stock', icon: '📦', category: 'Productos' },
    
    // 📈 ANÁLISIS
    { id: 'reportes', name: 'Reportes', icon: '📈', category: 'Análisis' },
    { id: 'automatizacion', name: 'Automatización', icon: '🤖', category: 'Análisis' },
    
    // ⚙️ SISTEMA
    { id: 'usuarios', name: 'Usuarios', icon: '👥', category: 'Sistema' },
    { id: 'supabase', name: 'Supabase', icon: '☁️', category: 'Sistema' },
    { id: 'configuracion', name: 'Configuración', icon: '⚙️', category: 'Sistema' }
  ];

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'caja':
        return <CajaDiaria />;
      case 'insumos':
        return <Insumos />;
      case 'recetas':
        return <Recetas />;
      case 'stock':
        return <Stock />;
      case 'ventas':
        return <Ventas />;
      case 'reportes':
        return <Reportes />;
      case 'usuarios':
        return <GestionUsuarios />;
      case 'automatizacion':
        return <AutomatizacionPrecios />;
      case 'configuracion':
        return <Configuracion />;
      case 'supabase':
        return <ConfiguracionSupabase />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <ToastProvider>
        <ProtectedRoute>
          <div className="App">
          <header className="app-header">
            <div className="header-content">
              <div className="header-left">
                <HamburgerMenuButton 
                  isOpen={isSidebarOpen} 
                  onClick={toggleSidebar} 
                />
                <h1>🍕 CROSTY - Alimentos Congelados al Vacío</h1>
              </div>
              <div className="header-info">
                <span>Versión 1.0.0</span>
                <LogoutButton />
              </div>
            </div>
          </header>

          <div className="app-body">
            <Sidebar 
              sections={sections}
              currentSection={currentSection}
              onSectionChange={handleSectionChange}
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
            />

            <main className="main-content">
              <Suspense fallback={<SectionLoading text="Cargando sección..." />}>
                {renderContent()}
              </Suspense>
            </main>
          </div>
        </div>
        </ProtectedRoute>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
