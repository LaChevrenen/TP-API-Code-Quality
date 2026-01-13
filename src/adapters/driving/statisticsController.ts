import express from 'express';
import { InMemoryUserRepo } from '../driven/inMemoryUserRepo.js';
import { InMemoryPartyRepo } from '../driven/inMemoryPartyRepo.js';
import { InMemoryCoordinateRepo } from '../driven/inMemoryCoordinateRepo.js';
import { StatisticsService } from '../../services/statisticsService';

const router = express.Router();

const userRepo = new InMemoryUserRepo();
const partyRepo = new InMemoryPartyRepo();
const coordinateRepo = new InMemoryCoordinateRepo();
const service = new StatisticsService(userRepo, partyRepo, coordinateRepo);

router.get('/city/:city', async (req, res) => {
  const city = req.params.city;
  const stats = await service.getStatisticsByCity(city);
  res.json(stats);
});

router.get('/country/:country', async (req, res) => {
  const country = req.params.country;
  const stats = await service.getStatisticsByCountry(country);
  res.json(stats);
});

export default router;
