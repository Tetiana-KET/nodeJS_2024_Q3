import { User } from './User';

export interface AddUserMessage {
  type: 'addUser';
  data: User;
}

export type Message = AddUserMessage;
