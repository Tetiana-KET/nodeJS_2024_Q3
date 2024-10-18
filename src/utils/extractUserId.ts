import { IncomingMessage } from 'http';

export function extractUserId(req: IncomingMessage) {
	return req.url?.split('/').pop();
}
