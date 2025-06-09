import { fetch, setup } from '@nuxt/test-utils'
import { describe, expect, test, beforeAll, beforeEach, vi } from 'vitest'
import { mockAuthenticatedUser, mockUnauthenticatedUser } from '../utils/auth-mock'

describe('Authentication Flow Integration', async () => {
  await setup({ server: true })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('authenticated user can access protected pages', async () => {
    mockAuthenticatedUser()
    
    const response = await fetch('/')
    
    expect(response.ok).toBeTruthy()
    expect(response.status).toBe(200)
  })

  test('login page is accessible without authentication', async () => {
    mockUnauthenticatedUser()
    
    const response = await fetch('/login')
    
    expect(response.ok).toBeTruthy()
    expect(response.status).toBe(200)
  })

  test('can mock different user states', async () => {
    const customUser = {
      id: 'custom-user-456',
      email: 'custom@example.com',
      verified: false
    }
    
    const mockClient = mockAuthenticatedUser(customUser)
    const user = await mockClient.user.getCurrent()
    
    expect(user).toEqual(customUser)
    expect(user.email).toBe('custom@example.com')
    expect(user.verified).toBe(false)
  })
})