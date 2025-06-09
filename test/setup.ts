import { vi } from 'vitest'

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment these if you want to suppress console output during tests
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
}