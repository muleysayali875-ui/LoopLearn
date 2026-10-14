import { Resource } from '../models/Resource.js';
import { ApiError } from '../utils/apiError.js';

export const listResources = async (queryParams) => {
  const {
    search,
    category,
    offerType,
    condition,
    availability,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = queryParams;

  const query = {};

  // Text search on title and description
  if (search && search.trim()) {
    const term = search.trim();
    // Using regex for flexible substring matching across title and description
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ title: regex }, { description: regex }];
  }

  // Exact filters
  if (category && category !== 'All') {
    query.category = category;
  }

  if (offerType && offerType !== 'All') {
    query.offerType = offerType;
  }

  if (condition && condition !== 'All') {
    query.condition = condition;
  }

  if (availability && availability !== 'All') {
    query.availability = availability;
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // default newest
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'title_asc') {
    sortOption = { title: 1 };
  } else if (sort === 'title_desc') {
    sortOption = { title: -1 };
  }

  // Pagination bounds
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (parsedPage - 1) * parsedLimit;

  const [total, resources] = await Promise.all([
    Resource.countDocuments(query),
    Resource.find(query)
      .populate('ownerId', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
  ]);

  return {
    resources,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit) || 1,
    limit: parsedLimit,
  };
};

export const getResourceById = async (id) => {
  const resource = await Resource.findById(id)
    .populate('ownerId', 'name')
    .lean();

  if (!resource) {
    throw ApiError.notFound('Resource not found.');
  }

  return resource;
};

export const createResource = async (resourceData, userId) => {
  const resource = await Resource.create({
    ...resourceData,
    ownerId: userId,
  });

  return resource.populate('ownerId', 'name');
};

export const getMyResources = async (userId) => {
  return Resource.find({ ownerId: userId })
    .populate('ownerId', 'name')
    .sort({ createdAt: -1 })
    .lean();
};

export const updateResource = async (resourceId, updates) => {
  const updated = await Resource.findByIdAndUpdate(
    resourceId,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('ownerId', 'name');

  if (!updated) {
    throw ApiError.notFound('Resource not found.');
  }

  return updated;
};

export const deleteResource = async (resourceId) => {
  const result = await Resource.findByIdAndDelete(resourceId);
  if (!result) {
    throw ApiError.notFound('Resource not found.');
  }
  return result;
};
