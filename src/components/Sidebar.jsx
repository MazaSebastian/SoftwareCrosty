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

const Sidebar = ({ sections, currentSection, onSectionChange }) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <h2>🍕 CROSTY</h2>
      </SidebarHeader>
      
      <NavMenu>
        {sections.map(section => (
          <NavItem
            key={section.id}
            className={currentSection === section.id ? 'active' : ''}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-text">{section.name}</span>
          </NavItem>
        ))}
      </NavMenu>
    </SidebarContainer>
  );
};

export default Sidebar;
