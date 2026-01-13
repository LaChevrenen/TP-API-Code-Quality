import { CoordinateService } from './coordinateService';
import { Coordinate } from '../domain/coordinate';

describe('CoordinateService', () => {
  let mockRepo: {
    findAll: jest.Mock<Promise<Coordinate[]>, []>;
    findById: jest.Mock<Promise<Coordinate | null>, [string]>;
    findByCity: jest.Mock<Promise<Coordinate[]>, [string]>;
    findByCountry: jest.Mock<Promise<Coordinate[]>, [string]>;
    save: jest.Mock<Promise<Coordinate>, [Omit<Coordinate, 'id'>]>;
    update: jest.Mock<Promise<Coordinate | null>, [string, Omit<Coordinate, 'id'>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let service: CoordinateService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCity: jest.fn(),
      findByCountry: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new CoordinateService(mockRepo as any);
  });

  it('should return the list provided by the repo', async () => {
    const sample: Coordinate[] = [{ id: '1', city: 'Lyon', country: 'France' }];
    mockRepo.findAll.mockResolvedValue(sample);
    await expect(service.listCoordinates()).resolves.toEqual(sample);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return coordinates filtered by city', async () => {
    const sample: Coordinate[] = [{ id: '1', city: 'Lyon', country: 'France' }];
    mockRepo.findByCity.mockResolvedValue(sample);
    await expect(service.listCoordinatesByCity('Lyon')).resolves.toEqual(sample);
    expect(mockRepo.findByCity).toHaveBeenCalledWith('Lyon');
  });

  it('should return coordinates filtered by country', async () => {
    const sample: Coordinate[] = [
      { id: '1', city: 'Lyon', country: 'France' },
      { id: '2', city: 'Paris', country: 'France' }
    ];
    mockRepo.findByCountry.mockResolvedValue(sample);
    await expect(service.listCoordinatesByCountry('France')).resolves.toEqual(sample);
    expect(mockRepo.findByCountry).toHaveBeenCalledWith('France');
  });

  it('should return the coordinate when it exists', async () => {
    const coord: Coordinate = { id: '1', city: 'Lyon', country: 'France' };
    mockRepo.findById.mockResolvedValue(coord);
    await expect(service.getCoordinate('1')).resolves.toEqual(coord);
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });

  it('should return null when the coordinate is not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getCoordinate('missing')).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });

  it('should call save and return the created coordinate', async () => {
    const input: Omit<Coordinate, 'id'> = { city: 'Marseille', country: 'France' };
    const saved: Coordinate = { id: '2', ...input };
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createCoordinate(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
  });

  it('should update and return the modified coordinate', async () => {
    const input: Omit<Coordinate, 'id'> = { city: 'Nice', country: 'France' };
    const updated: Coordinate = { id: '1', ...input };
    mockRepo.update.mockResolvedValue(updated);
    await expect(service.updateCoordinate('1', input)).resolves.toEqual(updated);
    expect(mockRepo.update).toHaveBeenCalledWith('1', input);
  });

  it('should return null when updating a non-existent coordinate', async () => {
    const input: Omit<Coordinate, 'id'> = { city: 'Nice', country: 'France' };
    mockRepo.update.mockResolvedValue(null);
    await expect(service.updateCoordinate('missing', input)).resolves.toBeNull();
    expect(mockRepo.update).toHaveBeenCalledWith('missing', input);
  });

  it('should delete and return true when the coordinate exists', async () => {
    mockRepo.delete.mockResolvedValue(true);
    await expect(service.deleteCoordinate('1')).resolves.toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should return false when deleting a non-existent coordinate', async () => {
    mockRepo.delete.mockResolvedValue(false);
    await expect(service.deleteCoordinate('missing')).resolves.toBe(false);
    expect(mockRepo.delete).toHaveBeenCalledWith('missing');
  });
});
