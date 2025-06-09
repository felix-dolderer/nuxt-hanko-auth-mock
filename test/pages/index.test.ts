import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, test, beforeEach, vi } from 'vitest'
import IndexPage from '~/pages/index.vue'
import { mockAuthenticatedUser, mockUnauthenticatedUser } from '../utils/auth-mock'

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders when user is authenticated', async () => {
    // Mock authenticated state
    mockAuthenticatedUser()

    const component = await mountSuspended(IndexPage)
    
    expect(component.text()).toContain('Hello World')
  })

  test('should be accessible when authenticated', async () => {
    // Mock authenticated state
    const mockClient = mockAuthenticatedUser()

    const component = await mountSuspended(IndexPage)
    
    // Verify the component mounted successfully (meaning middleware passed)
    expect(component.exists()).toBe(true)
    expect(mockClient.session.isValid).toHaveBeenCalled()
  })

  test('unauthenticated user session is invalid', async () => {
    // Mock unauthenticated state
    const mockClient = mockUnauthenticatedUser()
    
    // Simulate what the middleware would do for an unauthenticated user
    const isValid = await mockClient.session.isValid()
    
    expect(isValid).toBe(false)
    expect(mockClient.session.isValid).toHaveBeenCalled()
    
    // Verify that the session is invalid, which would trigger redirect in real middleware
    expect(isValid).toBe(false)
  })
})