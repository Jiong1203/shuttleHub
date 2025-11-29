import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import api from '../services/api'

export interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  description: string
  maxAttendees: number
  organizerId: string
  price: number
  organizer?: {
    id: number
    name: string
    email: string
  }
  registrations?: Registration[]
}

export interface Registration {
  id: string
  eventId: string
  userId: string
  participantName: string
  numberOfPeople: number
  status: 'CONFIRMED' | 'WAITLISTED'
  createdAt: string
  updatedAt: string
}

export const useEventStore = defineStore('events', () => {
  const authStore = useAuthStore()

  // State
  const events = ref<Event[]>([])
  const registrations = ref<Registration[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getEventById = computed(() => (id: string) => events.value.find((e) => e.id === id))

  const getRegistrationsByEventId = computed(
    () => (eventId: string) => registrations.value.filter((r) => r.eventId === eventId),
  )

  // Actions
  async function fetchEvents() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/events')
      if (response.data.success) {
        events.value = response.data.data.events.map((event: any) => ({
          id: event.id.toString(),
          title: event.title,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          description: event.description,
          maxAttendees: event.maxAttendees,
          organizerId: event.organizerId.toString(),
          price: event.price,
          organizer: event.organizer,
          registrations: event.registrations,
        }))
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '載入活動失敗'
      console.error('載入活動錯誤:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchEventById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/events/${id}`)
      if (response.data.success) {
        const event = response.data.data
        return {
          id: event.id.toString(),
          title: event.title,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          description: event.description,
          maxAttendees: event.maxAttendees,
          organizerId: event.organizerId.toString(),
          price: event.price,
          organizer: event.organizer,
          registrations: event.registrations,
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '載入活動詳情失敗'
      console.error('載入活動詳情錯誤:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createEvent(eventData: {
    title: string
    description: string
    date: string
    startTime: string
    endTime: string
    location: string
    price: number
    maxAttendees: number
  }) {
    if (!authStore.currentUser) {
      throw new Error('必須登入才能建立活動')
    }

    loading.value = true
    error.value = null
    try {
      const response = await api.post('/events', eventData)
      if (response.data.success) {
        const newEvent = response.data.data
        const event = {
          id: newEvent.id.toString(),
          title: newEvent.title,
          date: newEvent.date,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          location: newEvent.location,
          description: newEvent.description,
          maxAttendees: newEvent.maxAttendees,
          organizerId: newEvent.organizerId.toString(),
          price: newEvent.price,
        }
        events.value.push(event)
        return event
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '建立活動失敗'
      console.error('建立活動錯誤:', err)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function updateEvent(id: string, updates: Partial<Event>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/events/${id}`, updates)
      if (response.data.success) {
        const updatedEvent = response.data.data
        const index = events.value.findIndex((e) => e.id === id)
        if (index !== -1) {
          events.value[index] = {
            ...events.value[index],
            ...updatedEvent,
            id: updatedEvent.id.toString(),
            organizerId: updatedEvent.organizerId.toString(),
          }
        }
        return updatedEvent
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '更新活動失敗'
      console.error('更新活動錯誤:', err)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function deleteEvent(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`/events/${id}`)
      if (response.data.success) {
        const index = events.value.findIndex((e) => e.id === id)
        if (index !== -1) {
          events.value.splice(index, 1)
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '刪除活動失敗'
      console.error('刪除活動錯誤:', err)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function registerForEvent(
    eventId: string,
    participantName: string,
    numberOfPeople: number,
  ) {
    if (!authStore.currentUser) {
      throw new Error('必須登入才能報名')
    }

    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/events/${eventId}/register`, {
        participantName,
        numberOfPeople,
      })
      if (response.data.success) {
        const newRegistration = response.data.data
        const registration = {
          id: newRegistration.id.toString(),
          eventId: newRegistration.eventId.toString(),
          userId: newRegistration.userId.toString(),
          participantName: newRegistration.participantName,
          numberOfPeople: newRegistration.numberOfPeople,
          status: newRegistration.status,
          createdAt: newRegistration.createdAt,
          updatedAt: newRegistration.updatedAt,
        }
        registrations.value.push(registration)
        return registration
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '報名失敗'
      console.error('報名錯誤:', err)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function cancelRegistration(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`/registrations/${id}`)
      if (response.data.success) {
        const index = registrations.value.findIndex((r) => r.id === id)
        if (index !== -1) {
          registrations.value.splice(index, 1)
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '取消報名失敗'
      console.error('取消報名錯誤:', err)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchMyRegistrations() {
    if (!authStore.currentUser) {
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await api.get('/registrations/me')
      if (response.data.success) {
        registrations.value = response.data.data.map((reg: any) => ({
          id: reg.id.toString(),
          eventId: reg.eventId.toString(),
          userId: reg.userId.toString(),
          participantName: reg.participantName,
          numberOfPeople: reg.numberOfPeople,
          status: reg.status,
          createdAt: reg.createdAt,
          updatedAt: reg.updatedAt,
        }))
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '載入報名紀錄失敗'
      console.error('載入報名紀錄錯誤:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    events,
    registrations,
    loading,
    error,
    getEventById,
    getRegistrationsByEventId,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    fetchMyRegistrations,
  }
})
