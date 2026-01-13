import { User } from '../../domain/user';

export interface UserRepositoryPort {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, user: Omit<User, 'id'>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
