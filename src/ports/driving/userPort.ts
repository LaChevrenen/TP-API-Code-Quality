import { User } from '../../domain/user';

export interface UserPort {
  listUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(input: Omit<User, 'id'>): Promise<User>;
  updateUser(id: string, input: Omit<User, 'id'>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}
