import { PartyAggregateCity, PartyAggregateCountry } from '../domain/partyAggregate';
import { StatisticsPort } from '../ports/driving/statisticsPort';
import { UserRepositoryPort } from '../ports/driven/userRepoPort';
import { PartyRepositoryPort } from '../ports/driven/partyRepoPort';
import { CoordinateRepositoryPort } from '../ports/driven/coordinateRepoPort';

export class StatisticsService implements StatisticsPort {
  constructor(
    private userRepo: UserRepositoryPort,
    private partyRepo: PartyRepositoryPort,
    private coordinateRepo: CoordinateRepositoryPort
  ) {}

  async getStatisticsByCity(city: string): Promise<PartyAggregateCity[]> {
    // Get all coordinates for the city
    const coordinates = await this.coordinateRepo.findByCity(city);
    const coordinateIds = coordinates.map(c => c.id!);

    // Get all users in those coordinates
    const allUsers = await this.userRepo.findAll();
    const usersInCity = allUsers.filter(u => coordinateIds.includes(u.coordinate_id));

    // Group by party
    const partyMap = new Map<string, number>();
    
    for (const user of usersInCity) {
      if (user.party_id) {
        const party = await this.partyRepo.findById(user.party_id);
        if (party) {
          const partyName = party.name;
          partyMap.set(partyName, (partyMap.get(partyName) || 0) + 1);
        }
      }
    }

    // Convert to result array
    const result: PartyAggregateCity[] = [];
    for (const [partyName, count] of partyMap.entries()) {
      result.push(new PartyAggregateCity(partyName, city, count));
    }

    return result;
  }

  async getStatisticsByCountry(country: string): Promise<PartyAggregateCountry[]> {
    // Get all coordinates for the country
    const coordinates = await this.coordinateRepo.findByCountry(country);
    const coordinateIds = coordinates.map(c => c.id!);

    // Get all users in those coordinates
    const allUsers = await this.userRepo.findAll();
    const usersInCountry = allUsers.filter(u => coordinateIds.includes(u.coordinate_id));

    // Group by party
    const partyMap = new Map<string, number>();
    
    for (const user of usersInCountry) {
      if (user.party_id) {
        const party = await this.partyRepo.findById(user.party_id);
        if (party) {
          const partyName = party.name;
          partyMap.set(partyName, (partyMap.get(partyName) || 0) + 1);
        }
      }
    }

    // Convert to result array
    const result: PartyAggregateCountry[] = [];
    for (const [partyName, count] of partyMap.entries()) {
      result.push(new PartyAggregateCountry(partyName, country, count));
    }

    return result;
  }
}
