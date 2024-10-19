export const testEnvironment = 'node';
export const preset = 'ts-jest';
export const transform = {
	'^.+\\.ts$': 'ts-jest',
};
export const moduleFileExtensions = ['ts', 'js'];
export const testMatch = ['**/*.test.ts'];
