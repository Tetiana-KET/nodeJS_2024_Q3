export enum ErrorMessages {
  InvalidUserId = 'Invalid user ID',
  UserNotFound = 'User with provided ID not found',
  InvalidData = `Invalid user data. Expected format: { username: string, age: number, hobbies: string[] }`,
  InvalidJSON = 'Invalid JSON format.',
  InternalServerError = 'Internal Server Error',
  WrongEndpoint = 'Endpoint not found. Please check your request URL.',
  ShouldNotContainId = 'Invalid request, your request should not contain ID, it is server-side generated',
}
