import { Party } from '../domain/party';
import { PartyRepositoryPort } from '../ports/driven/partyRepoPort';
import { PartyPort } from '../ports/driving/partyPort';

export class PartyService implements PartyPort {
  constructor(private repo: PartyRepositoryPort) {}

  async listParties(): Promise<Party[]> {
    return this.repo.findAll();
  }

  async listPartiesByName(name: string): Promise<Party | null> {
    return this.repo.findByName(name);
  }

  async getParty(id: string): Promise<Party | null> {
    return this.repo.findById(id);
  }

  async createParty(input: Omit<Party, 'id'>): Promise<Party> {
    return this.repo.save(input);
  }

  async updateParty(id: string, input: Omit<Party, 'id'>): Promise<Party | null> {
    return this.repo.update(id, input);
  }

  async deleteParty(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
