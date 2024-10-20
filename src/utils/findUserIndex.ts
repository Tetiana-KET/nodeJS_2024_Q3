import { User } from '../models/User';

export function findUserIndex(users: User[], userId: string) {
  return users.findIndex((user) => user.id === userId);
}
