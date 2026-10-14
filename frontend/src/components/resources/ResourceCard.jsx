import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { CategoryIllustration } from '../../assets/illustrations/CategoryIllustration.jsx';
import {
  ResourceOfferBadge,
  ResourceConditionBadge,
  ResourceAvailabilityBadge,
} from './ResourceStatusBadge.jsx';
import { formatDate } from '../../utils/formatDate.js';

export const ResourceCard = ({ resource }) => {
  const {
    _id,
    title,
    category,
    condition,
    offerType,
    description,
    location,
    availability,
    createdAt,
  } = resource;

  return (
    <article className="resource-card">
      <div className="card-top">
        <div className="card-category-illustration" aria-hidden="true">
          <CategoryIllustration category={category} size={28} />
        </div>
        <div className="badge-group">
          <ResourceOfferBadge offerType={offerType} />
          <ResourceConditionBadge condition={condition} />
          {availability !== 'Available' && (
            <ResourceAvailabilityBadge availability={availability} />
          )}
        </div>
      </div>

      <h3 className="card-title">
        <Link to={`/resources/${_id}`} style={{ color: 'inherit' }}>
          {title}
        </Link>
      </h3>

      <p className="card-description">{description}</p>

      <div className="card-footer">
        <div className="card-location" title={location}>
          <MapPin size={13} style={{ flexShrink: 0 }} />
          <span>{location}</span>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
          {formatDate(createdAt)}
        </span>

        <Link to={`/resources/${_id}`} className="card-link" aria-label={`View details for ${title}`}>
          <span>Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
};
