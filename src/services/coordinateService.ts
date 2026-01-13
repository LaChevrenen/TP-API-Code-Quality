import { Coordinate } from '../domain/coordinate';
import { CoordinateRepositoryPort } from '../ports/driven/coordinateRepoPort';
import { CoordinatePort } from '../ports/driving/coordinatePort';

export class CoordinateService implements CoordinatePort {
  constructor(private repo: CoordinateRepositoryPort) {}

  async listCoordinates(): Promise<Coordinate[]> {
    return this.repo.findAll();
  }

  async listCoordinatesByCity(city: string): Promise<Coordinate[]> {
    return this.repo.findByCity(city);
  }

  async listCoordinatesByCountry(country: string): Promise<Coordinate[]> {
    return this.repo.findByCountry(country);
  }

  async getCoordinate(id: string): Promise<Coordinate | null> {
    return this.repo.findById(id);
  }

  async createCoordinate(input: Omit<Coordinate, 'id'>): Promise<Coordinate> {
    return this.repo.save(input);
  }

  async updateCoordinate(id: string, input: Omit<Coordinate, 'id'>): Promise<Coordinate | null> {
    return this.repo.update(id, input);
  }

  async deleteCoordinate(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
