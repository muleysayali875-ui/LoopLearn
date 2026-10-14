import React from 'react';

export const PageContainer = ({ children, className = '' }) => {
  return <div className={`page-container ${className}`.trim()}>{children}</div>;
};
