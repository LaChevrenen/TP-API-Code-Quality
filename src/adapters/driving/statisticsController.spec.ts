import express from 'express';
import request from 'supertest';
import { createStatisticsRouter } from './statisticsController';
import { InMemoryUserRepo } from '../driven/inMemoryUserRepo';
import { InMemoryPartyRepo } from '../driven/inMemoryPartyRepo';
import { InMemoryCoordinateRepo } from '../driven/inMemoryCoordinateRepo';

describe('StatisticsController', () => {
  let app: express.Application;
  let userRepo: InMemoryUserRepo;
  let partyRepo: InMemoryPartyRepo;
  let coordinateRepo: InMemoryCoordinateRepo;

  beforeEach(() => {
    userRepo = new InMemoryUserRepo();
    partyRepo = new InMemoryPartyRepo();
    coordinateRepo = new InMemoryCoordinateRepo();
    app = express();
    app.use(express.json());
    app.use('/statistics', createStatisticsRouter(userRepo, partyRepo, coordinateRepo));
  });

  it('should return global statistics counts', async () => {
    const response = await request(app).get('/statistics');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('coordinates');
    expect(response.body).toHaveProperty('parties');
    expect(typeof response.body.users).toBe('number');
    expect(typeof response.body.coordinates).toBe('number');
    expect(typeof response.body.parties).toBe('number');
  });

  it('should return statistics for a city', async () => {
    const response = await request(app).get('/statistics/city/Lyon');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return statistics for a country', async () => {
    const response = await request(app).get('/statistics/country/France');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});