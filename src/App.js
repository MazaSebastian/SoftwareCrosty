import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'gastos', name: 'Gestión de Gastos', icon: '💰' },
    { id: 'crosti', name: 'CROSTI', icon: '🍕' },
    { id: 'inventario', name: 'Inventario', icon: '📦' },
    { id: 'reportes', name: 'Reportes', icon: '📈' },
    { id: 'configuracion', name: 'Configuración', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <div className="dashboard">
            <h2>Dashboard Principal</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Resumen del Día</h3>
                <p>Bienvenido a CROSTY</p>
              </div>
              <div className="dashboard-card">
                <h3>Ventas Hoy</h3>
                <p>$0.00</p>
              </div>
              <div className="dashboard-card">
                <h3>Gastos Hoy</h3>
                <p>$0.00</p>
              </div>
              <div className="dashboard-card">
                <h3>Productos en Stock</h3>
                <p>0</p>
              </div>
            </div>
          </div>
        );
      case 'gastos':
        return (
          <div className="gastos">
            <h2>Gestión de Gastos</h2>
            <p>Módulo de gestión de gastos - En desarrollo</p>
          </div>
        );
      case 'crosti':
        return (
          <div className="crosti">
            <h2>CROSTI</h2>
            <p>Módulo CROSTI - En desarrollo</p>
          </div>
        );
      case 'inventario':
        return (
          <div className="inventario">
            <h2>Inventario</h2>
            <p>Módulo de inventario - En desarrollo</p>
          </div>
        );
      case 'reportes':
        return (
          <div className="reportes">
            <h2>Reportes</h2>
            <p>Módulo de reportes - En desarrollo</p>
          </div>
        );
      case 'configuracion':
        return (
          <div className="configuracion">
            <h2>Configuración</h2>
            <p>Módulo de configuración - En desarrollo</p>
          </div>
        );
      default:
        return <div>Sección no encontrada</div>;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🍕 CROSTY - Gestión Gastronómica</h1>
          <div className="header-info">
            <span>Versión 1.0.0</span>
          </div>
        </div>
      </header>

      <div className="app-body">
        <nav className="sidebar">
          <ul className="nav-list">
            {sections.map(section => (
              <li key={section.id} className="nav-item">
                <button
                  className={`nav-button ${currentSection === section.id ? 'active' : ''}`}
                  onClick={() => setCurrentSection(section.id)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-text">{section.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
