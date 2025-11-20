import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/events',
      name: 'events',
      component: EventListView,
    },
    {
      path: '/events/create',
      name: 'event-create',
      component: () => import('../views/events/EventCreateView.vue'),
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
    },
    {
      path: '/events/:id/participants',
      name: 'event-participants',
      component: () => import('../views/events/EventParticipantsView.vue'),
    },
  ],
})

export default router
