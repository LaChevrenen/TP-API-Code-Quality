import { Coordinate } from '../../domain/coordinate';
import { CoordinateRepositoryPort } from '../../ports/driven/coordinateRepoPort';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryCoordinateRepo implements CoordinateRepositoryPort {
  private store: Coordinate[] = [];

  async findAll(): Promise<Coordinate[]> {
    return this.store.slice();
  }

  async findById(id: string): Promise<Coordinate | null> {
    const found = this.store.find((c) => c.id === id);
    return found ?? null;
  }

  async findByCity(city: string): Promise<Coordinate[]> {
    return this.store.filter((c) => c.city === city);
  }

  async findByCountry(country: string): Promise<Coordinate[]> {
    return this.store.filter((c) => c.country === country);
  }

  async save(coordinate: Omit<Coordinate, 'id'>): Promise<Coordinate> {
    const newCoordinate: Coordinate = { id: uuidv4(), ...coordinate };
    this.store.push(newCoordinate);
    return newCoordinate;
  }

  async update(id: string, coordinate: Omit<Coordinate, 'id'>): Promise<Coordinate | null> {
    const index = this.store.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updated: Coordinate = { id, ...coordinate };
    this.store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.store.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.store.splice(index, 1);
    return true;
  }
}