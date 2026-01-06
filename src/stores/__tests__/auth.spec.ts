import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

// Mock api
vi.mock('../../lib/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import api from '../../lib/axios'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with values from localStorage', () => {
    localStorage.setItem('auth_token', 'test-token')
    localStorage.setItem('sincronizer_code', 'test-sync')

    const auth = useAuthStore()
    expect(auth.token).toBe('test-token')
    expect(auth.sincronizerCode).toBe('test-sync')
  })

  it('should clear state and localStorage on logout', async () => {
    localStorage.setItem('auth_token', 'test-token')
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test' }))

    const auth = useAuthStore()
    auth.token = 'test-token'
    auth.user = { id: 1, name: 'Test', email: 'test@example.com' }

    api.post.mockResolvedValueOnce({})

    await auth.logout()

    expect(auth.token).toBeNull()
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('should handle OAuth callback and store data', async () => {
    const auth = useAuthStore()
    const mockResponse = {
      data: {
        token: 'new-token',
        user: { id: 1, name: 'Tester' },
        access_modes: [],
        requires_company: true,
        companies: [],
        sincronizer: 'new-sync',
      },
    }

    api.get.mockResolvedValueOnce(mockResponse)

    await auth.handleOAuthCallback('test-code')

    expect(auth.token).toBe('new-token')
    expect(auth.sincronizerCode).toBe('new-sync')
    expect(localStorage.getItem('auth_token')).toBe('new-token')
  })
})
