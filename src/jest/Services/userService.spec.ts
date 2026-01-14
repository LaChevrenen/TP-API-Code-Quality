import { UserService } from '../../services/userService';
import { User } from '../../domain/user';

describe('UserService', () => {
  let mockRepo: {
    findAll: jest.Mock<Promise<User[]>, []>;
    findById: jest.Mock<Promise<User | null>, [string]>;
    findByEmail: jest.Mock<Promise<User | null>, [string]>;
    save: jest.Mock<Promise<User>, [Omit<User, 'id'>]>;
    update: jest.Mock<Promise<User | null>, [string, Omit<User, 'id'>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let service: UserService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new UserService(mockRepo as any);
  });

  it('should return the list provided by the repo', async () => {
    const sample: User[] = [
      { id: '1', email: 'john@example.com', password: 'pass123', coordinate_id: 'coord-1', party_id: 'party-1' }
    ];
    mockRepo.findAll.mockResolvedValue(sample);
    await expect(service.listUsers()).resolves.toEqual(sample);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return the user when it exists', async () => {
    const user: User = { id: '1', email: 'john@example.com', password: 'pass123', coordinate_id: 'coord-1' };
    mockRepo.findById.mockResolvedValue(user);
    await expect(service.getUser('1')).resolves.toEqual(user);
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });

  it('should return null when the user is not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getUser('missing')).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });

  it('should return the user when found by email', async () => {
    const user: User = { id: '1', email: 'john@example.com', password: 'pass123', coordinate_id: 'coord-1' };
    mockRepo.findByEmail.mockResolvedValue(user);
    await expect(service.getUserByEmail('john@example.com')).resolves.toEqual(user);
    expect(mockRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
  });

  it('should return null when user is not found by email', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    await expect(service.getUserByEmail('unknown@example.com')).resolves.toBeNull();
    expect(mockRepo.findByEmail).toHaveBeenCalledWith('unknown@example.com');
  });

  it('should call save and return the created user', async () => {
    const input: Omit<User, 'id'> = { email: 'jane@example.com', password: 'pass456', coordinate_id: 'coord-2' };
    const saved: User = { id: '2', ...input };
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createUser(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
  });

  it('should update and return the modified user', async () => {
    const input: Omit<User, 'id'> = { email: 'john.updated@example.com', password: 'newpass', coordinate_id: 'coord-1' };
    const updated: User = { id: '1', ...input };
    mockRepo.update.mockResolvedValue(updated);
    await expect(service.updateUser('1', input)).resolves.toEqual(updated);
    expect(mockRepo.update).toHaveBeenCalledWith('1', input);
  });

  it('should return null when updating a non-existent user', async () => {
    const input: Omit<User, 'id'> = { email: 'test@example.com', password: 'pass', coordinate_id: 'coord-1' };
    mockRepo.update.mockResolvedValue(null);
    await expect(service.updateUser('missing', input)).resolves.toBeNull();
    expect(mockRepo.update).toHaveBeenCalledWith('missing', input);
  });

  it('should delete and return true when the user exists', async () => {
    mockRepo.delete.mockResolvedValue(true);
    await expect(service.deleteUser('1')).resolves.toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should return false when deleting a non-existent user', async () => {
    mockRepo.delete.mockResolvedValue(false);
    await expect(service.deleteUser('missing')).resolves.toBe(false);
    expect(mockRepo.delete).toHaveBeenCalledWith('missing');
  });
});
