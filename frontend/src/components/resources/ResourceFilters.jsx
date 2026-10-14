import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Textbooks',
  'Study Notes',
  'Calculators & Electronics',
  'Lab & Academic Supplies',
  'Other',
];

const OFFER_TYPES = ['All', 'Donate', 'Exchange', 'Lend'];

const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title_asc', label: 'Title: A to Z' },
  { value: 'title_desc', label: 'Title: Z to A' },
];

export const ResourceFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  _totalResults = 0,
}) => {
  return (
    <div className="filter-bar" role="search" aria-label="Filter resources">
      {/* Search Input Row */}
      <div className="filter-search-row">
        <div className="search-input-wrapper">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            className="search-input"
            placeholder="Search by title or description (e.g. Calculus, lab coat, TI-84)..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            aria-label="Search resources"
          />
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-muted)',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        >
          Categories
        </span>
        <div className="pill-group">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill-btn ${filters.category === cat ? 'active' : ''}`}
              onClick={() => onFilterChange('category', cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Offer Type Pills & Dropdown Controls Row */}
      <div className="filter-controls-row">
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-muted)',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            Offer Type
          </span>
          <div className="pill-group">
            {OFFER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`pill-btn ${filters.offerType === type ? 'active' : ''}`}
                onClick={() => onFilterChange('offerType', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Condition & Sort Dropdowns */}
        <div className="filter-selects">
          <div>
            <label
              htmlFor="condition-filter"
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              Condition
            </label>
            <select
              id="condition-filter"
              className="select-control"
              value={filters.condition}
              onChange={(e) => onFilterChange('condition', e.target.value)}
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond === 'All' ? 'All conditions' : cond}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-filter"
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              Sort By
            </label>
            <select
              id="sort-filter"
              className="select-control"
              value={filters.sort}
              onChange={(e) => onFilterChange('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
