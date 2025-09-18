import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Badge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #EF4444;
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  animation: ${props => props.hasNotifications ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      transform: scale(1.05);
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    min-width: 18px;
    height: 18px;
    font-size: 0.7rem;
    top: -6px;
    right: -6px;
  }
`;

const NotificationBadge = ({ count, children, className = '' }) => {
  const hasNotifications = count > 0;
  
  return (
    <BadgeContainer className={className}>
      {children}
      {hasNotifications && (
        <Badge hasNotifications={hasNotifications}>
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </BadgeContainer>
  );
};

export default NotificationBadge;
