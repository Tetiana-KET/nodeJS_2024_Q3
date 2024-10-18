export function validateUserData(userData: string): boolean {
	const { username, age, hobbies } = JSON.parse(userData);
	return (
		typeof username === 'string' &&
		typeof age === 'number' &&
		Array.isArray(hobbies) &&
		hobbies.every(hobby => typeof hobby === 'string')
	);
}
