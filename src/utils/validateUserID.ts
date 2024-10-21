import { validate as validateUUID } from 'uuid';
import { ErrorMessages } from '../models/ErrorMessages';
import { CustomError } from '../CustomError/CustomError';
import { HttpStatus } from '../models/HttpStatus';

export function validateUserID(userId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!userId || !validateUUID(userId)) {
      reject(new CustomError(ErrorMessages.InvalidUserId, HttpStatus.BadRequest, 'Bad Request'));
    } else {
      resolve();
    }
  });
}
