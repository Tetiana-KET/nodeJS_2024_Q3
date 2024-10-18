import { createServer } from 'node:http';
import { User } from './models/User';
import { addUser } from './services/addUser';
import { Routes } from './models/Routes';
import { getUserById } from './services/getUserById';
import { getStatusCode } from './utils/getStatusCode';
import { HttpStatus } from './models/HttpStatus';

const users: User[] = [];

const server = createServer((req, res) => {
	if (req.method === 'POST' && req.url === Routes.USERS) {
		addUser(req)
			.then(newUser => {
				users.push(newUser);
				res.writeHead(HttpStatus.Created, {
					'Content-Type': 'application/json',
				});
				res.end(JSON.stringify(newUser));
			})
			.catch(err => {
				res.writeHead(HttpStatus.BadRequest, {
					'Content-Type': 'application/json',
				});
				res.end(JSON.stringify({ error: err.message }));
			});
	} else if (req.method === 'GET' && req.url === Routes.USERS) {
		res.writeHead(HttpStatus.OK, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(users));
	} else if (req.method === 'GET' && req.url?.startsWith(Routes.USER_BY_ID)) {
		getUserById(req, res, users)
			.then(() => {})
			.catch(err => {
				res.writeHead(getStatusCode(err.message), {
					'Content-Type': 'application/json',
				});
				res.end(JSON.stringify({ error: err.message }));
			});
	} else {
		res.writeHead(HttpStatus.NotFound, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: 'Not Found' }));
	}
});
const PORT = process.env.HOST_PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
