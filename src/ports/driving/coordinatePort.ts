import { Coordinate } from '../../domain/coordinate';

export interface CoordinatePort {
  listCoordinates(): Promise<Coordinate[]>;
  listCoordinatesByCity(city: string): Promise<Coordinate[]>;
  listCoordinatesByCountry(country: string): Promise<Coordinate[]>;
  getCoordinate(id: string): Promise<Coordinate | null>;
  createCoordinate(input: Omit<Coordinate, 'id'>): Promise<Coordinate>;
  updateCoordinate(id: string, input: Omit<Coordinate, 'id'>): Promise<Coordinate | null>;
  deleteCoordinate(id: string): Promise<boolean>;
}
