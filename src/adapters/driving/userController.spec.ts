import express from 'express';
import request from 'supertest';
import { createUserRouter } from './userController';
import { InMemoryUserRepo } from '../driven/inMemoryUserRepo';

describe('UserController', () => {
  let app: express.Application;
  let repo: InMemoryUserRepo;

  beforeEach(() => {
    repo = new InMemoryUserRepo();
    app = express();
    app.use(express.json());
    app.use('/users', createUserRouter(repo));
  });

  it('should create a user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'john@example.com',
        password: 'secure123',
        coordinate_id: 'coord-1'
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('john@example.com');
  });

  it('should return 400 when required field is missing', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'john@example.com' });

    expect(response.status).toBe(400);
  });

  it('should get a user by id', async () => {
    const created = await request(app)
      .post('/users')
      .send({
        email: 'john@example.com',
        password: 'secure123',
        coordinate_id: 'coord-1'
      });

    const response = await request(app).get(`/users/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('john@example.com');
  });

  it('should return 404 when user not found', async () => {
    const response = await request(app).get('/users/non-existent');

    expect(response.status).toBe(404);
  });

  it('should update a user', async () => {
    const created = await request(app)
      .post('/users')
      .send({
        email: 'john@example.com',
        password: 'secure123',
        coordinate_id: 'coord-1'
      });

    const response = await request(app)
      .put(`/users/${created.body.id}`)
      .send({
        email: 'john.updated@example.com',
        password: 'newpass',
        coordinate_id: 'coord-2'
      });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('john.updated@example.com');
  });

  it('should delete a user', async () => {
    const created = await request(app)
      .post('/users')
      .send({
        email: 'john@example.com',
        password: 'secure123',
        coordinate_id: 'coord-1'
      });

    const response = await request(app).delete(`/users/${created.body.id}`);

    expect(response.status).toBe(204);
  });
});