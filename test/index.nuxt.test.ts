import { fetch, setup } from "@nuxt/test-utils"
import { describe, expect, test } from "vitest"

describe("index", async () => {
  await setup({ server: true })

  test("it renders index", async () => {
    const response = await fetch("/")

    expect(response.ok).toBeTruthy()
    expect(response.headers.get("location")).not.toContain("login")
  })
})
