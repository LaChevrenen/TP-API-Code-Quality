import express from 'express';
import { InMemoryUserRepo } from '../driven/inMemoryUserRepo';
import { InMemoryPartyRepo } from '../driven/inMemoryPartyRepo';
import { InMemoryCoordinateRepo } from '../driven/inMemoryCoordinateRepo';
import { StatisticsService } from '../../services/statisticsService';

export function createStatisticsRouter(userRepo?: InMemoryUserRepo, partyRepo?: InMemoryPartyRepo, coordinateRepo?: InMemoryCoordinateRepo) {
  const _userRepo = userRepo || new InMemoryUserRepo();
  const _partyRepo = partyRepo || new InMemoryPartyRepo();
  const _coordinateRepo = coordinateRepo || new InMemoryCoordinateRepo();
  const service = new StatisticsService(_userRepo, _partyRepo, _coordinateRepo);

  const router = express.Router();

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

  return router;
}

export default createStatisticsRouter();