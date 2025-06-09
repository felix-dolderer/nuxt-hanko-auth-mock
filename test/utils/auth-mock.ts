import { vi } from 'vitest'

export interface MockAuthUser {
  id: string
  email: string
  verified: boolean
}

export const mockUser: MockAuthUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  verified: true
}

// Mock the navigateTo function at module level
const mockNavigateTo = vi.fn()

// Mock #app/nuxt at module level with all required exports
vi.mock('#app/nuxt', async () => {
  const actual = await vi.importActual('#app/nuxt')
  return {
    ...actual,
    navigateTo: mockNavigateTo,
    useNuxtApp: vi.fn(() => ({
      $router: {
        push: vi.fn(),
        replace: vi.fn(),
      },
      ssrContext: {},
    })),
    defineNuxtRouteMiddleware: vi.fn((middleware) => {
      return (to: any, from: any) => {
        // This would be handled by the actual middleware
        return undefined
      }
    })
  }
})

export function mockHankoAuth(isAuthenticated: boolean = true, user: MockAuthUser = mockUser) {
  // Mock the Hanko client
  const mockHankoClient = {
    user: {
      getCurrent: vi.fn().mockResolvedValue(isAuthenticated ? user : null),
    },
    session: {
      isValid: vi.fn().mockResolvedValue(isAuthenticated),
      get: vi.fn().mockResolvedValue(isAuthenticated ? { jwt: 'mock-jwt-token' } : null),
    },
    token: {
      validate: vi.fn().mockResolvedValue(isAuthenticated),
    }
  }

  // Mock the useHanko composable
  vi.mock('@nuxtjs/hanko', () => ({
    useHanko: () => mockHankoClient,
    default: mockHankoClient
  }))

  return mockHankoClient
}

export function mockAuthenticatedUser(user: MockAuthUser = mockUser) {
  return mockHankoAuth(true, user)
}

export function mockUnauthenticatedUser() {
  return mockHankoAuth(false)
}

// Export the mockNavigateTo for use in tests if needed
export { mockNavigateTo }