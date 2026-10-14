import {
  listResources,
  getResourceById,
  createResource,
  getMyResources,
  updateResource,
  deleteResource,
} from '../services/resource.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllResources = asyncHandler(async (req, res) => {
  const result = await listResources(req.query);

  res.status(200).json({
    status: 'success',
    data: {
      resources: result.resources,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: result.limit,
      },
    },
  });
});

export const getResource = asyncHandler(async (req, res) => {
  const resource = await getResourceById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      resource,
    },
  });
});

export const createResourceListing = asyncHandler(async (req, res) => {
  const resource = await createResource(req.body, req.user._id);

  res.status(201).json({
    status: 'success',
    message: 'Resource listed successfully.',
    data: {
      resource,
    },
  });
});

export const getMyResourceListings = asyncHandler(async (req, res) => {
  const resources = await getMyResources(req.user._id);

  res.status(200).json({
    status: 'success',
    data: {
      resources,
      count: resources.length,
    },
  });
});

export const updateResourceListing = asyncHandler(async (req, res) => {
  const resource = await updateResource(req.resource._id, req.sanitizedUpdates);

  res.status(200).json({
    status: 'success',
    message: 'Resource updated successfully.',
    data: {
      resource,
    },
  });
});

export const deleteResourceListing = asyncHandler(async (req, res) => {
  await deleteResource(req.resource._id);

  res.status(200).json({
    status: 'success',
    message: 'Resource successfully deleted.',
  });
});
