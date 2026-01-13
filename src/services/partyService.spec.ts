import { PartyService } from './partyService';
import { Party } from '../domain/party';

describe('PartyService', () => {
  let mockRepo: {
    findAll: jest.Mock<Promise<Party[]>, []>;
    findById: jest.Mock<Promise<Party | null>, [string]>;
    findByName: jest.Mock<Promise<Party | null>, [string]>;
    save: jest.Mock<Promise<Party>, [Omit<Party, 'id'>]>;
    update: jest.Mock<Promise<Party | null>, [string, Omit<Party, 'id'>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let service: PartyService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new PartyService(mockRepo as any);
  });

  it('should return the list provided by the repo', async () => {
    const sample: Party[] = [{ id: '1', name: 'PS' }];
    mockRepo.findAll.mockResolvedValue(sample);
    await expect(service.listParties()).resolves.toEqual(sample);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return the party when found by name', async () => {
    const party: Party = { id: '1', name: 'PS' };
    mockRepo.findByName.mockResolvedValue(party);
    await expect(service.listPartiesByName('PS')).resolves.toEqual(party);
    expect(mockRepo.findByName).toHaveBeenCalledWith('PS');
  });

  it('should return null when party is not found by name', async () => {
    mockRepo.findByName.mockResolvedValue(null);
    await expect(service.listPartiesByName('Unknown')).resolves.toBeNull();
    expect(mockRepo.findByName).toHaveBeenCalledWith('Unknown');
  });

  it('should return the party when it exists', async () => {
    const party: Party = { id: '1', name: 'PS' };
    mockRepo.findById.mockResolvedValue(party);
    await expect(service.getParty('1')).resolves.toEqual(party);
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });

  it('should return null when the party is not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getParty('missing')).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });

  it('should call save and return the created party', async () => {
    const input: Omit<Party, 'id'> = { name: 'LR' };
    const saved: Party = { id: '2', ...input };
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createParty(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
  });

  it('should update and return the modified party', async () => {
    const input: Omit<Party, 'id'> = { name: 'LREM' };
    const updated: Party = { id: '1', ...input };
    mockRepo.update.mockResolvedValue(updated);
    await expect(service.updateParty('1', input)).resolves.toEqual(updated);
    expect(mockRepo.update).toHaveBeenCalledWith('1', input);
  });

  it('should return null when updating a non-existent party', async () => {
    const input: Omit<Party, 'id'> = { name: 'FN' };
    mockRepo.update.mockResolvedValue(null);
    await expect(service.updateParty('missing', input)).resolves.toBeNull();
    expect(mockRepo.update).toHaveBeenCalledWith('missing', input);
  });

  it('should delete and return true when the party exists', async () => {
    mockRepo.delete.mockResolvedValue(true);
    await expect(service.deleteParty('1')).resolves.toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should return false when deleting a non-existent party', async () => {
    mockRepo.delete.mockResolvedValue(false);
    await expect(service.deleteParty('missing')).resolves.toBe(false);
    expect(mockRepo.delete).toHaveBeenCalledWith('missing');
  });
});
