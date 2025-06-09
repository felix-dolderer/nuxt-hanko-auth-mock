import { fetch, setup } from "@nuxt/test-utils"
import { describe, expect, test, beforeEach, vi } from "vitest"
import { mockAuthenticatedUser } from './utils/auth-mock'

describe("index", async () => {
  await setup({ server: true })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("it renders index when authenticated", async () => {
    // Mock authenticated state for this test
    mockAuthenticatedUser()
    
    const response = await fetch("/")

    expect(response.ok).toBeTruthy()
    expect(response.headers.get("location")).toContain("login")
  })

  test("handles different authentication scenarios", async () => {
    // Test with custom user data
    const customUser = {
      id: 'test-123',
      email: 'integration@test.com',
      verified: true
    }
    
    mockAuthenticatedUser(customUser)
    
    const response = await fetch("/")
    expect(response.status).toBe(200)
  })
})