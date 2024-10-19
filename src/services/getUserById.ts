import { IncomingMessage, ServerResponse } from 'node:http';
import { User } from '../models/User';
import { extractUserId } from '../utils/extractUserId';
import { HttpStatus } from '../models/HttpStatus';
import { ErrorMessages } from '../models/ErrorMessages';
import { findUser } from '../utils/findUser';
import { validateUserID } from '../utils/validateUserID';

export function getUserById(
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	users: User[]
) {
	const userId = extractUserId(req) || '';
	validateUserID(userId)
		.then(() => {
			const curUser = findUser(users, userId);
			if (curUser) {
				res.writeHead(HttpStatus.OK, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(curUser));
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
