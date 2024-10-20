import { IncomingMessage, ServerResponse } from 'node:http';
import { User } from '../models/User';
import { extractUserId } from '../utils/extractUserId';
import { HttpStatus } from '../models/HttpStatus';
import { ErrorMessages } from '../models/ErrorMessages';
import { validateUserID } from '../utils/validateUserID';
import { findUserIndex } from '../utils/findUserIndex';

export function deleteUser(req: IncomingMessage, res: ServerResponse<IncomingMessage>, users: User[]) {
  const userId = extractUserId(req) || '';
  validateUserID(userId)
    .then(() => {
      const userIndex = findUserIndex(users, userId);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.writeHead(HttpStatus.NoContent);
        res.end();
      } else {
        res.writeHead(HttpStatus.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: ErrorMessages.UserNotFound }));
      }
    })
    .catch((error) => {
      res.writeHead(HttpStatus.BadRequest, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: error.message }));
    });
}
