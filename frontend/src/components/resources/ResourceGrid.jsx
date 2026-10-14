import React from 'react';
import { ResourceCard } from './ResourceCard.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';

export const ResourceGrid = ({
  resources = [],
  loading = false,
  onResetFilters,
}) => {
  if (loading) {
    return <LoadingState message="Discovering campus resources..." />;
  }

  if (!resources || resources.length === 0) {
    return (
      <EmptyState
        title="No educational resources match your search"
        description="Try adjusting your keyword search, selecting 'All' categories, or clearing active filters."
        actionText="Reset filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="resource-grid" role="region" aria-label="Available Resources List">
      {resources.map((resource) => (
        <ResourceCard key={resource._id} resource={resource} />
      ))}
    </div>
  );
};
