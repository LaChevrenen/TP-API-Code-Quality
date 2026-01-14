import { CoordinateService } from '../../services/coordinateService';
import { InMemoryCoordinateRepo } from '../../adapters/driven/inMemoryCoordinateRepo';
import { Coordinate } from '../../domain/coordinate';

describe('CoordinateService Integration Tests', () => {
  let service: CoordinateService;
  let repo: InMemoryCoordinateRepo;

  beforeEach(() => {
    repo = new InMemoryCoordinateRepo();
    service = new CoordinateService(repo);
  });

  it('should create and retrieve a coordinate', async () => {
    const created = await service.createCoordinate({
      city: 'Lyon',
      country: 'France'
    });

    const found = await service.getCoordinate(created.id!);

    expect(found).toEqual(created);
    expect(found?.city).toBe('Lyon');
  });

  it('should list all coordinates after creation', async () => {
    await service.createCoordinate({ city: 'Lyon', country: 'France' });
    await service.createCoordinate({ city: 'Paris', country: 'France' });

    const all = await service.listCoordinates();

    expect(all).toHaveLength(2);
  });

  it('should filter coordinates by city', async () => {
    await service.createCoordinate({ city: 'Lyon', country: 'France' });
    await service.createCoordinate({ city: 'Lyon', country: 'France' });
    await service.createCoordinate({ city: 'Paris', country: 'France' });

    const lyon = await service.listCoordinatesByCity('Lyon');

    expect(lyon).toHaveLength(2);
    expect(lyon.every(c => c.city === 'Lyon')).toBe(true);
  });

  it('should filter coordinates by country', async () => {
    await service.createCoordinate({ city: 'Lyon', country: 'France' });
    await service.createCoordinate({ city: 'Madrid', country: 'Spain' });

    const france = await service.listCoordinatesByCountry('France');

    expect(france).toHaveLength(1);
    expect(france[0].country).toBe('France');
  });

  it('should update a coordinate', async () => {
    const created = await service.createCoordinate({
      city: 'Lyon',
      country: 'France'
    });

    const updated = await service.updateCoordinate(created.id!, {
      city: 'Marseille',
      country: 'France'
    });

    expect(updated?.city).toBe('Marseille');
    expect(updated?.id).toBe(created.id);

    const found = await service.getCoordinate(created.id!);
    expect(found?.city).toBe('Marseille');
  });

  it('should delete a coordinate', async () => {
    const created = await service.createCoordinate({
      city: 'Lyon',
      country: 'France'
    });

    const deleted = await service.deleteCoordinate(created.id!);
    expect(deleted).toBe(true);

    const found = await service.getCoordinate(created.id!);
    expect(found).toBeNull();
  });

  it('should handle non-existent coordinate retrieval gracefully', async () => {
    const found = await service.getCoordinate('non-existent-id');
    expect(found).toBeNull();
  });

  it('should return false when deleting non-existent coordinate', async () => {
    const deleted = await service.deleteCoordinate('non-existent-id');
    expect(deleted).toBe(false);
  });
});
