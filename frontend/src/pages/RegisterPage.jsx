import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ErrorMessage } from '../components/ui/ErrorMessage.jsx';
import { isValidEmail } from '../utils/validation.js';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }
    if (!isValidEmail(email)) {
      errs.email = 'Please provide a valid campus email address.';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    setError(null);

    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '3.5rem 1.5rem' }}>
      <div className="form-card" style={{ maxWidth: '460px' }}>
        <div className="form-header">
          <span className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            JOIN THE COMMUNITY
          </span>
          <h1>Student Registration</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Create an account to offer textbooks, lab equipment, and notes.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Full Name"
            id="name"
            placeholder="e.g. Maya Chen"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) setFormErrors({ ...formErrors, name: null });
            }}
            error={formErrors.name}
            required
          />

          <Input
            label="Campus Email"
            id="email"
            type="email"
            placeholder="e.g. maya.chen@campus.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formErrors.email) setFormErrors({ ...formErrors, email: null });
            }}
            error={formErrors.email}
            hint="Used for account login and notifications"
            required
          />

          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors({ ...formErrors, password: null });
            }}
            error={formErrors.password}
            hint="Minimum 6 characters"
            required
          />

          <div style={{ marginTop: '1.75rem' }}>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              style={{ width: '100%', padding: '0.8rem' }}
            >
              <UserPlus size={16} />
              <span>Create Account</span>
            </Button>
          </div>
        </form>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
          }}
        >
          Already have an account?{' '}
          <Link
            to={`/login${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`}
            style={{ fontWeight: 600, color: 'var(--color-brand-primary)' }}
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
