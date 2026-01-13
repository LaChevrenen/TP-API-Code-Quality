import { Coordinate } from '../../domain/coordinate';
import { CoordinateRepositoryPort } from '../../ports/driven/coordinateRepoPort';
import { v4 as uuidv4 } from 'uuid';

const store: Coordinate[] = [];

export class InMemoryCoordinateRepo implements CoordinateRepositoryPort {
  async findAll(): Promise<Coordinate[]> {
    return store.slice();
  }

  async findById(id: string): Promise<Coordinate | null> {
    const found = store.find((c) => c.id === id);
    return found ?? null;
  }

  async findByCity(city: string): Promise<Coordinate[]> {
    return store.filter((c) => c.city === city);
  }

  async findByCountry(country: string): Promise<Coordinate[]> {
    return store.filter((c) => c.country === country);
  }

  async save(coordinate: Omit<Coordinate, 'id'>): Promise<Coordinate> {
    const newCoordinate: Coordinate = { id: uuidv4(), ...coordinate };
    store.push(newCoordinate);
    return newCoordinate;
  }

  async update(id: string, coordinate: Omit<Coordinate, 'id'>): Promise<Coordinate | null> {
    const index = store.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updated: Coordinate = { id, ...coordinate };
    store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = store.findIndex((c) => c.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }
}
