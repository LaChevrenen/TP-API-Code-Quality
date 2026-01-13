import { PartyAggregateCity, PartyAggregateCountry } from '../../domain/partyAggregate';

export interface StatisticsPort {
  getStatisticsByCity(city: string): Promise<PartyAggregateCity[]>;
  getStatisticsByCountry(country: string): Promise<PartyAggregateCountry[]>;
}
