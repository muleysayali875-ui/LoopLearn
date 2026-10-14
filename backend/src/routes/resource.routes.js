import { Router } from 'express';
import {
  getAllResources,
  getResource,
  createResourceListing,
  getMyResourceListings,
  updateResourceListing,
  deleteResourceListing,
} from '../controllers/resource.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeResourceOwner } from '../middleware/authorizeResourceOwner.js';
import {
  validateResourceId,
  validateCreateResourceInput,
  validateUpdateResourceInput,
} from '../validators/resource.validator.js';

const resourceRouter = Router();

// Public routes
resourceRouter.get('/', getAllResources);
// Authenticated user listings (defined before /:id)
resourceRouter.get('/mine', authenticate, getMyResourceListings);
resourceRouter.get('/:id', validateResourceId, getResource);

// Authenticated listing operations
resourceRouter.post('/', authenticate, validateCreateResourceInput, createResourceListing);
resourceRouter.patch(
  '/:id',
  authenticate,
  validateResourceId,
  authorizeResourceOwner,
  validateUpdateResourceInput,
  updateResourceListing
);
resourceRouter.delete(
  '/:id',
  authenticate,
  validateResourceId,
  authorizeResourceOwner,
  deleteResourceListing
);

export default resourceRouter;
