import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { Resource } from '../src/models/Resource.js';

const TEST_DB_URI = 'mongodb://127.0.0.1:27017/looplearnDB_test_resources';

let user1Token = null;
let user1Id = null;
let user2Token = null;
let user2Id = null;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Resource.deleteMany({});
  await User.deleteMany({});

  // Create User 1
  const u1 = await request(app).post('/api/auth/register').send({
    name: 'User One',
    email: 'user1@campus.edu',
    password: 'password123',
  });
  user1Token = u1.body.data.token;
  user1Id = u1.body.data.user._id;

  // Create User 2
  const u2 = await request(app).post('/api/auth/register').send({
    name: 'User Two',
    email: 'user2@campus.edu',
    password: 'password123',
  });
  user2Token = u2.body.data.token;
  user2Id = u2.body.data.user._id;
});

describe('POST /api/resources', () => {
  it('creates a Donate resource when authenticated', async () => {
    const res = await request(app)
      .post('/api/resources')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Organic Chemistry 2nd Edition',
        category: 'Textbooks',
        description: 'Hardcover textbook in good condition with minor highlighting.',
        condition: 'Good',
        offerType: 'Donate',
        location: 'Science Library',
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.resource.title).toBe('Organic Chemistry 2nd Edition');
    expect(res.body.data.resource.availability).toBe('Available');
  });

  it('rejects Exchange resource when exchangePreference is missing', async () => {
    const res = await request(app)
      .post('/api/resources')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Graphing Calculator TI-84',
        category: 'Calculators & Electronics',
        description: 'Working calculator, comes with slide case and cables.',
        condition: 'Like New',
        offerType: 'Exchange',
        location: 'Engineering Hall',
      });

    expect(res.status).toBe(422);
    expect(res.body.status).toBe('fail');
  });

  it('creates an Exchange resource when exchangePreference is provided', async () => {
    const res = await request(app)
      .post('/api/resources')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Graphing Calculator TI-84',
        category: 'Calculators & Electronics',
        description: 'Working calculator, comes with slide case and cables.',
        condition: 'Like New',
        offerType: 'Exchange',
        exchangePreference: 'Looking for Statistics textbook or scientific calculator',
        location: 'Engineering Hall',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.resource.exchangePreference).toContain('Statistics textbook');
  });

  it('rejects Lend resource when borrowDuration is missing', async () => {
    const res = await request(app)
      .post('/api/resources')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Microscope Slide Set',
        category: 'Lab & Academic Supplies',
        description: 'Set of 50 biology prepared slides for lab coursework.',
        condition: 'Good',
        offerType: 'Lend',
        location: 'Bio Lab',
      });

    expect(res.status).toBe(422);
  });

  it('creates a Lend resource when borrowDuration is provided', async () => {
    const res = await request(app)
      .post('/api/resources')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Microscope Slide Set',
        category: 'Lab & Academic Supplies',
        description: 'Set of 50 biology prepared slides for lab coursework.',
        condition: 'Good',
        offerType: 'Lend',
        borrowDuration: '2 weeks for biology practicals',
        location: 'Bio Lab',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.resource.borrowDuration).toBe('2 weeks for biology practicals');
  });

  it('rejects resource creation without authentication', async () => {
    const res = await request(app)
      .post('/api/resources')
      .send({
        title: 'Unauthorized Textbook',
        category: 'Textbooks',
        description: 'This listing should not be created without auth.',
        condition: 'New',
        offerType: 'Donate',
        location: 'Campus Center',
      });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/resources and filtering', () => {
  beforeEach(async () => {
    await Resource.create([
      {
        title: 'Linear Algebra and Its Applications',
        category: 'Textbooks',
        description: 'Gilbert Strang 4th edition. Complete with exercises.',
        condition: 'Good',
        offerType: 'Donate',
        location: 'Math Building',
        availability: 'Available',
        ownerId: user1Id,
      },
      {
        title: 'Data Structures and Algorithms Revision Notes',
        category: 'Study Notes',
        description: 'Comprehensive handwritten summaries for CS201 exams.',
        condition: 'Like New',
        offerType: 'Donate',
        location: 'Computer Center',
        availability: 'Available',
        ownerId: user1Id,
      },
      {
        title: 'Casio Scientific Calculator FX-991',
        category: 'Calculators & Electronics',
        description: 'Working scientific calculator with battery and cover.',
        condition: 'Like New',
        offerType: 'Lend',
        borrowDuration: '1 month',
        location: 'Engineering Library',
        availability: 'Available',
        ownerId: user2Id,
      },
    ]);
  });

  it('lists all resources with pagination metadata', async () => {
    const res = await request(app).get('/api/resources');

    expect(res.status).toBe(200);
    expect(res.body.data.resources.length).toBe(3);
    expect(res.body.data.pagination.total).toBe(3);
  });

  it('filters resources by category', async () => {
    const res = await request(app).get('/api/resources?category=Study+Notes');

    expect(res.status).toBe(200);
    expect(res.body.data.resources.length).toBe(1);
    expect(res.body.data.resources[0].title).toContain('Data Structures');
  });

  it('filters resources by offerType', async () => {
    const res = await request(app).get('/api/resources?offerType=Lend');

    expect(res.status).toBe(200);
    expect(res.body.data.resources.length).toBe(1);
    expect(res.body.data.resources[0].offerType).toBe('Lend');
  });

  it('searches resources by keyword in title or description', async () => {
    const res = await request(app).get('/api/resources?search=algebra');

    expect(res.status).toBe(200);
    expect(res.body.data.resources.length).toBe(1);
    expect(res.body.data.resources[0].title).toContain('Linear Algebra');
  });
});

