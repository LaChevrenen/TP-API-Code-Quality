import { Party } from '../../domain/party';

export interface PartyRepositoryPort {
  findAll(): Promise<Party[]>;
  findById(id: string): Promise<Party | null>;
  findByName(name: string): Promise<Party | null>;
  save(party: Omit<Party, 'id'>): Promise<Party>;
  update(id: string, party: Omit<Party, 'id'>): Promise<Party | null>;
  delete(id: string): Promise<boolean>;
}
