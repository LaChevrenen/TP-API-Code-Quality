import { UserService } from '../../services/userService';
import { InMemoryUserRepo } from '../../adapters/driven/inMemoryUserRepo';
import { User } from '../../domain/user';

describe('UserService Integration Tests', () => {
  let service: UserService;
  let repo: InMemoryUserRepo;

  beforeEach(() => {
    repo = new InMemoryUserRepo();
    service = new UserService(repo);
  });

  it('should create and retrieve a user', async () => {
    const created = await service.createUser({
      email: 'john@example.com',
      password: 'secure123',
      coordinate_id: 'coord-1',
      party_id: 'party-1'
    });

    const found = await service.getUser(created.id!);

    expect(found).toEqual(created);
    expect(found?.email).toBe('john@example.com');
  });

  it('should list all users after creation', async () => {
    await service.createUser({
      email: 'john@example.com',
      password: 'pass1',
      coordinate_id: 'coord-1'
    });
    await service.createUser({
      email: 'jane@example.com',
      password: 'pass2',
      coordinate_id: 'coord-2'
    });

    const all = await service.listUsers();

    expect(all).toHaveLength(2);
  });

  it('should find a user by email', async () => {
    const created = await service.createUser({
      email: 'john@example.com',
      password: 'pass123',
      coordinate_id: 'coord-1'
    });

    const found = await service.getUserByEmail('john@example.com');

    expect(found).toEqual(created);
    expect(found?.email).toBe('john@example.com');
  });

  it('should return null when user email not found', async () => {
    await service.createUser({
      email: 'john@example.com',
      password: 'pass123',
      coordinate_id: 'coord-1'
    });

    const found = await service.getUserByEmail('unknown@example.com');

    expect(found).toBeNull();
  });

  it('should update a user', async () => {
    const created = await service.createUser({
      email: 'john@example.com',
      password: 'pass123',
      coordinate_id: 'coord-1'
    });

    const updated = await service.updateUser(created.id!, {
      email: 'john.updated@example.com',
      password: 'newpass456',
      coordinate_id: 'coord-2'
    });

    expect(updated?.email).toBe('john.updated@example.com');
    expect(updated?.coordinate_id).toBe('coord-2');

    const found = await service.getUser(created.id!);
    expect(found?.email).toBe('john.updated@example.com');
  });

  it('should delete a user', async () => {
    const created = await service.createUser({
      email: 'john@example.com',
      password: 'pass123',
      coordinate_id: 'coord-1'
    });

    const deleted = await service.deleteUser(created.id!);
    expect(deleted).toBe(true);

    const found = await service.getUser(created.id!);
    expect(found).toBeNull();
  });

  it('should handle user with optional party_id', async () => {
    const createdWithParty = await service.createUser({
      email: 'john@example.com',
      password: 'pass123',
      coordinate_id: 'coord-1',
      party_id: 'party-1'
    });

    const createdWithoutParty = await service.createUser({
      email: 'jane@example.com',
      password: 'pass123',
      coordinate_id: 'coord-1'
    });

    expect(createdWithParty.party_id).toBe('party-1');
    expect(createdWithoutParty.party_id).toBeUndefined();
  });

  it('should maintain user uniqueness by email through operations', async () => {
    await service.createUser({
      email: 'john@example.com',
      password: 'pass1',
      coordinate_id: 'coord-1'
    });
    await service.createUser({
      email: 'jane@example.com',
      password: 'pass2',
      coordinate_id: 'coord-2'
    });

    const all = await service.listUsers();
    const emails = all.map(u => u.email);

    expect(new Set(emails).size).toBe(2);
  });
});
