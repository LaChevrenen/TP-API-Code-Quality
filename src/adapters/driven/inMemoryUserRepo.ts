import { User } from '../../domain/user';
import { UserRepositoryPort } from '../../ports/driven/userRepoPort';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryUserRepo implements UserRepositoryPort {
  private store: User[] = [];

  async findAll(): Promise<User[]> {
    return this.store.slice();
  }

  async findById(id: string): Promise<User | null> {
    const found = this.store.find((u) => u.id === id);
    return found ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = this.store.find((u) => u.email === email);
    return found ?? null;
  }

  async save(user: Omit<User, 'id'>): Promise<User> {
    const newUser: User = { id: uuidv4(), ...user };
    this.store.push(newUser);
    return newUser;
  }

  async update(id: string, user: Omit<User, 'id'>): Promise<User | null> {
    const index = this.store.findIndex((u) => u.id === id);
    if (index === -1) return null;
    const updated: User = { id, ...user };
    this.store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.store.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.store.splice(index, 1);
    return true;
  }
}