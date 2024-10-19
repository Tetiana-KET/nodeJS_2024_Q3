export function getStatusCode(errorMessage: string): number {
	return errorMessage === 'Invalid user ID' ? 400 : 404;
}
