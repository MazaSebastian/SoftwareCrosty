import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import backupService from './services/backupService';
import automatizacionPreciosService from './services/automatizacionPreciosService';
import Sidebar from './components/Sidebar';
import { SectionLoading } from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import LogoutButton from './components/LogoutButton';
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
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'caja', name: 'Caja Diaria', icon: '💰' },
    { id: 'insumos', name: 'Insumos', icon: '🥬' },
    { id: 'recetas', name: 'Recetas', icon: '🍽️' },
    { id: 'stock', name: 'Control de Stock', icon: '📦' },
    { id: 'ventas', name: 'Ventas', icon: '🛒' },
    { id: 'reportes', name: 'Reportes', icon: '📈' },
    { id: 'usuarios', name: 'Usuarios', icon: '👥' },
    { id: 'automatizacion', name: 'Automatización', icon: '🤖' },
    { id: 'configuracion', name: 'Configuración', icon: '⚙️' },
    { id: 'supabase', name: 'Supabase', icon: '☁️' }
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
      <ProtectedRoute>
        <div className="App">
          <header className="app-header">
            <div className="header-content">
              <h1>🍕 CROSTY - Alimentos Congelados al Vacío</h1>
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
              onSectionChange={setCurrentSection}
            />

            <main className="main-content">
              <Suspense fallback={<SectionLoading text="Cargando sección..." />}>
                {renderContent()}
              </Suspense>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </AppProvider>
  );
}

export default App;
