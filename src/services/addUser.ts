import { IncomingMessage, ServerResponse } from 'node:http';
import { v4 as generateID } from 'uuid';
import { validateUserData } from '../utils/validateUserData';
import { ErrorMessages } from '../models/ErrorMessages';
import { HttpStatus } from '../models/HttpStatus';
import { User } from '../models/User';

export function addUser(req: IncomingMessage, res: ServerResponse, users: User[]): Promise<void> {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      validateUserData(body)
        .then((data) => {
          const newUser: User = {
            id: generateID(),
            username: data.username,
            age: data.age,
            hobbies: data.hobbies,
          };
          users.push(newUser);

          res.writeHead(HttpStatus.Created, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify(newUser));

          resolve();
        })
        .catch((error) => {
          res.writeHead(HttpStatus.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: error.message }));
          reject();
        });
    });

    req.on('error', () => {
      res.writeHead(HttpStatus.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: ErrorMessages.InternalServerError }));
    });
  });
}
