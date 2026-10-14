/**
 * Client-side validation helpers
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
};

export const validateResourceForm = (values) => {
  const errors = {};

  if (!values.title || values.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (values.title.trim().length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (!values.category) {
    errors.category = 'Please select a resource category.';
  }

  if (!values.condition) {
    errors.condition = 'Please select item condition.';
  }

  if (!values.offerType) {
    errors.offerType = 'Please select an offer type.';
  }

  if (!values.description || values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }

  if (!values.location || values.location.trim().length < 2) {
    errors.location = 'Please provide a campus or pickup location.';
  }

  if (values.offerType === 'Exchange') {
    if (!values.exchangePreference || values.exchangePreference.trim().length < 2) {
      errors.exchangePreference = 'Exchange listings require an exchange preference (what you want in return).';
    }
  }

  if (values.offerType === 'Lend') {
    if (!values.borrowDuration || values.borrowDuration.trim().length < 2) {
      errors.borrowDuration = 'Lend listings require a borrowing duration or return expectation.';
    }
  }

  return errors;
};
