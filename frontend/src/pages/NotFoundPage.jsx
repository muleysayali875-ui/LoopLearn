import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="page-container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div
        style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent-sage)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-accent-sage-dark)',
          margin: '0 auto 1.5rem',
        }}
      >
        <Compass size={36} strokeWidth={1.5} />
      </div>
      <span className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
        PAGE NOT FOUND (404)
      </span>
      <h1 style={{ fontSize: '2.5rem', margin: '0.75rem 0 1rem' }}>
        This page seems to have moved.
      </h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto 2rem' }}>
        The link you followed may be incorrect, or the resource might have been removed.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Discover</Button>
      </Link>
    </div>
  );
};
