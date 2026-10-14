import React from 'react';

export const Textarea = ({
  label,
  id,
  error,
  hint,
  rows = 4,
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
      <textarea
        id={id}
        rows={rows}
        required={required}
        className={`form-textarea ${error ? 'has-error' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
};
