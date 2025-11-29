import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export interface User {
  id: string
  email: string
  password: string // For demo purposes only - in production, never store passwords in frontend
  name: string
  avatar?: string
  role: 'member' | 'organizer' | 'admin'
  createdAt: string
  organizerApplication?: {
    status: 'pending' | 'approved' | 'rejected'
    appliedAt: string
    reason?: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([])

  // Computed
  const isAuthenticated = computed(() => currentUser.value !== null)
  const isOrganizer = computed(
    () => currentUser.value?.role === 'organizer' || currentUser.value?.role === 'admin',
  )
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  // Initialize from localStorage
  function init() {
    const storedUsers = localStorage.getItem('shuttlehub_users')
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    // 保留舊的 users 資料（用於團長申請等功能）
    if (storedUsers) {
      users.value = JSON.parse(storedUsers)
    } else {
      // Create default test accounts
      users.value = [
        {
          id: 'admin-1',
          email: 'admin@shuttlehub.com',
          password: 'admin123',
          name: '系統管理員',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'organizer-1',
          email: 'organizer@test.com',
          password: 'password123',
          name: '團長測試',
          role: 'organizer',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'member-1',
          email: 'member@test.com',
          password: 'password123',
          name: '會員測試',
          role: 'member',
          createdAt: new Date().toISOString(),
        },
      ]
      saveUsers()
    }

    // 從後端 API 載入使用者資訊
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser)
        currentUser.value = {
          id: user.id.toString(),
          email: user.email,
          password: '',
          name: user.name,
          role: user.role.toLowerCase() as 'member' | 'organizer' | 'admin',
          createdAt: user.createdAt || new Date().toISOString(),
        }
      } catch (error) {
        console.error('載入使用者資訊失敗:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }

  // Helper to save users to localStorage
  function saveUsers() {
    localStorage.setItem('shuttlehub_users', JSON.stringify(users.value))
  }

  // Register new user
  async function register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post('/auth/register', { email, password, name })

      if (response.data.success) {
        // 儲存 Token 和使用者資訊
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))

        // 更新當前使用者
        currentUser.value = {
          id: response.data.data.user.id.toString(),
          email: response.data.data.user.email,
          password: '', // 不儲存密碼
          name: response.data.data.user.name,
          role: response.data.data.user.role.toLowerCase() as 'member' | 'organizer' | 'admin',
          createdAt: new Date().toISOString(),
        }

        return { success: true }
      }

      return { success: false, error: response.data.message || '註冊失敗' }
    } catch (error: any) {
      console.error('註冊錯誤:', error)
      return { success: false, error: error.response?.data?.message || '網路錯誤，請稍後再試' }
    }
  }

  // Login
  async function login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post('/auth/login', { email, password })

      if (response.data.success) {
        // 儲存 Token 和使用者資訊
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))

        // 更新當前使用者
        currentUser.value = {
          id: response.data.data.user.id.toString(),
          email: response.data.data.user.email,
          password: '', // 不儲存密碼
          name: response.data.data.user.name,
          role: response.data.data.user.role.toLowerCase() as 'member' | 'organizer' | 'admin',
          createdAt: new Date().toISOString(),
        }

        return { success: true }
      }

      return { success: false, error: response.data.message || '登入失敗' }
    } catch (error: any) {
      console.error('登入錯誤:', error)
      return { success: false, error: error.response?.data?.message || '網路錯誤，請稍後再試' }
    }
  }

  // Logout
  function logout() {
    currentUser.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('shuttlehub_current_user_id')
  }

  // Apply to become organizer
  function applyForOrganizer(reason: string): { success: boolean; error?: string } {
    if (!currentUser.value) {
      return { success: false, error: '請先登入' }
    }

    if (currentUser.value.role !== 'member') {
      return { success: false, error: '您已經是團長或管理員' }
    }

    if (currentUser.value.organizerApplication?.status === 'pending') {
      return { success: false, error: '您已經提交過申請，請等待審核' }
    }

    // Update user with application
    currentUser.value.organizerApplication = {
      status: 'pending',
      appliedAt: new Date().toISOString(),
      reason,
    }

    // Update in users array
    const userIndex = users.value.findIndex((u) => u.id === currentUser.value!.id)
    if (userIndex !== -1) {
      users.value[userIndex] = { ...currentUser.value }
      saveUsers()
    }

    return { success: true }
  }

  // Get pending organizer applications (admin only)
  const pendingApplications = computed(() => {
    return users.value.filter((u) => u.organizerApplication?.status === 'pending')
  })

  // Approve organizer application (admin only)
  function approveOrganizerApplication(userId: string): { success: boolean; error?: string } {
    if (!isAdmin.value) {
      return { success: false, error: '權限不足' }
    }

    const user = users.value.find((u) => u.id === userId)
    if (!user) {
      return { success: false, error: '使用者不存在' }
    }

    if (!user.organizerApplication || user.organizerApplication.status !== 'pending') {
      return { success: false, error: '無待審核的申請' }
    }

    // Update user role and application status
    user.role = 'organizer'
    user.organizerApplication.status = 'approved'

    saveUsers()

    // Update current user if it's the same user
    if (currentUser.value?.id === userId) {
      currentUser.value = { ...user }
    }

    return { success: true }
  }

  // Reject organizer application (admin only)
  function rejectOrganizerApplication(userId: string): { success: boolean; error?: string } {
    if (!isAdmin.value) {
      return { success: false, error: '權限不足' }
    }

    const user = users.value.find((u) => u.id === userId)
    if (!user) {
      return { success: false, error: '使用者不存在' }
    }

    if (!user.organizerApplication || user.organizerApplication.status !== 'pending') {
      return { success: false, error: '無待審核的申請' }
    }

    // Update application status
    user.organizerApplication.status = 'rejected'

    saveUsers()

    // Update current user if it's the same user
    if (currentUser.value?.id === userId) {
      currentUser.value = { ...user }
    }

    return { success: true }
  }

  // Initialize on store creation
  init()

  return {
    currentUser,
    users,
    isAuthenticated,
    isOrganizer,
    isAdmin,
    pendingApplications,
    register,
    login,
    logout,
    applyForOrganizer,
    approveOrganizerApplication,
    rejectOrganizerApplication,
  }
})
