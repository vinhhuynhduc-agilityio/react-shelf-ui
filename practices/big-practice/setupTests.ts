import '@testing-library/jest-dom';

// Mock the @/config module globally for all tests
jest.mock('@/config', () => ({
  API_BASE_URL: 'http://localhost:3001',
}));
