import { StatisticsService } from './statisticsService';
import { PartyAggregateCity, PartyAggregateCountry } from '../domain/partyAggregate';
import { User } from '../domain/user';
import { Party } from '../domain/party';
import { Coordinate } from '../domain/coordinate';

describe('StatisticsService', () => {
  let mockUserRepo: {
    findAll: jest.Mock<Promise<User[]>, []>;
    findById: jest.Mock<Promise<User | null>, [string]>;
    findByEmail: jest.Mock<Promise<User | null>, [string]>;
    save: jest.Mock<Promise<User>, [Omit<User, 'id'>]>;
    update: jest.Mock<Promise<User | null>, [string, Omit<User, 'id'>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let mockPartyRepo: {
    findAll: jest.Mock<Promise<Party[]>, []>;
    findById: jest.Mock<Promise<Party | null>, [string]>;
    findByName: jest.Mock<Promise<Party | null>, [string]>;
    save: jest.Mock<Promise<Party>, [Omit<Party, 'id'>]>;
    update: jest.Mock<Promise<Party | null>, [string, Omit<Party, 'id'>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let mockCoordinateRepo: {
    findAll: jest.Mock<Promise<Coordinate[]>, []>;
    findById: jest.Mock<Promise<Coordinate | null>, [string]>;
    findByCity: jest.Mock<Promise<Coordinate[]>, [string]>;
    findByCountry: jest.Mock<Promise<Coordinate[]>, [string]>;
    save: jest.Mock<Promise<Coordinate>, [Omit<Coordinate, 'id'>]>;
    update: jest.Mock<Promise<Coordinate | null>, [string, Omit<Coordinate, 'id'>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let service: StatisticsService;

  beforeEach(() => {
    mockUserRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockPartyRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockCoordinateRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCity: jest.fn(),
      findByCountry: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new StatisticsService(mockUserRepo as any, mockPartyRepo as any, mockCoordinateRepo as any);
  });

  it('should return aggregated statistics by city', async () => {
    const coordinates: Coordinate[] = [{ id: 'coord-1', city: 'Lyon', country: 'France' }];
    const users: User[] = [
      { id: 'user-1', email: 'john@example.com', password: 'pass', coordinate_id: 'coord-1', party_id: 'party-1' },
      { id: 'user-2', email: 'jane@example.com', password: 'pass', coordinate_id: 'coord-1', party_id: 'party-1' },
      { id: 'user-3', email: 'bob@example.com', password: 'pass', coordinate_id: 'coord-1', party_id: 'party-2' },
    ];
    const party1: Party = { id: 'party-1', name: 'PS' };
    const party2: Party = { id: 'party-2', name: 'LR' };

    mockCoordinateRepo.findByCity.mockResolvedValue(coordinates);
    mockUserRepo.findAll.mockResolvedValue(users);
    mockPartyRepo.findById.mockImplementation(async (id) => {
      if (id === 'party-1') return party1;
      if (id === 'party-2') return party2;
      return null;
    });

    const result = await service.getStatisticsByCity('Lyon');

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(new PartyAggregateCity('PS', 'Lyon', 2));
    expect(result).toContainEqual(new PartyAggregateCity('LR', 'Lyon', 1));
  });

  it('should return empty array when no users in city', async () => {
    const coordinates: Coordinate[] = [{ id: 'coord-1', city: 'Lyon', country: 'France' }];
    const users: User[] = [];

    mockCoordinateRepo.findByCity.mockResolvedValue(coordinates);
    mockUserRepo.findAll.mockResolvedValue(users);

    const result = await service.getStatisticsByCity('Lyon');

    expect(result).toEqual([]);
  });

  it('should return aggregated statistics by country', async () => {
    const coordinates: Coordinate[] = [
      { id: 'coord-1', city: 'Lyon', country: 'France' },
      { id: 'coord-2', city: 'Paris', country: 'France' }
    ];
    const users: User[] = [
      { id: 'user-1', email: 'john@example.com', password: 'pass', coordinate_id: 'coord-1', party_id: 'party-1' },
      { id: 'user-2', email: 'jane@example.com', password: 'pass', coordinate_id: 'coord-2', party_id: 'party-1' },
      { id: 'user-3', email: 'bob@example.com', password: 'pass', coordinate_id: 'coord-1', party_id: 'party-2' },
    ];
    const party1: Party = { id: 'party-1', name: 'PS' };
    const party2: Party = { id: 'party-2', name: 'LR' };

    mockCoordinateRepo.findByCountry.mockResolvedValue(coordinates);
    mockUserRepo.findAll.mockResolvedValue(users);
    mockPartyRepo.findById.mockImplementation(async (id) => {
      if (id === 'party-1') return party1;
      if (id === 'party-2') return party2;
      return null;
    });

    const result = await service.getStatisticsByCountry('France');

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(new PartyAggregateCountry('PS', 'France', 2));
    expect(result).toContainEqual(new PartyAggregateCountry('LR', 'France', 1));
  });

  it('should return empty array when no users in country', async () => {
    const coordinates: Coordinate[] = [];
    const users: User[] = [];

    mockCoordinateRepo.findByCountry.mockResolvedValue(coordinates);
    mockUserRepo.findAll.mockResolvedValue(users);

    const result = await service.getStatisticsByCountry('Spain');

    expect(result).toEqual([]);
  });

  it('should exclude users without party_id from statistics', async () => {
    const coordinates: Coordinate[] = [{ id: 'coord-1', city: 'Lyon', country: 'France' }];
    const users: User[] = [
      { id: 'user-1', email: 'john@example.com', password: 'pass', coordinate_id: 'coord-1', party_id: 'party-1' },
      { id: 'user-2', email: 'jane@example.com', password: 'pass', coordinate_id: 'coord-1' }, // no party_id
    ];
    const party1: Party = { id: 'party-1', name: 'PS' };

    mockCoordinateRepo.findByCity.mockResolvedValue(coordinates);
    mockUserRepo.findAll.mockResolvedValue(users);
    mockPartyRepo.findById.mockResolvedValue(party1);

    const result = await service.getStatisticsByCity('Lyon');

    expect(result).toHaveLength(1);
    expect(result[0].member_count).toBe(1);
  });
});
