import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError.js';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CONDITIONS,
  OFFER_TYPES,
  AVAILABILITY_STATUSES,
} from '../models/Resource.js';

export const validateResourceId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest('Invalid resource ID format.'));
  }
  next();
};

export const validateCreateResourceInput = (req, res, next) => {
  const {
    title,
    category,
    description,
    condition,
    offerType,
    exchangePreference,
    borrowDuration,
    location,
    availability,
    contactMethod,
  } = req.body || {};

  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters long.' });
  } else if (title.trim().length > 120) {
    errors.push({ field: 'title', message: 'Title cannot exceed 120 characters.' });
  }

  // Category validation
  if (!category || !RESOURCE_CATEGORIES.includes(category)) {
    errors.push({
      field: 'category',
      message: `Category must be one of: ${RESOURCE_CATEGORIES.join(', ')}.`,
    });
  }

  // Description validation
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long.' });
  } else if (description.trim().length > 2000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 2000 characters.' });
  }

  // Condition validation
  if (!condition || !RESOURCE_CONDITIONS.includes(condition)) {
    errors.push({
      field: 'condition',
      message: `Condition must be one of: ${RESOURCE_CONDITIONS.join(', ')}.`,
    });
  }

  // Offer type validation & business rules
  if (!offerType || !OFFER_TYPES.includes(offerType)) {
    errors.push({
      field: 'offerType',
      message: `Offer type must be one of: ${OFFER_TYPES.join(', ')}.`,
    });
  } else {
    if (offerType === 'Exchange') {
      if (
        !exchangePreference ||
        typeof exchangePreference !== 'string' ||
        exchangePreference.trim().length < 2
      ) {
        errors.push({
          field: 'exchangePreference',
          message: 'Exchange listings require an exchange preference (what you want in return).',
        });
      }
    }

    if (offerType === 'Lend') {
      if (
        !borrowDuration ||
        typeof borrowDuration !== 'string' ||
        borrowDuration.trim().length < 2
      ) {
        errors.push({
          field: 'borrowDuration',
          message: 'Lend listings require a borrowing duration or return expectation (e.g. 2 weeks, 1 semester).',
        });
      }
    }
  }

  // Location validation
  if (!location || typeof location !== 'string' || location.trim().length < 2) {
    errors.push({ field: 'location', message: 'Location or campus is required (at least 2 characters).' });
  } else if (location.trim().length > 100) {
    errors.push({ field: 'location', message: 'Location cannot exceed 100 characters.' });
  }

  // Availability validation (optional on create, defaults to 'Available')
  if (availability && !AVAILABILITY_STATUSES.includes(availability)) {
    errors.push({
      field: 'availability',
      message: `Availability must be one of: ${AVAILABILITY_STATUSES.join(', ')}.`,
    });
  }

  if (errors.length > 0) {
    return next(ApiError.unprocessable('Resource validation failed', errors));
  }

  // Sanitize and normalize input
  req.body = {
    title: title.trim(),
    category,
    description: description.trim(),
    condition,
    offerType,
    exchangePreference: offerType === 'Exchange' && exchangePreference ? exchangePreference.trim() : '',
    borrowDuration: offerType === 'Lend' && borrowDuration ? borrowDuration.trim() : '',
    location: location.trim(),
    availability: availability || 'Available',
    contactMethod: contactMethod && typeof contactMethod === 'string' ? contactMethod.trim() : '',
  };

  next();
};

export const validateUpdateResourceInput = (req, res, next) => {
  const allowedFields = [
    'title',
    'category',
    'description',
    'condition',
    'offerType',
    'exchangePreference',
    'borrowDuration',
    'location',
    'availability',
    'contactMethod',
  ];

  const updates = {};
  const errors = [];
  const bodyKeys = Object.keys(req.body || {});

  if (bodyKeys.length === 0) {
    return next(ApiError.badRequest('No update data provided.'));
  }

  for (const key of bodyKeys) {
    if (!allowedFields.includes(key)) {
      continue; // Ignore or reject unexpected fields
    }
    const val = req.body[key];

    if (key === 'title') {
      if (typeof val !== 'string' || val.trim().length < 3) {
        errors.push({ field: 'title', message: 'Title must be at least 3 characters long.' });
      } else {
        updates.title = val.trim();
      }
    } else if (key === 'category') {
      if (!RESOURCE_CATEGORIES.includes(val)) {
        errors.push({ field: 'category', message: `Invalid category: ${val}` });
      } else {
        updates.category = val;
      }
    } else if (key === 'description') {
      if (typeof val !== 'string' || val.trim().length < 10) {
        errors.push({ field: 'description', message: 'Description must be at least 10 characters.' });
      } else {
        updates.description = val.trim();
      }
    } else if (key === 'condition') {
      if (!RESOURCE_CONDITIONS.includes(val)) {
        errors.push({ field: 'condition', message: `Invalid condition: ${val}` });
      } else {
        updates.condition = val;
      }
    } else if (key === 'offerType') {
      if (!OFFER_TYPES.includes(val)) {
        errors.push({ field: 'offerType', message: `Invalid offer type: ${val}` });
      } else {
        updates.offerType = val;
      }
    } else if (key === 'availability') {
      if (!AVAILABILITY_STATUSES.includes(val)) {
        errors.push({ field: 'availability', message: `Invalid availability: ${val}` });
      } else {
        updates.availability = val;
      }
    } else if (key === 'location') {
      if (typeof val !== 'string' || val.trim().length < 2) {
        errors.push({ field: 'location', message: 'Location must be at least 2 characters.' });
      } else {
        updates.location = val.trim();
      }
    } else if (key === 'exchangePreference') {
      updates.exchangePreference = typeof val === 'string' ? val.trim() : '';
    } else if (key === 'borrowDuration') {
      updates.borrowDuration = typeof val === 'string' ? val.trim() : '';
    } else if (key === 'contactMethod') {
      updates.contactMethod = typeof val === 'string' ? val.trim() : '';
    }
  }

  // Cross-field validation if offerType changed
  if (updates.offerType === 'Exchange' && !updates.exchangePreference && !req.body.exchangePreference) {
    errors.push({
      field: 'exchangePreference',
      message: 'Exchange listings require an exchange preference.',
    });
  }

  if (updates.offerType === 'Lend' && !updates.borrowDuration && !req.body.borrowDuration) {
    errors.push({
      field: 'borrowDuration',
      message: 'Lend listings require a borrowing duration.',
    });
  }

  if (errors.length > 0) {
    return next(ApiError.unprocessable('Update validation failed', errors));
  }

  req.sanitizedUpdates = updates;
  next();
};
