import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-error-bg)',
        border: '1px solid var(--color-error-border)',
        color: 'var(--color-error-text)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        margin: '1.25rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
      role="alert"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.92rem' }}>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            textDecoration: 'underline',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'inherit',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};
