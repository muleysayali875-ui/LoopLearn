import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Mail, Repeat, Clock, Gift } from 'lucide-react';
import { getResourceByIdApi } from '../services/resources.api.js';
import { CategoryIllustration } from '../assets/illustrations/CategoryIllustration.jsx';
import {
  ResourceOfferBadge,
  ResourceConditionBadge,
  ResourceAvailabilityBadge,
} from '../components/resources/ResourceStatusBadge.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { ErrorMessage } from '../components/ui/ErrorMessage.jsx';
import { formatDate } from '../utils/formatDate.js';

export const ResourceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getResourceByIdApi(id);
        if (isMounted) {
          setResource(response.data.resource);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Resource not found or failed to load.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingState message="Loading resource details..." />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="page-container detail-page-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to all resources</span>
        </Link>
        <ErrorMessage message={error || 'Resource not found.'} onRetry={() => navigate(0)} />
      </div>
    );
  }

  const {
    title,
    category,
    condition,
    offerType,
    exchangePreference,
    borrowDuration,
    description,
    location,
    availability,
    contactMethod,
    ownerId,
    createdAt,
  } = resource;

  return (
    <div className="page-container detail-page-container">
      {/* Return to browsing link */}
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to all resources</span>
      </Link>

      <article className="detail-card">
        {/* Header with Title and Badges */}
        <header className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-page)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-brand-primary)',
              }}
            >
              <CategoryIllustration category={category} size={22} />
            </div>
            <span className="editorial-eyebrow">{category}</span>
          </div>

          <h1 className="detail-title">{title}</h1>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ResourceOfferBadge offerType={offerType} />
            <ResourceConditionBadge condition={condition} />
            <ResourceAvailabilityBadge availability={availability} />
          </div>
        </header>

        {/* Structured Metadata Grid */}
        <div className="detail-meta-grid">
          <div>
            <div className="meta-item-label">Campus Location</div>
            <div className="meta-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="var(--color-brand-primary)" />
              <span>{location}</span>
            </div>
          </div>

          <div>
            <div className="meta-item-label">Listed By</div>
            <div className="meta-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="var(--color-brand-primary)" />
              <span>{ownerId?.name || 'Verified Student'}</span>
            </div>
          </div>

          <div>
            <div className="meta-item-label">Date Posted</div>
            <div className="meta-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--color-brand-primary)" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Offer-Specific Information Callouts */}
        {offerType === 'Donate' && (
          <div className="detail-callout">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Gift size={18} color="var(--color-accent-apricot-dark)" />
              <h4>Free Student Donation</h4>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-main)' }}>
              This resource is offered freely to any student who needs it. No payment, deposit, or
              commercial exchange is involved.
            </p>
          </div>
        )}

        {offerType === 'Exchange' && exchangePreference && (
          <div className="detail-callout">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Repeat size={18} color="var(--color-accent-apricot-dark)" />
              <h4>Desired Exchange Item</h4>
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
              {exchangePreference}
            </p>
          </div>
        )}

        {offerType === 'Lend' && borrowDuration && (
          <div className="detail-callout">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Clock size={18} color="var(--color-accent-apricot-dark)" />
              <h4>Borrowing Duration & Return Terms</h4>
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
              {borrowDuration}
            </p>
          </div>
        )}

        {/* Detailed Description */}
        <section>
          <h2 className="detail-section-title">Item Description</h2>
          <div className="detail-description">{description}</div>
        </section>

        {/* Contact & Exchange Instructions */}
        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
          <h2 className="detail-section-title">Arranging Pickup & Exchange</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Resource handovers are coordinated directly between campus students. Meet in a well-lit
            public campus space (such as a campus library, student union, or academic department lounge).
          </p>

          {contactMethod ? (
            <div
              style={{
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Mail size={18} color="var(--color-brand-primary)" />
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', display: 'block' }}>
                  Owner's Preferred Contact
                </span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                  {contactMethod}
                </span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
              No specific public contact method provided. Reach out through verified campus directories
              or look for this student at {location}.
            </p>
          )}
        </section>
      </article>
    </div>
  );
};
