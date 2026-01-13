import express from 'express';
import { InMemoryPartyRepo } from '../driven/inMemoryPartyRepo';
import { PartyService } from '../../services/partyService';
import { Party } from '../../domain/party';

const router = express.Router();

const repo = new InMemoryPartyRepo();
const service = new PartyService(repo);

router.get('/', async (req, res) => {
  const { name } = req.query;
  if (name && typeof name === 'string') {
    const found = await service.listPartiesByName(name);
    return res.json(found ? [found] : []);
  }
  const list = await service.listParties();
  res.json(list);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'name required' });
  }
  const created = await service.createParty(new Party(name));
  res.status(201).json(created);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const found = await service.getParty(id);
  if (!found) return res.status(404).json({ message: 'Not found' });
  res.json(found);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'name required' });
  }
  const updated = await service.updateParty(id, new Party(name));
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const deleted = await service.deleteParty(id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
});

export default router;
