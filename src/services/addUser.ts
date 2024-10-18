import { IncomingMessage } from 'node:http';
import { v4 as generateID } from 'uuid';
import { validateUserData } from '../utils/validateUserData';

export function addUser(req: IncomingMessage): Promise<any> {
	return new Promise((resolve, reject) => {
		let body = '';

		req.on('data', chunk => {
			body += chunk.toString();
		});

		req.on('end', () => {
			const isUserDataValid = validateUserData(body);

			if (isUserDataValid) {
				const { username, age, hobbies } = JSON.parse(body);
				const newUser = {
					id: generateID(),
					username,
					age,
					hobbies: hobbies,
				};
				resolve(newUser);
			} else {
				reject(new Error('Invalid user data'));
			}
		});

		req.on('error', err => {
			reject(err);
		});
	});
}
