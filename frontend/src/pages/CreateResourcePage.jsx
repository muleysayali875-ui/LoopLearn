import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { ResourceForm } from '../components/resources/ResourceForm.jsx';
import { createResourceApi } from '../services/resources.api.js';
import { useAuth } from '../hooks/useAuth.js';
import { ErrorMessage } from '../components/ui/ErrorMessage.jsx';
import { Button } from '../components/ui/Button.jsx';

export const CreateResourcePage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async (formValues) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const response = await createResourceApi(formValues);
      const newId = response.data?.resource?._id;
      if (newId) {
        navigate(`/resources/${newId}`);
      } else {
        navigate('/my-listings');
      }
    } catch (err) {
      setServerError(err.message || 'Failed to publish resource. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="page-container" style={{ maxWidth: '580px', margin: '4rem auto' }}>
        <div className="form-card" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-brand-primary)',
              margin: '0 auto 1.25rem',
            }}
          >
            <LogIn size={26} />
          </div>
          <span className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            STUDENT SIGN-IN REQUIRED
          </span>
          <h1 style={{ fontSize: '1.8rem', margin: '0.75rem 0' }}>
            Sign in to share a resource
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            To keep our campus exchange community trusted and secure, only verified registered
            students can post resource listings.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login">
              <Button variant="primary">Log in to your account</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Create student account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-header">
          <span className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            PASS IT ON
          </span>
          <h1>Share an academic resource</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', marginTop: '0.5rem' }}>
            List a textbook, calculator, lab gear, or revision notes. Help another student while
            keeping learning materials circulating on campus.
          </p>
        </div>

        {serverError && <ErrorMessage message={serverError} />}

        <ResourceForm
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          submitLabel="Publish Resource"
        />
      </div>
    </div>
  );
};
