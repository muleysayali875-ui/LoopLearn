import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ErrorMessage } from '../components/ui/ErrorMessage.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '3.5rem 1.5rem' }}>
      <div className="form-card" style={{ maxWidth: '440px' }}>
        <div className="form-header">
          <span className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            WELCOME BACK
          </span>
          <h1>Student Log In</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Access your campus listings and share resources.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Campus Email"
            id="email"
            type="email"
            placeholder="e.g. alex.rivera@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={{ marginTop: '1.75rem' }}>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              style={{ width: '100%', padding: '0.8rem' }}
            >
              <LogIn size={16} />
              <span>Log in to LoopLearn</span>
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
          New to LoopLearn?{' '}
          <Link
            to={`/register${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`}
            style={{ fontWeight: 600, color: 'var(--color-brand-primary)' }}
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
