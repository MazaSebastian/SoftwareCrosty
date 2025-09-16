import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'caja', name: 'Caja Diaria', icon: '💰' },
    { id: 'insumos', name: 'Insumos', icon: '🥬' },
    { id: 'recetas', name: 'Recetas', icon: '🍽️' },
    { id: 'stock', name: 'Control de Stock', icon: '📦' },
    { id: 'ventas', name: 'Ventas', icon: '🛒' },
    { id: 'reportes', name: 'Reportes', icon: '📈' },
    { id: 'configuracion', name: 'Configuración', icon: '⚙️' }
  ];

  const renderContent = () => {
    return (
      <div style={{ padding: '20px', background: '#FFFFFF', margin: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#722F37' }}>¡CROSTY Software Funcionando!</h2>
        <p style={{ color: '#6B7280' }}>Sección actual: {currentSection}</p>
        <p style={{ color: '#6B7280' }}>La aplicación está cargando correctamente.</p>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🍕 CROSTY - Alimentos Congelados al Vacío</h1>
          <div className="header-info">
            <span>Versión 1.0.0 - Debug</span>
          </div>
        </div>
      </header>

      <div className="app-body">
        <nav style={{ 
          width: '250px', 
          background: '#F5F5DC', 
          borderRight: '2px solid #722F37',
          padding: '20px 0'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map(section => (
              <li key={section.id} style={{ margin: '0.5rem 1rem' }}>
                <button
                  onClick={() => setCurrentSection(section.id)}
                  style={{
                    width: '100%',
                    background: currentSection === section.id ? '#722F37' : 'transparent',
                    border: 'none',
                    color: currentSection === section.id ? '#F5F5DC' : '#722F37',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.95rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
                  <span>{section.name}</span>
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
