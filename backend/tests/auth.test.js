import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { User } from '../src/models/User.js';

const TEST_DB_URI = 'mongodb://127.0.0.1:27017/looplearnDB_test_auth';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/auth/register', () => {
  it('registers a new user with valid input and sets auth cookie', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@campus.edu',
        password: 'securepassword123',
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.name).toBe('Jane Doe');
    expect(res.body.data.user.email).toBe('jane@campus.edu');
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.token).toBeDefined();

    // Verify cookie was set
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.includes('token='))).toBe(true);
  });

  it('rejects registration with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'not-an-email',
        password: 'securepassword123',
      });

    expect(res.status).toBe(422);
    expect(res.body.status).toBe('fail');
    expect(res.body.errors).toBeDefined();
  });

  it('rejects registration with too short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@campus.edu',
        password: '123',
      });

    expect(res.status).toBe(422);
    expect(res.body.status).toBe('fail');
  });

  it('rejects registration when email already exists (duplicate prevention)', async () => {
    // First registration
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'First User',
        email: 'duplicate@campus.edu',
        password: 'password123',
      });

    // Duplicate registration
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second User',
        email: 'duplicate@campus.edu',
        password: 'anotherpassword',
      });

    expect(res.status).toBe(409);
    expect(res.body.status).toBe('fail');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'student@campus.edu',
        password: 'correctpassword',
      });
  });

  it('logs in with correct credentials and returns user and token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@campus.edu',
        password: 'correctpassword',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe('student@campus.edu');
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@campus.edu',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  it('rejects login for nonexistent account', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@campus.edu',
        password: 'somepassword',
      });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns current user profile when valid token is provided in Bearer header', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alice',
        email: 'alice@campus.edu',
        password: 'alicepassword',
      });

    const token = regRes.body.data.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.user.email).toBe('alice@campus.edu');
  });

  it('rejects /api/auth/me when no token is supplied', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects /api/auth/me when invalid token is supplied', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_garbage_token');

    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  it('clears token cookie and returns 200', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
