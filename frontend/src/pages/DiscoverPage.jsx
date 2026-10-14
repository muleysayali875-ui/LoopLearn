import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, BookOpen, Repeat, Clock } from 'lucide-react';
import { CampusIllustration } from '../assets/illustrations/CampusIllustration.jsx';
import { ResourceFilters } from '../components/resources/ResourceFilters.jsx';
import { ResourceGrid } from '../components/resources/ResourceGrid.jsx';
import { useResources } from '../hooks/useResources.js';
import { Button } from '../components/ui/Button.jsx';
import { ErrorMessage } from '../components/ui/ErrorMessage.jsx';

export const DiscoverPage = () => {
  const {
    resources,
    pagination,
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
    refresh,
  } = useResources();

  const browsingSectionRef = useRef(null);

  const scrollToBrowse = () => {
    browsingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Editorial Hero Section */}
      <section className="hero-section">
        <div className="page-container">
          <div className="hero-grid">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="hero-content">
              <span className="editorial-eyebrow">THE CAMPUS CIRCULAR</span>
              <h1>Good things deserve a second chapter.</h1>
              <p className="hero-description">
                LoopLearn connects campus students to donate, exchange, and lend textbooks,
                study notes, lab gear, and calculators. Keep good educational resources in
                circulation instead of buying everything new.
              </p>

              <div className="hero-cta-group">
                <Button variant="primary" onClick={scrollToBrowse}>
                  <span>Explore resources</span>
                  <ArrowDown size={16} />
                </Button>
                <Link to="/share" className="hero-share-link">
                  Have something to share?
                </Link>
              </div>

              <div className="hero-impact-note">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-brand-primary)' }} />
                <span>Pass along what you no longer need. Learn more together.</span>
              </div>
            </div>

            {/* Right Column: Handcrafted SVG Artwork */}
            <div className="hero-artwork">
              <CampusIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Resource Browsing Section */}
      <section className="resources-section" ref={browsingSectionRef}>
        <div className="page-container">
          <div className="section-header">
            <span className="editorial-eyebrow">GOOD FINDS, SHARED</span>
            <h2>Find your next useful thing.</h2>
          </div>

          {/* Real Filter & Search Bar */}
          <ResourceFilters
            filters={filters}
            onFilterChange={updateFilter}
            onResetFilters={resetFilters}
            totalResults={pagination.total}
          />

          {/* Results Metadata Count */}
          <div className="results-meta">
            <span>
              Showing <strong>{resources.length}</strong> of <strong>{pagination.total}</strong>{' '}
              academic resource{pagination.total === 1 ? '' : 's'}
            </span>
            {filters.category !== 'All' || filters.offerType !== 'All' || filters.search ? (
              <span style={{ color: 'var(--color-brand-primary)', fontWeight: 500 }}>
                Active filters applied
              </span>
            ) : null}
          </div>

          {error && <ErrorMessage message={error} onRetry={refresh} />}

          {/* Resource Cards Grid */}
          <ResourceGrid
            resources={resources}
            loading={loading}
            onResetFilters={resetFilters}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="page-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
              HOW IT WORKS
            </span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '0.5rem' }}>
              Resource circulation made simple.
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Three straightforward ways to share educational supplies across campus.
            </p>
          </div>

          <div className="how-steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <BookOpen size={20} color="var(--color-brand-primary)" />
                <h3>Find something useful</h3>
              </div>
              <p>
                Browse textbooks, lab equipment, notes, or calculators shared by fellow students.
                Filter by condition, category, or offer type.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Repeat size={20} color="var(--color-brand-primary)" />
                <h3>Share what you no longer need</h3>
              </div>
              <p>
                Post an item you’ve completed using. Choose whether you’d like to donate it for free,
                exchange for another resource, or lend for a semester.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Clock size={20} color="var(--color-brand-primary)" />
                <h3>Keep resources in circulation</h3>
              </div>
              <p>
                Arrange convenient on-campus handovers. Reduce student expenses and prevent usable
                materials from gathering dust or ending up in waste.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
