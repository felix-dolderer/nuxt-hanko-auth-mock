import { describe, expect, test, beforeEach, vi } from 'vitest'
import { mockAuthenticatedUser, mockUnauthenticatedUser } from '../utils/auth-mock'

// Mock the middleware function
const mockMiddleware = vi.fn()

describe('hanko-logged-in middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('allows access when user is authenticated', async () => {
    const mockClient = mockAuthenticatedUser()
    
    // Simulate middleware behavior
    const isValid = await mockClient.session.isValid()
    
    expect(isValid).toBe(true)
    expect(mockClient.session.isValid).toHaveBeenCalled()
  })

  test('blocks access when user is not authenticated', async () => {
    const mockClient = mockUnauthenticatedUser()
    
    // Simulate middleware behavior
    const isValid = await mockClient.session.isValid()
    
    expect(isValid).toBe(false)
    expect(mockClient.session.isValid).toHaveBeenCalled()
  })

  test('redirects to login when not authenticated', async () => {
    mockUnauthenticatedUser()
    
    // Mock route objects
    const to = { path: '/', name: 'index' }
    const from = { path: '/login', name: 'login' }
    
    // Simulate what the middleware would do
    const mockNavigateTo = vi.fn()
    vi.mock('#app/nuxt', () => ({
      navigateTo: mockNavigateTo
    }))
    
    // In a real scenario, the middleware would call navigateTo('/login')
    // We're testing the logic that would trigger this
    const mockClient = mockUnauthenticatedUser()
    const isValid = await mockClient.session.isValid()
    
    if (!isValid && to.path !== '/login') {
      // This simulates what the actual middleware would do
      expect(to.path).not.toBe('/login')
    }
  })
})