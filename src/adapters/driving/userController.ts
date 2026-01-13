import express from 'express';
import { InMemoryUserRepo } from '../driven/inMemoryUserRepo';
import { UserService } from '../../services/userService';
import { User } from '../../domain/user';

const router = express.Router();

const repo = new InMemoryUserRepo();
const service = new UserService(repo);

router.get('/', async (req, res) => {
  const list = await service.listUsers();
  res.json(list);
});

router.post('/', async (req, res) => {
  const { email, password, coordinate_id, party_id } = req.body;
  if (!email || !password || !coordinate_id) {
    return res.status(400).json({ message: 'email, password and coordinate_id required' });
  }
  const created = await service.createUser(new User(email, password, coordinate_id, party_id));
  res.status(201).json(created);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const found = await service.getUser(id);
  if (!found) return res.status(404).json({ message: 'Not found' });
  res.json(found);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { email, password, coordinate_id, party_id } = req.body;
  if (!email || !password || !coordinate_id) {
    return res.status(400).json({ message: 'email, password and coordinate_id required' });
  }
  const updated = await service.updateUser(id, new User(email, password, coordinate_id, party_id));
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const deleted = await service.deleteUser(id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
});

export default router;
