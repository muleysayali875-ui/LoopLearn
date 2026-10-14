import React from 'react';

export const Input = ({
  label,
  id,
  error,
  hint,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          <span>
            {label}
            {required && <span className="form-label-required">*</span>}
          </span>
          {hint && <span className="form-hint">{hint}</span>}
        </label>
      )}
      <input
        id={id}
        required={required}
        className={`form-input ${error ? 'has-error' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
};
