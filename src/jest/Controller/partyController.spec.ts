import express from 'express';
import request from 'supertest';
import { createPartyRouter } from '../../adapters/driving/partyController';
import { InMemoryPartyRepo } from '../../adapters/driven/inMemoryPartyRepo';

describe('PartyController', () => {
  let app: express.Application;
  let repo: InMemoryPartyRepo;

  beforeEach(() => {
    repo = new InMemoryPartyRepo();
    app = express();
    app.use(express.json());
    app.use('/parties', createPartyRouter(repo));
  });

  it('should create a party', async () => {
    const response = await request(app)
      .post('/parties')
      .send({ name: 'PS' });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/parties')
      .send({});

    expect(response.status).toBe(400);
  });

  it('should get a party by id', async () => {
    const created = await request(app)
      .post('/parties')
      .send({ name: 'PS' });

    const response = await request(app).get(`/parties/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('PS');
  });

  it('should return 404 when party not found', async () => {
    const response = await request(app).get('/parties/non-existent');

    expect(response.status).toBe(404);
  });

  it('should list all parties', async () => {
    await request(app).post('/parties').send({ name: 'PS' });
    await request(app).post('/parties').send({ name: 'LR' });

    const response = await request(app).get('/parties');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should update a party', async () => {
    const created = await request(app)
      .post('/parties')
      .send({ name: 'PS' });

    const response = await request(app)
      .put(`/parties/${created.body.id}`)
      .send({ name: 'Socialist Party' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Socialist Party');
  });

  it('should delete a party', async () => {
    const created = await request(app)
      .post('/parties')
      .send({ name: 'PS' });

    const response = await request(app).delete(`/parties/${created.body.id}`);

    expect(response.status).toBe(204);
  });
});