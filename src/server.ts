import { createServer } from 'node:http';
import { User } from './models/User';
import { addUser } from './services/addUser';
import { Routes } from './models/Routes';

const users: User[] = [];

const server = createServer((req, res) => {
	if (req.method === 'POST' && req.url === Routes.USERS) {
		addUser(req)
			.then(newUser => {
				users.push(newUser);
				res.writeHead(201, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(newUser));
			})
			.catch(err => {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: err.message }));
			});
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: 'Not Found' }));
	}
});
const PORT = process.env.HOST_PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
