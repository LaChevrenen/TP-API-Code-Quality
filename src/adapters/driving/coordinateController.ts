import express from 'express';
import { InMemoryCoordinateRepo } from '../driven/inMemoryCoordinateRepo';
import { CoordinateService } from '../../services/coordinateService';

export function createCoordinateRouter(repo?: InMemoryCoordinateRepo) {
  const coordinateRepo = repo || new InMemoryCoordinateRepo();
  const service = new CoordinateService(coordinateRepo);

  const router = express.Router();

  router.post('/', async (req, res) => {
    const { city, country } = req.body;
    if (!city || !country) {
      return res.status(400).json({ message: 'city and country required' });
    }
    const created = await service.createCoordinate({ city, country });
    res.status(201).json({ id: created.id });
  });

  router.get('/', async (req, res) => {
    const { city, country } = req.query;
    if (city && typeof city === 'string') {
      const list = await service.listCoordinatesByCity(city);
      return res.json(list);
    }
    if (country && typeof country === 'string') {
      const list = await service.listCoordinatesByCountry(country);
      return res.json(list);
    }
    const list = await service.listCoordinates();
    res.json(list);
  });

  // Routes spécifiques AVANT la route générique /:id
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const found = await service.getCoordinate(id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    res.json(found);
  });

  router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { city, country } = req.body;
    if (!city || !country) {
      return res.status(400).json({ message: 'city and country required' });
    }
    const updated = await service.updateCoordinate(id, { city, country });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  });

  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const deleted = await service.deleteCoordinate(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  });

  return router;
}

export default createCoordinateRouter();