import { CustomError } from '../CustomError/CustomError';
import { ErrorMessages } from '../models/ErrorMessages';
import { HttpStatus } from '../models/HttpStatus';
import { UserWithoutId } from '../models/User';

export function validateUserData(userData: string): Promise<UserWithoutId> {
  return new Promise((resolve, reject) => {
    try {
      const { username, age, hobbies, id } = JSON.parse(userData);
      if (id) {
        reject(new CustomError(ErrorMessages.ShouldNotContainId, HttpStatus.BadRequest, 'Bad Request'));
      }
      if (
        typeof username === 'string' &&
        typeof age === 'number' &&
        Array.isArray(hobbies) &&
        hobbies.every((hobby) => typeof hobby === 'string')
      ) {
        resolve({ username, age, hobbies });
      } else {
        reject(new CustomError(ErrorMessages.InvalidData, HttpStatus.BadRequest, 'Bad Request'));
      }
    } catch {
      throw new CustomError(ErrorMessages.InvalidJSON, HttpStatus.BadRequest, 'Bad Request');
    }
  });
}
