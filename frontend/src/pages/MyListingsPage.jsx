import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, ExternalLink, AlertTriangle, PackageOpen } from 'lucide-react';
import {
  getMyResourcesApi,
  updateResourceApi,
  deleteResourceApi,
} from '../services/resources.api.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  ResourceOfferBadge,
  ResourceConditionBadge,
  ResourceAvailabilityBadge,
} from '../components/resources/ResourceStatusBadge.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { ResourceForm } from '../components/resources/ResourceForm.jsx';
import { Button } from '../components/ui/Button.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { ErrorMessage } from '../components/ui/ErrorMessage.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { formatDate } from '../utils/formatDate.js';

export const MyListingsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [myResources, setMyResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [editingResource, setEditingResource] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // Delete Confirmation Modal State
  const [deletingResource, setDeletingResource] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchMyListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyResourcesApi();
      setMyResources(response.data.resources || []);
    } catch (err) {
      setError(err.message || 'Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login?redirect=/my-listings');
      } else {
        fetchMyListings();
      }
    }
  }, [authLoading, isAuthenticated, navigate, fetchMyListings]);

  // Handle Edit Submit
  const handleEditSubmit = async (formValues) => {
    if (!editingResource) return;
    setEditSubmitting(true);
    setEditError(null);

    try {
      await updateResourceApi(editingResource._id, formValues);
      setEditingResource(null);
      await fetchMyListings();
    } catch (err) {
      setEditError(err.message || 'Failed to update resource.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingResource) return;
    setDeleteSubmitting(true);
    setDeleteError(null);

    try {
      await deleteResourceApi(deletingResource._id);
      setDeletingResource(null);
      await fetchMyListings();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete resource.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  if (authLoading || (loading && myResources.length === 0)) {
    return (
      <div className="page-container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingState message="Loading your resource listings..." />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span className="editorial-eyebrow">DASHBOARD</span>
          <h1 style={{ fontSize: '2.4rem', marginTop: '0.4rem' }}>My Shared Resources</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Manage availability, update details, or remove resources you've posted.
          </p>
        </div>

        <Link to="/share">
          <Button variant="primary">
            <PlusCircle size={16} />
            <span>Post New Listing</span>
          </Button>
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchMyListings} />}

      {myResources.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="You haven't posted any resources yet"
          description="Have textbooks, calculators, or study notes you no longer need? Pass them on to another student."
          actionText="Share your first resource"
          onAction={() => navigate('/share')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {myResources.map((item) => (
            <div
              key={item._id}
              style={{
                backgroundColor: 'var(--color-surface-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <ResourceOfferBadge offerType={item.offerType} />
                  <ResourceConditionBadge condition={item.condition} />
                  <ResourceAvailabilityBadge availability={item.availability} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
                  <Link to={`/resources/${item._id}`} style={{ color: 'inherit' }}>
                    {item.title}
                  </Link>
                </h3>

                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '0.5rem',
                    lineHeight: '1.5',
                  }}
                >
                  {item.description.length > 130
                    ? `${item.description.substring(0, 130)}...`
                    : item.description}
                </p>

                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                  Location: <strong>{item.location}</strong>
                  {item.offerType === 'Exchange' && item.exchangePreference && (
                    <span> &bull; Wanted: <strong>{item.exchangePreference}</strong></span>
                  )}
                  {item.offerType === 'Lend' && item.borrowDuration && (
                    <span> &bull; Duration: <strong>{item.borrowDuration}</strong></span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <Link to={`/resources/${item._id}`} title="View public listing">
                  <Button variant="secondary" size="sm">
                    <ExternalLink size={14} />
                    <span>View</span>
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingResource(item);
                    setEditError(null);
                  }}
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setDeletingResource(item);
                    setDeleteError(null);
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Listing Modal */}
      <Modal
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
        title="Edit Resource Listing"
        maxWidth="640px"
      >
        {editError && <ErrorMessage message={editError} />}
        {editingResource && (
          <ResourceForm
            initialValues={editingResource}
            onSubmit={handleEditSubmit}
            isSubmitting={editSubmitting}
            submitLabel="Save Changes"
            isEdit={true}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingResource}
        onClose={() => setDeletingResource(null)}
        title="Confirm Deletion"
        maxWidth="460px"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingResource(null)}
              disabled={deleteSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={deleteSubmitting}
            >
              Delete Listing
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              padding: '0.5rem',
              backgroundColor: 'var(--color-error-bg)',
              color: 'var(--color-error-text)',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
              Are you sure you want to permanently delete{' '}
              <strong>"{deletingResource?.title}"</strong>?
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              This will remove the listing from campus search and student discovery. This action
              cannot be undone.
            </p>
          </div>
        </div>
        {deleteError && <ErrorMessage message={deleteError} />}
      </Modal>
    </div>
  );
};
