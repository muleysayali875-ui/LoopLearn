import React from 'react';

export const Select = ({
  label,
  id,
  error,
  hint,
  options = [],
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
      <select
        id={id}
        required={required}
        className={`form-select ${error ? 'has-error' : ''} ${className}`.trim()}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
};
