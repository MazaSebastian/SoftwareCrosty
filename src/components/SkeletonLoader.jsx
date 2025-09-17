import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const SkeletonItem = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  height: ${props => props.height || '60px'};
  width: ${props => props.width || '100%'};
`;

const SkeletonCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SkeletonAvatar = styled(SkeletonItem)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const SkeletonText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonLine = styled(SkeletonItem)`
  height: 16px;
  border-radius: 4px;
  
  &:nth-child(1) {
    width: 70%;
  }
  
  &:nth-child(2) {
    width: 50%;
  }
`;

const SkeletonList = ({ count = 3, showAvatar = false }) => {
  return (
    <SkeletonContainer>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index}>
          <SkeletonHeader>
            {showAvatar && <SkeletonAvatar />}
            <SkeletonText>
              <SkeletonLine />
              <SkeletonLine />
            </SkeletonText>
          </SkeletonHeader>
        </SkeletonCard>
      ))}
    </SkeletonContainer>
  );
};

const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <SkeletonContainer>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonItem 
              key={colIndex} 
              height="40px" 
              width={colIndex === 0 ? '200px' : '120px'} 
            />
          ))}
        </div>
      ))}
    </SkeletonContainer>
  );
};

const SkeletonStats = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonCard key={index}>
          <SkeletonItem height="20px" width="60%" />
          <SkeletonItem height="40px" width="80%" />
          <SkeletonItem height="16px" width="40%" />
        </SkeletonCard>
      ))}
    </div>
  );
};

export { SkeletonList, SkeletonTable, SkeletonStats, SkeletonItem };
export default SkeletonList;
