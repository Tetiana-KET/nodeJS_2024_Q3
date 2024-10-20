import { IncomingMessage, ServerResponse } from 'http';
import { extractUserId } from '../utils/extractUserId';
import { User } from '../models/User';
import { validateUserID } from '../utils/validateUserID';
import { findUserIndex } from '../utils/findUserIndex';
import { HttpStatus } from '../models/HttpStatus';
import { ErrorMessages } from '../models/ErrorMessages';

export function updateUserById(
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	users: User[]
) {
	const userId = extractUserId(req) || '';
	validateUserID(userId)
		.then(() => {
			const userIndex = findUserIndex(users, userId);

			if (userIndex === -1) {
				res.writeHead(HttpStatus.NotFound, {
					'Content-Type': 'application/json',
				});
				res.end(JSON.stringify({ error: ErrorMessages.UserNotFound }));
				return;
			}

			let body = '';

			req.on('data', chunk => {
				body += chunk.toString();
			});

			req.on('end', () => {
				try {
					const updatedData = JSON.parse(body);
					if (updatedData.id) {
						res.writeHead(HttpStatus.BadRequest, {
							'Content-Type': 'application/json',
						});
						res.end(
							JSON.stringify({
								error: ErrorMessages.ShouldNotContainId,
							})
						);
						return;
					}

					users[userIndex] = { ...users[userIndex], ...updatedData };
					res.writeHead(HttpStatus.OK, {
						'Content-Type': 'application/json',
					});
					res.end(JSON.stringify(users[userIndex]));
				} catch {
					res.writeHead(HttpStatus.BadRequest, {
						'Content-Type': 'application/json',
					});
					res.end(JSON.stringify({ error: ErrorMessages.InvalidData }));
				}
			});
		})
		.catch(error => {
			res.writeHead(HttpStatus.BadRequest, {
				'Content-Type': 'application/json',
			});
			res.end(JSON.stringify({ error: error.message }));
		});
}
