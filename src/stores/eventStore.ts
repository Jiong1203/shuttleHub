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
  startTime: string
  endTime: string
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
  name: string
  count: number
  status: 'pending' | 'approved' | 'rejected' | 'waitlist'
  timestamp: string
}

export const useEventStore = defineStore('events', () => {
  // Mock Data
  const currentUser = ref<User>({
    id: 'u1',
    name: 'Current User',
    email: 'user@example.com',
  })

  const events = ref<Event[]>([
    {
      id: 'e1',
      title: 'Friday Night Badminton',
      date: '2023-11-24',
      startTime: '19:00',
      endTime: '21:00',
      location: 'Downtown Sports Center',
      description: 'Casual games, all levels welcome!',
      maxParticipants: 8,
      organizerId: 'u1',
      level: 'All Levels',
      price: 150,
    },
    {
      id: 'e2',
      title: 'Advanced Training Session',
      date: '2023-11-25',
      startTime: '14:00',
      endTime: '16:00',
      location: 'City Gym Court 3',
      description: 'High intensity training for advanced players.',
      maxParticipants: 4,
      organizerId: 'u2',
      level: 'Advanced',
      price: 300,
    },
  ])

  const registrations = ref<Registration[]>([
    {
      id: 'r1',
      eventId: 'e1',
      userId: 'u2',
      name: 'Alice',
      count: 1,
      status: 'approved',
      timestamp: new Date().toISOString(),
    },
  ])

  // Getters
  const getEventById = computed(() => (id: string) => events.value.find((e) => e.id === id))

  const getRegistrationsByEventId = computed(
    () => (eventId: string) => registrations.value.filter((r) => r.eventId === eventId),
  )

  // Actions
  function createEvent(eventData: Omit<Event, 'id' | 'organizerId'>) {
    const newEvent: Event = {
      ...eventData,
      id: `e${Date.now()}`,
      organizerId: currentUser.value.id,
    }
    events.value.push(newEvent)
    return newEvent
  }

  function deleteEvent(id: string) {
    const index = events.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      events.value.splice(index, 1)
    }
  }

  function registerForEvent(eventId: string, name: string, count: number) {
    const existing = registrations.value.find(
      (r) => r.eventId === eventId && r.userId === currentUser.value.id,
    )
    if (existing) {
      // Update existing registration
      existing.name = name
      existing.count = count
      // Re-evaluate status if needed, for now keep as is or reset to pending?
      // Let's keep it simple: if updating, maybe just update details.
      // But user might want to change count.
      return
    }

    const event = events.value.find((e) => e.id === eventId)
    if (!event) return

    const currentParticipants = registrations.value
      .filter((r) => r.eventId === eventId && (r.status === 'approved' || r.status === 'pending'))
      .reduce((sum, r) => sum + r.count, 0)

    const status = currentParticipants + count > event.maxParticipants ? 'waitlist' : 'pending'

    const newRegistration: Registration = {
      id: `r${Date.now()}`,
      eventId,
      userId: currentUser.value.id,
      name,
      count,
      status,
      timestamp: new Date().toISOString(),
    }
    registrations.value.push(newRegistration)
  }

  function updateRegistration(id: string, updates: Partial<Registration>) {
    const reg = registrations.value.find((r) => r.id === id)
    if (!reg) return

    const event = events.value.find((e) => e.id === reg.eventId)
    if (!event) return

    // If count is increasing, check if we need to move to waitlist
    if (updates.count !== undefined && updates.count > reg.count) {
      const otherParticipants = registrations.value
        .filter(
          (r) =>
            r.eventId === reg.eventId &&
            r.id !== reg.id &&
            (r.status === 'approved' || r.status === 'pending'),
        )
        .reduce((sum, r) => sum + r.count, 0)

      if (otherParticipants + updates.count > event.maxParticipants) {
        updates.status = 'waitlist'
      } else {
        // If previously waitlisted but now fits (unlikely if increasing, but possible if others left),
        // or if it was pending/approved and still fits, keep/set to pending/approved.
        // For simplicity, if it fits, we can set to pending (if it was waitlist) or keep current.
        if (reg.status === 'waitlist') {
          updates.status = 'pending'
        }
      }
    } else if (updates.count !== undefined && updates.count < reg.count) {
      // If decreasing count, and was waitlisted, check if it now fits?
      // For now, let's just update the count.
      // Auto-promoting from waitlist is complex, let's leave it for now.
      // But if THIS registration was waitlisted and now fits, we could promote it.
      if (reg.status === 'waitlist') {
        const otherParticipants = registrations.value
          .filter(
            (r) =>
              r.eventId === reg.eventId &&
              r.id !== reg.id &&
              (r.status === 'approved' || r.status === 'pending'),
          )
          .reduce((sum, r) => sum + r.count, 0)

        if (otherParticipants + updates.count <= event.maxParticipants) {
          updates.status = 'pending'
        }
      }
    }

    Object.assign(reg, updates)
  }

  function cancelRegistration(id: string) {
    const index = registrations.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      registrations.value.splice(index, 1)
    }
  }

  return {
    currentUser,
    events,
    registrations,
    getEventById,
    getRegistrationsByEventId,
    createEvent,
    deleteEvent,
    registerForEvent,
    updateRegistration,
    cancelRegistration,
  }
})
