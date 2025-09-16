import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import backupService from './services/backupService';
import automatizacionPreciosService from './services/automatizacionPreciosService';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CajaDiaria from './pages/CajaDiaria';
import Insumos from './pages/Insumos';
import Recetas from './pages/Recetas';
import Stock from './pages/Stock';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import AutomatizacionPrecios from './pages/AutomatizacionPrecios';
import './App.css';

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
    { id: 'automatizacion', name: 'Automatización', icon: '🤖' },
    { id: 'configuracion', name: 'Configuración', icon: '⚙️' }
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
      case 'automatizacion':
        return <AutomatizacionPrecios />;
      case 'configuracion':
        return <Configuracion />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <h1>🍕 CROSTY - Alimentos Congelados al Vacío</h1>
            <div className="header-info">
              <span>Versión 1.0.0</span>
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
            {renderContent()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
