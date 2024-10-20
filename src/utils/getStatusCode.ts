import { HttpStatus } from '../models/HttpStatus';

export function getStatusCode(errorMessage: string): number {
  return errorMessage === 'Invalid user ID' ? HttpStatus.BadRequest : HttpStatus.NotFound;
}
