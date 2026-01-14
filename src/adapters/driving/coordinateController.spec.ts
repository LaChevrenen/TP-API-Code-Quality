import express from 'express';
import request from 'supertest';
import { createCoordinateRouter } from './coordinateController';
import { InMemoryCoordinateRepo } from '../driven/inMemoryCoordinateRepo';

describe('CoordinateController', () => {
  let app: express.Application;
  let repo: InMemoryCoordinateRepo;

  beforeEach(() => {
    repo = new InMemoryCoordinateRepo();
    app = express();
    app.use(express.json());
    app.use('/coordinates', createCoordinateRouter(repo));
  });

  it('should create a coordinate', async () => {
    const response = await request(app)
      .post('/coordinates')
      .send({ city: 'Lyon', country: 'France' });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should return 400 when data is missing', async () => {
    const response = await request(app)
      .post('/coordinates')
      .send({ city: 'Lyon' });

    expect(response.status).toBe(400);
  });

  it('should get a coordinate by id', async () => {
    const created = await request(app)
      .post('/coordinates')
      .send({ city: 'Lyon', country: 'France' });

    const response = await request(app).get(`/coordinates/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.city).toBe('Lyon');
  });

  it('should return 404 when coordinate not found', async () => {
    const response = await request(app).get('/coordinates/non-existent');

    expect(response.status).toBe(404);
  });

  it('should update a coordinate', async () => {
    const created = await request(app)
      .post('/coordinates')
      .send({ city: 'Lyon', country: 'France' });

    const response = await request(app)
      .put(`/coordinates/${created.body.id}`)
      .send({ city: 'Marseille', country: 'France' });

    expect(response.status).toBe(200);
    expect(response.body.city).toBe('Marseille');
  });

  it('should delete a coordinate', async () => {
    const created = await request(app)
      .post('/coordinates')
      .send({ city: 'Lyon', country: 'France' });

    const response = await request(app).delete(`/coordinates/${created.body.id}`);

    expect(response.status).toBe(204);
  });
});