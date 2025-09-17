import React from 'react';
import styled from 'styled-components';

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
  }
  
  &:hover {
    background: rgba(114, 47, 55, 0.1);
  }
  
  .hamburger-line {
    width: 100%;
    height: 3px;
    background: #722F37;
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }
  
  &.open {
    .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    
    .hamburger-line:nth-child(2) {
      opacity: 0;
    }
    
    .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  }
`;

const HamburgerMenuButton = ({ isOpen, onClick }) => {
  return (
    <HamburgerButton 
      className={isOpen ? 'open' : ''} 
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <div className="hamburger-line"></div>
      <div className="hamburger-line"></div>
      <div className="hamburger-line"></div>
    </HamburgerButton>
  );
};

export default HamburgerMenuButton;
