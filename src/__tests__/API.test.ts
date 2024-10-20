import request from 'supertest';
import { Routes } from '../models/Routes';
import { startServer, stopServer } from '../server';
import { HttpStatus } from '../models/HttpStatus';

describe('tests for API', () => {
  let mockServer: ReturnType<typeof request>;

  const mockUser = {
    username: 'TestUser',
    age: 25,
    hobbies: ['Reading', 'Gaming'],
  };

  const mockUpdatedUser = {
    username: 'UpdatedUser',
    age: 30,
    hobbies: ['Cooking', 'Traveling'],
  };

  let mockCreatedUserId: string;

  const mockValidID = '9b538ff3-4f38-46c2-8838-8963b6c943b7';
  const mockInvalidID = '9b538ff3-4f38-46c2-8838-InvalidID';

  const TEST_PORT = '3001';

  beforeAll((done) => {
    startServer(TEST_PORT, () => {
      mockServer = request('http://localhost:' + TEST_PORT);
      done();
    });
  });

  afterAll((done) => {
    stopServer(done);
  });

  it('initially should return an empty array when getting all users', async () => {
    const response = await mockServer.get(Routes.USERS);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it('should create a new user', async () => {
    const response = await mockServer.post(Routes.USERS).send(mockUser);
    expect(response.status).toBe(HttpStatus.Created);
    expect(response.body.username).toBe(mockUser.username);
    mockCreatedUserId = response.body.id;
  });

  it('should retrieve the created user by ID', async () => {
    const response = await mockServer.get(`${Routes.USERS}/${mockCreatedUserId}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.id).toBe(mockCreatedUserId);
    expect(response.body.username).toBe(mockUser.username);
  });

  it('should update the created user', async () => {
    const response = await mockServer.put(`${Routes.USERS}/${mockCreatedUserId}`).send(mockUpdatedUser);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.id).toBe(mockCreatedUserId);
    expect(response.body.username).toBe(mockUpdatedUser.username);
  });

  it('should delete the created user', async () => {
    const response = await mockServer.delete(`${Routes.USERS}/${mockCreatedUserId}`);
    expect(response.status).toBe(HttpStatus.NoContent);
  });

  it('should return 404 for the deleted user', async () => {
    const response = await mockServer.get(`${Routes.USERS}/${mockCreatedUserId}`);
    expect(response.status).toBe(HttpStatus.NotFound);
    expect(response.body.error).toBe('User not found');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await mockServer.get(`${Routes.USERS}/${mockValidID}`);
    expect(response.status).toBe(HttpStatus.NotFound);
    expect(response.body.error).toBe('User not found');
  });

  it('should return 400 for Invalid user ID', async () => {
    const response = await mockServer.get(`${Routes.USERS}/${mockInvalidID}`);
    expect(response.status).toBe(HttpStatus.BadRequest);
    expect(response.body.error).toBe('Invalid user ID');
  });

  it('should return all users', async () => {
    const response = await mockServer.get(Routes.USERS);
    expect(response.status).toBe(HttpStatus.OK);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
