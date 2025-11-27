import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
    const storedCurrentUserId = localStorage.getItem('shuttlehub_current_user_id')

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

    if (storedCurrentUserId) {
      const user = users.value.find((u) => u.id === storedCurrentUserId)
      if (user) {
        currentUser.value = user
      }
    }
  }

  // Helper to save users to localStorage
  function saveUsers() {
    localStorage.setItem('shuttlehub_users', JSON.stringify(users.value))
  }

  // Helper to save current user
  function saveCurrentUser() {
    if (currentUser.value) {
      localStorage.setItem('shuttlehub_current_user_id', currentUser.value.id)
    } else {
      localStorage.removeItem('shuttlehub_current_user_id')
    }
  }

  // Register new user
  function register(
    email: string,
    password: string,
    name: string,
  ): { success: boolean; error?: string } {
    // Check if email already exists
    if (users.value.find((u) => u.email === email)) {
      return { success: false, error: '此 Email 已被註冊' }
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password, // In production, this should be hashed on backend
      name,
      role: 'member',
      createdAt: new Date().toISOString(),
    }

    users.value.push(newUser)
    saveUsers()

    // Auto login after registration
    currentUser.value = newUser
    saveCurrentUser()

    return { success: true }
  }

  // Login
  function login(email: string, password: string): { success: boolean; error?: string } {
    const user = users.value.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: '帳號不存在' }
    }

    if (user.password !== password) {
      return { success: false, error: '密碼錯誤' }
    }

    currentUser.value = user
    saveCurrentUser()

    return { success: true }
  }

  // Logout
  function logout() {
    currentUser.value = null
    saveCurrentUser()
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
