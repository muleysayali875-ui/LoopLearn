import React, { useState } from 'react';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Button } from '../ui/Button.jsx';
import { validateResourceForm } from '../../utils/validation.js';

const CATEGORIES = [
  'Textbooks',
  'Study Notes',
  'Calculators & Electronics',
  'Lab & Academic Supplies',
  'Other',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const OFFER_TYPES = ['Donate', 'Exchange', 'Lend'];
const AVAILABILITY_STATUSES = ['Available', 'Pending', 'Exchanged', 'Lent', 'Donated'];

export const ResourceForm = ({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Publish Resource',
  isEdit = false,
}) => {
  const [values, setValues] = useState({
    title: initialValues.title || '',
    category: initialValues.category || 'Textbooks',
    offerType: initialValues.offerType || 'Donate',
    condition: initialValues.condition || 'Good',
    description: initialValues.description || '',
    location: initialValues.location || '',
    availability: initialValues.availability || 'Available',
    exchangePreference: initialValues.exchangePreference || '',
    borrowDuration: initialValues.borrowDuration || '',
    contactMethod: initialValues.contactMethod || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-level error on change
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateResourceForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <Input
        label="Resource Title"
        id="title"
        placeholder="e.g. Stewart Calculus 8th Edition or Casio FX-991EX"
        value={values.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
      />

      {/* Category and Condition Row */}
      <div className="form-row-2">
        <Select
          label="Category"
          id="category"
          options={CATEGORIES}
          value={values.category}
          onChange={(e) => handleChange('category', e.target.value)}
          error={errors.category}
          required
        />

        <Select
          label="Condition"
          id="condition"
          options={CONDITIONS}
          value={values.condition}
          onChange={(e) => handleChange('condition', e.target.value)}
          error={errors.condition}
          required
        />
      </div>

      {/* Offer Type */}
      <div className="form-row-2">
        <Select
          label="Offer Type"
          id="offerType"
          options={OFFER_TYPES}
          value={values.offerType}
          onChange={(e) => handleChange('offerType', e.target.value)}
          error={errors.offerType}
          required
        />

        {isEdit && (
          <Select
            label="Availability Status"
            id="availability"
            options={AVAILABILITY_STATUSES}
            value={values.availability}
            onChange={(e) => handleChange('availability', e.target.value)}
            error={errors.availability}
            required
          />
        )}
      </div>

      {/* Dynamic Conditional Fields based on Offer Type */}
      {values.offerType === 'Exchange' && (
        <Input
          label="What are you looking to exchange this for?"
          id="exchangePreference"
          placeholder="e.g. Seeking Algorithms textbook or organic chemistry model set"
          hint="Required for Exchange listings"
          value={values.exchangePreference}
          onChange={(e) => handleChange('exchangePreference', e.target.value)}
          error={errors.exchangePreference}
          required
        />
      )}

      {values.offerType === 'Lend' && (
        <Input
          label="Borrowing Duration & Expectations"
          id="borrowDuration"
          placeholder="e.g. Available for 2 weeks during midterms, return clean"
          hint="Required for Lend listings"
          value={values.borrowDuration}
          onChange={(e) => handleChange('borrowDuration', e.target.value)}
          error={errors.borrowDuration}
          required
        />
      )}

      {/* Description */}
      <Textarea
        label="Description & Details"
        id="description"
        rows={4}
        placeholder="Provide helpful details: textbook edition, subject, any markings, wear, or included accessories..."
        value={values.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        required
      />

      {/* Location / Campus */}
      <Input
        label="Pickup Location or Campus Building"
        id="location"
        placeholder="e.g. Science Library, North Quad, or Engineering Hall"
        value={values.location}
        onChange={(e) => handleChange('location', e.target.value)}
        error={errors.location}
        required
      />

      {/* Contact Method */}
      <Input
        label="Approved Public Contact Method (Optional)"
        id="contactMethod"
        placeholder="e.g. Campus email, Student Discord tag, or preferred campus meetup spot"
        hint="Only share contact info you are comfortable having other students view"
        value={values.contactMethod}
        onChange={(e) => handleChange('contactMethod', e.target.value)}
        error={errors.contactMethod}
      />

      <div style={{ marginTop: '2rem' }}>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          style={{ width: '100%', padding: '0.85rem' }}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
