import { createServer } from 'node:http';
import { User } from '../models/User';
import { HttpStatus } from '../models/HttpStatus';
import { ErrorMessages } from '../models/ErrorMessages';
import { addUser } from '../services/addUser';
import { Routes } from '../models/Routes';
import { getUserById } from '../services/getUserById';
import { deleteUser } from '../services/deleteUser';
import { updateUserById } from '../services/updateUserById';

const users: User[] = [];

const dbServer = createServer((req, res) => {
  if (req.method === 'POST' && req.url === Routes.USERS) {
    addUser(req, res, users);
  } else if (req.method === 'GET' && req.url === Routes.USERS) {
    res.writeHead(HttpStatus.OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.method === 'GET' && req.url?.startsWith(Routes.USER_BY_ID)) {
    getUserById(req, res, users);
  } else if (req.method === 'DELETE' && req.url?.startsWith(Routes.USER_BY_ID)) {
    deleteUser(req, res, users);
  } else if (req.method === 'PUT' && req.url?.startsWith(Routes.USER_BY_ID)) {
    updateUserById(req, res, users);
  }
});

export const startDbService = (port: number) => {
  dbServer.listen(port, () => {
    console.log(`DB Service is running on port ${port}`);
  });
};
