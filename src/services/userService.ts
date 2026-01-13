import { User } from '../domain/user';
import { UserRepositoryPort } from '../ports/driven/userRepoPort';
import { UserPort } from '../ports/driving/userPort';

export class UserService implements UserPort {
  constructor(private repo: UserRepositoryPort) {}

  async listUsers(): Promise<User[]> {
    return this.repo.findAll();
  }

  async getUser(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }

  async createUser(input: Omit<User, 'id'>): Promise<User> {
    return this.repo.save(input);
  }

  async updateUser(id: string, input: Omit<User, 'id'>): Promise<User | null> {
    return this.repo.update(id, input);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