describe('GET /api/resources/:id and GET /api/resources/mine', () => {
  let createdResourceId = null;

  beforeEach(async () => {
    const res = await Resource.create({
      title: 'Physics Lab Coat Size M',
      category: 'Lab & Academic Supplies',
      description: 'Clean white lab coat, knee length, no stains.',
      condition: 'Good',
      offerType: 'Donate',
      location: 'Science Quad',
      availability: 'Available',
      ownerId: user1Id,
    });
    createdResourceId = res._id.toString();
  });

  it('retrieves single resource by valid ID', async () => {
    const res = await request(app).get(`/api/resources/${createdResourceId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.resource.title).toBe('Physics Lab Coat Size M');
    expect(res.body.data.resource.ownerId.name).toBe('User One');
  });

  it('returns 400 for malformed resource ID', async () => {
    const res = await request(app).get('/api/resources/invalid_id_format');
    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent valid ObjectId', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/resources/${nonExistentId}`);
    expect(res.status).toBe(404);
  });

  it('returns only current user listings at /api/resources/mine', async () => {
    const res = await request(app)
      .get('/api/resources/mine')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.resources.length).toBe(1);
    expect(res.body.data.resources[0]._id.toString()).toBe(createdResourceId);
  });
});

describe('PATCH and DELETE /api/resources/:id ownership security', () => {
  let resourceId = null;

  beforeEach(async () => {
    const r = await Resource.create({
      title: 'Chemistry Molecular Model Set',
      category: 'Lab & Academic Supplies',
      description: 'Complete molecular modeling kit for stereochemistry.',
      condition: 'Like New',
      offerType: 'Donate',
      location: 'Chemistry Lab',
      availability: 'Available',
      ownerId: user1Id,
    });
    resourceId = r._id.toString();
  });

  it('allows owner (user1) to update listing', async () => {
    const res = await request(app)
      .patch(`/api/resources/${resourceId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        availability: 'Pending',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.resource.availability).toBe('Pending');
  });

  it('rejects update from a non-owner (user2) with 403 Forbidden', async () => {
    const res = await request(app)
      .patch(`/api/resources/${resourceId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        availability: 'Donated',
      });

    expect(res.status).toBe(403);
    expect(res.body.status).toBe('fail');
  });

  it('rejects deletion from a non-owner (user2) with 403 Forbidden', async () => {
    const res = await request(app)
      .delete(`/api/resources/${resourceId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(403);
  });

  it('allows owner (user1) to delete listing', async () => {
    const res = await request(app)
      .delete(`/api/resources/${resourceId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');

    // Confirm deletion in database
    const verify = await Resource.findById(resourceId);
    expect(verify).toBeNull();
  });
});
