import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import HomeView from '../views/HomeView.vue'
import EventListView from '../views/events/EventListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPasswordView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/events',
      name: 'events',
      component: EventListView,
    },
    {
      path: '/events/create',
      name: 'event-create',
      component: () => import('../views/events/EventCreateView.vue'),
      meta: { requiresAuth: true, requiresOrganizer: true },
    },
    {
      path: '/events/:id',
      name: 'event-detail',
      component: () => import('../views/events/EventDetailView.vue'),
    },
    {
      path: '/events/manage',
      name: 'event-manage',
      component: () => import('../views/events/EventManageView.vue'),
      meta: { requiresAuth: true, requiresOrganizer: true },
    },
    {
      path: '/events/:id/participants',
      name: 'event-participants',
      component: () => import('../views/events/EventParticipantsView.vue'),
      meta: { requiresAuth: true, requiresOrganizer: true },
    },
    {
      path: '/admin/applications',
      name: 'admin-applications',
      component: () => import('../views/admin/ApplicationsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  // Check if route requires organizer role
  if (to.meta.requiresOrganizer && !authStore.isOrganizer) {
    alert('此功能僅限團長使用')
    next({ name: 'home' })
    return
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    alert('此功能僅限管理員使用')
    next({ name: 'home' })
    return
  }

  next()
})

export default router
