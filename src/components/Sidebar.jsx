import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #F5F5DC;
  color: #722F37;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 2px solid #722F37;
  
  /* Responsive: Ocultar en móviles por defecto */
  @media (max-width: 768px) {
    transform: translateX(-100%);
    width: 280px;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 2px solid #722F37;
  text-align: center;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #722F37;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const NavMenu = styled.nav`
  padding: 1rem 0;
`;

const CategorySection = styled.div`
  margin-bottom: 1.5rem;
`;

const CategoryTitle = styled.div`
  padding: 0.5rem 1.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #722F37;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(114, 47, 55, 0.1);
  border-left: 3px solid #722F37;
  margin-bottom: 0.5rem;
`;

const NavItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: #722F37;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  text-align: left;
  border-left: 3px solid transparent;
  
  &:hover {
    background: rgba(114, 47, 55, 0.1);
    color: #722F37;
    transform: translateX(4px);
    border-left-color: #722F37;
  }
  
  &.active {
    background: #722F37;
    color: #F5F5DC;
    border-left: 3px solid #F5F5DC;
    box-shadow: 0 2px 8px rgba(114, 47, 55, 0.3);
    font-weight: 600;
  }
  
  .nav-icon {
    font-size: 1.2rem;
    min-width: 20px;
  }
  
  .nav-text {
    font-weight: 500;
  }
`;

const Sidebar = ({ sections, currentSection, onSectionChange, isOpen, onClose }) => {
  // Agrupar secciones por categoría
  const groupedSections = sections.reduce((acc, section) => {
    const category = section.category || 'Otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(section);
    return acc;
  }, {});

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    // Cerrar menú en móviles después de seleccionar
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && <Overlay onClick={onClose} />}
      <SidebarContainer className={isOpen ? 'open' : ''}>
        <SidebarHeader>
          <h2>🍕 CROSTY</h2>
        </SidebarHeader>
        
        <NavMenu>
          {Object.entries(groupedSections).map(([category, categorySections]) => (
            <CategorySection key={category}>
              <CategoryTitle>{category}</CategoryTitle>
              {categorySections.map(section => (
                <NavItem
                  key={section.id}
                  className={currentSection === section.id ? 'active' : ''}
                  onClick={() => handleSectionClick(section.id)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-text">{section.name}</span>
                </NavItem>
              ))}
            </CategorySection>
          ))}
        </NavMenu>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
