import { StatisticsService } from '../../services/statisticsService';
import { InMemoryUserRepo } from '../../adapters/driven/inMemoryUserRepo';
import { InMemoryPartyRepo } from '../../adapters/driven/inMemoryPartyRepo';
import { InMemoryCoordinateRepo } from '../../adapters/driven/inMemoryCoordinateRepo';

describe('StatisticsService Integration Tests', () => {
  let service: StatisticsService;
  let userRepo: InMemoryUserRepo;
  let partyRepo: InMemoryPartyRepo;
  let coordinateRepo: InMemoryCoordinateRepo;

  beforeEach(() => {
    userRepo = new InMemoryUserRepo();
    partyRepo = new InMemoryPartyRepo();
    coordinateRepo = new InMemoryCoordinateRepo();
    service = new StatisticsService(userRepo, partyRepo, coordinateRepo);
  });

  it('should aggregate users by party in a city', async () => {
    // Create coordinates
    const coord1 = await coordinateRepo.save({ city: 'Lyon', country: 'France' });

    // Create parties
    const ps = await partyRepo.save({ name: 'PS' });
    const lr = await partyRepo.save({ name: 'LR' });

    // Create users
    await userRepo.save({
      email: 'john@example.com',
      password: 'pass',
      coordinate_id: coord1.id!,
      party_id: ps.id
    });
    await userRepo.save({
      email: 'jane@example.com',
      password: 'pass',
      coordinate_id: coord1.id!,
      party_id: ps.id
    });
    await userRepo.save({
      email: 'bob@example.com',
      password: 'pass',
      coordinate_id: coord1.id!,
      party_id: lr.id
    });

    // Get statistics
    const stats = await service.getStatisticsByCity('Lyon');

    expect(stats).toHaveLength(2);
    expect(stats.find(s => s.party_name === 'PS')?.member_count).toBe(2);
    expect(stats.find(s => s.party_name === 'LR')?.member_count).toBe(1);
  });

  it('should aggregate users by party in a country', async () => {
    // Create multiple cities in same country
    const coord1 = await coordinateRepo.save({ city: 'Lyon', country: 'France' });
    const coord2 = await coordinateRepo.save({ city: 'Paris', country: 'France' });

    // Create parties
    const ps = await partyRepo.save({ name: 'PS' });
    const lr = await partyRepo.save({ name: 'LR' });

    // Create users in different cities
    await userRepo.save({
      email: 'john@example.com',
      password: 'pass',
      coordinate_id: coord1.id!,
      party_id: ps.id
    });
    await userRepo.save({
      email: 'jane@example.com',
      password: 'pass',
      coordinate_id: coord2.id!,
      party_id: ps.id
    });
    await userRepo.save({
      email: 'bob@example.com',
      password: 'pass',
      coordinate_id: coord1.id!,
      party_id: lr.id
    });

    // Get statistics
    const stats = await service.getStatisticsByCountry('France');

    expect(stats).toHaveLength(2);
    expect(stats.find(s => s.party_name === 'PS')?.member_count).toBe(2);
    expect(stats.find(s => s.party_name === 'LR')?.member_count).toBe(1);
  });

  it('should return empty array for city with no users', async () => {
    await coordinateRepo.save({ city: 'Lyon', country: 'France' });

    const stats = await service.getStatisticsByCity('Lyon');

    expect(stats).toEqual([]);
  });

  it('should return empty array for country with no users', async () => {
    await coordinateRepo.save({ city: 'Lyon', country: 'France' });

    const stats = await service.getStatisticsByCountry('France');

    expect(stats).toEqual([]);
  });

  it('should exclude users without party from statistics', async () => {
    // Create coordinate and party
    const coord = await coordinateRepo.save({ city: 'Lyon', country: 'France' });
    const ps = await partyRepo.save({ name: 'PS' });

    // Create users - one with party, one without
    await userRepo.save({
      email: 'john@example.com',
      password: 'pass',
      coordinate_id: coord.id!,
      party_id: ps.id
    });
    await userRepo.save({
      email: 'jane@example.com',
      password: 'pass',
      coordinate_id: coord.id! // No party_id
    });

    // Get statistics
    const stats = await service.getStatisticsByCity('Lyon');

    expect(stats).toHaveLength(1);
    expect(stats[0].member_count).toBe(1);
  });

  it('should handle complex multi-city multi-party scenario', async () => {
    // Create coordinates
    const lyon = await coordinateRepo.save({ city: 'Lyon', country: 'France' });
    const paris = await coordinateRepo.save({ city: 'Paris', country: 'France' });
    const madrid = await coordinateRepo.save({ city: 'Madrid', country: 'Spain' });

    // Create parties
    const ps = await partyRepo.save({ name: 'PS' });
    const lr = await partyRepo.save({ name: 'LR' });
    const pp = await partyRepo.save({ name: 'PP' });

    // Create users spread across cities and parties
    await userRepo.save({ email: 'u1@ex.com', password: 'p', coordinate_id: lyon.id!, party_id: ps.id });
    await userRepo.save({ email: 'u2@ex.com', password: 'p', coordinate_id: lyon.id!, party_id: ps.id });
    await userRepo.save({ email: 'u3@ex.com', password: 'p', coordinate_id: lyon.id!, party_id: lr.id });
    await userRepo.save({ email: 'u4@ex.com', password: 'p', coordinate_id: paris.id!, party_id: ps.id });
    await userRepo.save({ email: 'u5@ex.com', password: 'p', coordinate_id: madrid.id!, party_id: pp.id });

    // Test city statistics
    const lyonStats = await service.getStatisticsByCity('Lyon');
    expect(lyonStats).toHaveLength(2);
    expect(lyonStats.find(s => s.party_name === 'PS')?.member_count).toBe(2);

    // Test country statistics
    const franceStats = await service.getStatisticsByCountry('France');
    expect(franceStats).toHaveLength(2);
    expect(franceStats.find(s => s.party_name === 'PS')?.member_count).toBe(3);

    const spainStats = await service.getStatisticsByCountry('Spain');
    expect(spainStats).toHaveLength(1);
    expect(spainStats[0].party_name).toBe('PP');
  });
});
