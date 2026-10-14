import { Resource } from '../models/Resource.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authorizeResourceOwner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const resource = await Resource.findById(id);
  if (!resource) {
    throw ApiError.notFound('Resource not found.');
  }

  // Check ownership
  if (resource.ownerId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You are not authorized to modify or delete this resource.');
  }

  // Attach found resource for use in controller
  req.resource = resource;
  next();
});
