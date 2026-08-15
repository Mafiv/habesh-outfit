import { createAuthClient } from 'better-auth/react'
import { jwtClient } from 'better-auth/client/plugins'

const authBaseURL = import.meta.env.VITE_AUTH_URL || 'http://localhost:3001'

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [jwtClient()],
})

export async function getAuthToken(): Promise<string | null> {
  try {
    const { data, error } = await authClient.token()
    if (error || !data?.token) return null
    return data.token
  } catch {
    return null
  }
}
