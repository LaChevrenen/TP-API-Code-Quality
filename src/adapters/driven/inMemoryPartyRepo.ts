import { Party } from '../../domain/party';
import { PartyRepositoryPort } from '../../ports/driven/partyRepoPort';
import { v4 as uuidv4 } from 'uuid';

const store: Party[] = [];

export class InMemoryPartyRepo implements PartyRepositoryPort {
  async findAll(): Promise<Party[]> {
    return store.slice();
  }

  async findById(id: string): Promise<Party | null> {
    const found = store.find((p) => p.id === id);
    return found ?? null;
  }

  async findByName(name: string): Promise<Party | null> {
    const found = store.find((p) => p.name === name);
    return found ?? null;
  }

  async save(party: Omit<Party, 'id'>): Promise<Party> {
    const newParty: Party = { id: uuidv4(), ...party };
    store.push(newParty);
    return newParty;
  }

  async update(id: string, party: Omit<Party, 'id'>): Promise<Party | null> {
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Party = { id, ...party };
    store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }
}
