import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  maxParticipants: number
  organizerId: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  price: number
}

export interface Registration {
  id: string
  eventId: string
  userId: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp: string
}

export const useEventStore = defineStore('events', () => {
  // Mock Data
  const currentUser = ref<User>({
    id: 'u1',
    name: 'Current User',
    email: 'user@example.com'
  })

  const events = ref<Event[]>([
    {
      id: 'e1',
      title: 'Friday Night Badminton',
      date: '2023-11-24',
      time: '19:00',
      location: 'Downtown Sports Center',
      description: 'Casual games, all levels welcome!',
      maxParticipants: 8,
      organizerId: 'u1',
      level: 'All Levels',
      price: 150
    },
    {
      id: 'e2',
      title: 'Advanced Training Session',
      date: '2023-11-25',
      time: '14:00',
      location: 'City Gym Court 3',
      description: 'High intensity training for advanced players.',
      maxParticipants: 4,
      organizerId: 'u2',
      level: 'Advanced',
      price: 300
    }
  ])

  const registrations = ref<Registration[]>([
    {
      id: 'r1',
      eventId: 'e1',
      userId: 'u2',
      status: 'approved',
      timestamp: new Date().toISOString()
    }
  ])

  // Getters
  const getEventById = computed(() => (id: string) => events.value.find(e => e.id === id))
  
  const getRegistrationsByEventId = computed(() => (eventId: string) => 
    registrations.value.filter(r => r.eventId === eventId)
  )

  // Actions
  function createEvent(eventData: Omit<Event, 'id' | 'organizerId'>) {
    const newEvent: Event = {
      ...eventData,
      id: `e${Date.now()}`,
      organizerId: currentUser.value.id
    }
    events.value.push(newEvent)
    return newEvent
  }

  function deleteEvent(id: string) {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value.splice(index, 1)
    }
  }

  function registerForEvent(eventId: string) {
    const existing = registrations.value.find(r => r.eventId === eventId && r.userId === currentUser.value.id)
    if (existing) return

    const newRegistration: Registration = {
      id: `r${Date.now()}`,
      eventId,
      userId: currentUser.value.id,
      status: 'pending',
      timestamp: new Date().toISOString()
    }
    registrations.value.push(newRegistration)
  }

  return {
    currentUser,
    events,
    registrations,
    getEventById,
    getRegistrationsByEventId,
    createEvent,
    deleteEvent,
    registerForEvent
  }
})
