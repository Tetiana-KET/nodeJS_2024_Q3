import { createServer } from 'node:http';
import { User } from './models/User';
import { addUser } from './services/addUser';
import { Routes } from './models/Routes';
import { getUserById } from './services/getUserById';
import { HttpStatus } from './models/HttpStatus';
import { deleteUser } from './services/deleteUser';
import { updateUserById } from './services/updateUserById';

const users: User[] = [];

const server = createServer((req, res) => {
	if (req.method === 'POST' && req.url === Routes.USERS) {
		addUser(req, res, users);
	} else if (req.method === 'GET' && req.url === Routes.USERS) {
		res.writeHead(HttpStatus.OK, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(users));
	} else if (req.method === 'GET' && req.url?.startsWith(Routes.USER_BY_ID)) {
		getUserById(req, res, users);			
	} else if (
		req.method === 'DELETE' &&
		req.url?.startsWith(Routes.USER_BY_ID)
	) {
		deleteUser(req, res, users);
	} else if (req.method === 'PUT' && req.url?.startsWith(Routes.USER_BY_ID)) { 
		updateUserById(req, res, users);
	} else {
		res.writeHead(HttpStatus.NotFound, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: 'Server Error' }));
	}
});
const PORT = process.env.HOST_PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
