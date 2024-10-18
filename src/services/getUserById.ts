import { IncomingMessage, ServerResponse } from 'node:http';
import { User } from '../models/User';
import { extractUserId } from '../utils/extractUserId';
import { validate as validateUUID } from 'uuid';
import { HttpStatus } from '../models/HttpStatus';
import { ErrorMessages } from '../models/ErrorMessages';

export function getUserById(
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	users: User[]
): Promise<void> {
	return new Promise((resolve, reject) => {
		const userId = extractUserId(req);
		if (!userId || !validateUUID(userId)) {
			reject(new Error(ErrorMessages.InvalidUserId));
			return;
		}

		if (userId) {
			const curUser = users.find(user => user.id === userId);
			if (curUser) {
				res.writeHead(HttpStatus.OK, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(curUser));
				resolve();
			} else {
				reject(new Error(ErrorMessages.UserNotFound));
			}
		} else {
			reject(new Error(ErrorMessages.InvalidData));
		}
	});
}
