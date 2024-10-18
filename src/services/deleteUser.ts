import { IncomingMessage, ServerResponse } from 'node:http';
import { User } from '../models/User';
import { extractUserId } from '../utils/extractUserId';
import { validate as validateUUID } from 'uuid';
import { HttpStatus } from '../models/HttpStatus';
import { ErrorMessages } from '../models/ErrorMessages';

export function deleteUser(
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	users: User[]
): Promise<void> {
	return new Promise((resolve, reject) => {
		const userId = extractUserId(req);
		if (!userId || !validateUUID(userId)) {
			res.writeHead(HttpStatus.BadRequest, {
				'Content-Type': 'application/json',
			});
			res.end(JSON.stringify({ error: ErrorMessages.InvalidUserId }));
			return;
		}

		if (userId) {
			const curUserIndex = users.findIndex(user => user.id === userId);
			if (curUserIndex !== -1) {
				users.splice(curUserIndex, 1);
				res.writeHead(HttpStatus.NoContent);
				res.end();
				resolve();
			} else {
				reject(new Error(ErrorMessages.UserNotFound));
			}
		} else {
			reject(new Error(ErrorMessages.InvalidData));
		}
	});
}
