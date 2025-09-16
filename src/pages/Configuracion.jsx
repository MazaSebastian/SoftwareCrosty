import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  background: #FFFFFF;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
  
  h1 {
    color: #722F37;
    margin: 0 0 10px 0;
    font-size: 2rem;
  }
  
  .subtitle {
    color: #6B7280;
    font-size: 1.1rem;
  }
`;

const Content = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
  
  h2 {
    color: #722F37;
    margin: 0 0 15px 0;
    font-size: 1.5rem;
    border-bottom: 2px solid #722F37;
    padding-bottom: 5px;
  }
`;

const Button = styled.button`
  background: #722F37;
  color: #F5F5DC;
  border: 1px solid #E5E7EB;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a252a;
    transform: translateY(-2px);
  }
`;

const Configuracion = () => {
  return (
    <PageContainer>
      <Header>
        <h1>⚙️ Configuración</h1>
        <p className="subtitle">Gestión de configuración del sistema</p>
      </Header>

      <Content>
        <Section>
          <h2>📊 Estado del Sistema</h2>
          <p style={{ color: '#6B7280' }}>
            Sistema funcionando correctamente. Todas las funcionalidades están disponibles.
          </p>
        </Section>

        <Section>
          <h2>🔄 Sistema de Backup</h2>
          <p style={{ color: '#6B7280' }}>
            El sistema de backup automático estará disponible en la próxima actualización.
          </p>
          <Button disabled>
            💾 Backup Manual (Próximamente)
          </Button>
        </Section>

        <Section>
          <h2>⚙️ Configuración General</h2>
          <p style={{ color: '#6B7280' }}>
            Configuraciones adicionales del sistema estarán disponibles próximamente.
          </p>
        </Section>

        <Section>
          <h2>📁 Gestión de Datos</h2>
          <p style={{ color: '#6B7280' }}>
            Herramientas de gestión de datos y exportación estarán disponibles próximamente.
          </p>
        </Section>
      </Content>
    </PageContainer>
  );
};

export default Configuracion;