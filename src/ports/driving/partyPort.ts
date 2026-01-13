import { Party } from '../../domain/party';

export interface PartyPort {
  listParties(): Promise<Party[]>;
  listPartiesByName(name: string): Promise<Party | null>;
  getParty(id: string): Promise<Party | null>;
  createParty(input: Omit<Party, 'id'>): Promise<Party>;
  updateParty(id: string, input: Omit<Party, 'id'>): Promise<Party | null>;
  deleteParty(id: string): Promise<boolean>;
}
