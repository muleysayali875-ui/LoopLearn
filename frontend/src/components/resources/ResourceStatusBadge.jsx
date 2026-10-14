import React from 'react';

export const ResourceOfferBadge = ({ offerType }) => {
  const badgeClass =
    offerType === 'Donate'
      ? 'badge-donate'
      : offerType === 'Exchange'
      ? 'badge-exchange'
      : 'badge-lend';

  return <span className={`badge ${badgeClass}`}>{offerType}</span>;
};

export const ResourceConditionBadge = ({ condition }) => {
  return <span className="badge badge-condition">{condition}</span>;
};

export const ResourceAvailabilityBadge = ({ availability }) => {
  let badgeClass = 'badge-available';
  if (availability === 'Pending') {
    badgeClass = 'badge-pending';
  } else if (['Exchanged', 'Lent', 'Donated'].includes(availability)) {
    badgeClass = 'badge-completed';
  }

  return <span className={`badge ${badgeClass}`}>{availability}</span>;
};
