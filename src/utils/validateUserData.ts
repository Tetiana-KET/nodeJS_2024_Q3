import { ErrorMessages } from '../models/ErrorMessages';
import { UserWithoutId } from '../models/User';

export function validateUserData(userData: string): Promise<UserWithoutId> {
	return new Promise((resolve, reject) => {
		try {
			const { username, age, hobbies, id } = JSON.parse(userData);
			if (id) {
				reject(new Error(ErrorMessages.ShouldNotContainId));
			}
			if (
				typeof username === 'string' &&
				typeof age === 'number' &&
				Array.isArray(hobbies) &&
				hobbies.every(hobby => typeof hobby === 'string')
			) {
				resolve({ username, age, hobbies });
			} else {
				reject(new Error(ErrorMessages.InvalidData));
			}
		} catch (error) {
			throw new Error(ErrorMessages.InvalidJSON);
		}
	});
}
