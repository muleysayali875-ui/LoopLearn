import mongoose from 'mongoose';

export const RESOURCE_CATEGORIES = [
  'Textbooks',
  'Study Notes',
  'Calculators & Electronics',
  'Lab & Academic Supplies',
  'Other',
];

export const RESOURCE_CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

export const OFFER_TYPES = ['Donate', 'Exchange', 'Lend'];

export const AVAILABILITY_STATUSES = [
  'Available',
  'Pending',
  'Exchanged',
  'Lent',
  'Donated',
];

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: RESOURCE_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: RESOURCE_CONDITIONS,
        message: '{VALUE} is not a valid condition',
      },
      index: true,
    },
    offerType: {
      type: String,
      required: [true, 'Offer type is required'],
      enum: {
        values: OFFER_TYPES,
        message: '{VALUE} is not a valid offer type',
      },
      index: true,
    },
    exchangePreference: {
      type: String,
      trim: true,
      maxlength: [200, 'Exchange preference cannot exceed 200 characters'],
      default: '',
    },
    borrowDuration: {
      type: String,
      trim: true,
      maxlength: [100, 'Borrow duration cannot exceed 100 characters'],
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location or campus is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    availability: {
      type: String,
      enum: {
        values: AVAILABILITY_STATUSES,
        message: '{VALUE} is not a valid availability status',
      },
      default: 'Available',
      index: true,
    },
    contactMethod: {
      type: String,
      trim: true,
      maxlength: [150, 'Contact method cannot exceed 150 characters'],
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resource must belong to a registered user'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for sorting and compound filters
resourceSchema.index({ createdAt: -1 });
resourceSchema.index({ offerType: 1, availability: 1, createdAt: -1 });
resourceSchema.index({ category: 1, availability: 1, createdAt: -1 });

// Full text search index on title and description
resourceSchema.index({ title: 'text', description: 'text' });

export const Resource = mongoose.model('Resource', resourceSchema);
