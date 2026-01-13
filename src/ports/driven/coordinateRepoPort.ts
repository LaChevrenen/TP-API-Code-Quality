import { Coordinate } from '../../domain/coordinate';

export interface CoordinateRepositoryPort {
  findAll(): Promise<Coordinate[]>;
  findById(id: string): Promise<Coordinate | null>;
  findByCity(city: string): Promise<Coordinate[]>;
  findByCountry(country: string): Promise<Coordinate[]>;
  save(coordinate: Omit<Coordinate, 'id'>): Promise<Coordinate>;
  update(id: string, coordinate: Omit<Coordinate, 'id'>): Promise<Coordinate | null>;
  delete(id: string): Promise<boolean>;
}
