import { User } from "../models/User";

export function findUser (users: User[], userId: string): User | null {
    return users.find(user => user.id === userId) || null;
}