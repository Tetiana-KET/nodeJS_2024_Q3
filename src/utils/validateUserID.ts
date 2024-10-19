import { validate as validateUUID } from 'uuid';
import { ErrorMessages } from '../models/ErrorMessages';

export function validateUserID(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!userId || !validateUUID(userId)) {
			reject(new Error(ErrorMessages.InvalidUserId));
		} else {
            resolve();
        }
    })
    
}