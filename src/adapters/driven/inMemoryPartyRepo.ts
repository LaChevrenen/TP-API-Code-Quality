import { Party } from '../../domain/party';
import { PartyRepositoryPort } from '../../ports/driven/partyRepoPort';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryPartyRepo implements PartyRepositoryPort {
  private store: Party[] = [];

  async findAll(): Promise<Party[]> {
    return this.store.slice();
  }

  async findById(id: string): Promise<Party | null> {
    const found = this.store.find((p) => p.id === id);
    return found ?? null;
  }

  async findByName(name: string): Promise<Party | null> {
    const found = this.store.find((p) => p.name === name);
    return found ?? null;
  }

  async save(party: Omit<Party, 'id'>): Promise<Party> {
    const newParty: Party = { id: uuidv4(), ...party };
    this.store.push(newParty);
    return newParty;
  }

  async update(id: string, party: Omit<Party, 'id'>): Promise<Party | null> {
    const index = this.store.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Party = { id, ...party };
    this.store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.store.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.store.splice(index, 1);
    return true;
  }
}