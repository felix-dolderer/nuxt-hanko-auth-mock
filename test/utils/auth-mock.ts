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

  // Mock the middleware by intercepting the route navigation
  vi.mock('#app/nuxt', async () => {
    const actual = await vi.importActual('#app/nuxt')
    return {
      ...actual,
      navigateTo: vi.fn(),
      defineNuxtRouteMiddleware: vi.fn((middleware) => {
        // Return a mock middleware that either allows or redirects based on auth state
        return (to: any, from: any) => {
          if (!isAuthenticated && to.path !== '/login') {
            return '/login'
          }
          return undefined
        }
      })
    }
  })

  return mockHankoClient
}

export function mockAuthenticatedUser(user: MockAuthUser = mockUser) {
  return mockHankoAuth(true, user)
}

export function mockUnauthenticatedUser() {
  return mockHankoAuth(false)
}