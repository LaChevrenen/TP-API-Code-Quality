import { PartyService } from '../../services/partyService';
import { InMemoryPartyRepo } from '../../adapters/driven/inMemoryPartyRepo';
import { Party } from '../../domain/party';

describe('PartyService Integration Tests', () => {
  let service: PartyService;
  let repo: InMemoryPartyRepo;

  beforeEach(() => {
    repo = new InMemoryPartyRepo();
    service = new PartyService(repo);
  });

  it('should create and retrieve a party', async () => {
    const created = await service.createParty({ name: 'PS' });

    const found = await service.getParty(created.id!);

    expect(found).toEqual(created);
    expect(found?.name).toBe('PS');
  });

  it('should list all parties after creation', async () => {
    await service.createParty({ name: 'PS' });
    await service.createParty({ name: 'LR' });
    await service.createParty({ name: 'LREM' });

    const all = await service.listParties();

    expect(all).toHaveLength(3);
  });

  it('should find a party by name', async () => {
    await service.createParty({ name: 'PS' });
    await service.createParty({ name: 'LR' });

    const found = await service.listPartiesByName('PS');

    expect(found?.name).toBe('PS');
  });

  it('should return null when party name not found', async () => {
    await service.createParty({ name: 'PS' });

    const found = await service.listPartiesByName('FN');

    expect(found).toBeNull();
  });

  it('should update a party', async () => {
    const created = await service.createParty({ name: 'PS' });

    const updated = await service.updateParty(created.id!, { name: 'Socialist Party' });

    expect(updated?.name).toBe('Socialist Party');
    expect(updated?.id).toBe(created.id);

    const found = await service.getParty(created.id!);
    expect(found?.name).toBe('Socialist Party');
  });

  it('should delete a party', async () => {
    const created = await service.createParty({ name: 'PS' });

    const deleted = await service.deleteParty(created.id!);
    expect(deleted).toBe(true);

    const found = await service.getParty(created.id!);
    expect(found).toBeNull();
  });

  it('should maintain party integrity across operations', async () => {
    const party1 = await service.createParty({ name: 'PS' });
    const party2 = await service.createParty({ name: 'LR' });

    await service.deleteParty(party1.id!);

    const all = await service.listParties();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe('LR');
  });
});
