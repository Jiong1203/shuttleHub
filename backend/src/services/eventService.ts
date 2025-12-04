import { PrismaClient, Role } from '@prisma/client'

// 模擬 Prisma Client (直到資料庫準備好)
const prisma = new PrismaClient()

export const getAllEvents = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      skip,
      take: limit,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        registrations: true,
      },
      orderBy: {
        date: 'desc',
      },
    }),
    prisma.event.count(),
  ])

  return {
    events,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export const getEventById = async (id: number) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      registrations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!event) {
    throw new Error('找不到此活動')
  }

  return event
}

interface CreateEventData {
  title: string
  description: string
  date: string | Date
  startTime: string
  endTime: string
  location: string
  price: number
  maxAttendees: number
}

export const createEvent = async (eventData: CreateEventData, organizerId: string) => {
  const { title, description, date, startTime, endTime, location, price, maxAttendees } = eventData

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      location,
      price,
      maxAttendees,
      organizerId,
    },
  })

  return event
}

interface UpdateEventData {
  title?: string
  description?: string
  date?: string | Date
  startTime?: string
  endTime?: string
  location?: string
  price?: number
  maxAttendees?: number
}

export const updateEvent = async (
  id: number,
  eventData: UpdateEventData,
  userId: string,
  userRole: Role,
) => {
  const event = await prisma.event.findUnique({ where: { id } })

  if (!event) {
    throw new Error('找不到此活動')
  }

  // 檢查權限：只有主辦人或管理員可以修改
  if (userRole !== Role.ADMIN && event.organizerId !== userId) {
    throw new Error('您無權修改此活動')
  }

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      ...eventData,
      date: eventData.date ? new Date(eventData.date) : undefined,
    },
  })

  return updatedEvent
}

export const deleteEvent = async (id: number, userId: string, userRole: Role) => {
  const event = await prisma.event.findUnique({ where: { id } })

  if (!event) {
    throw new Error('找不到此活動')
  }

  // 檢查權限：只有主辦人或管理員可以刪除
  if (userRole !== Role.ADMIN && event.organizerId !== userId) {
    throw new Error('您無權刪除此活動')
  }

  await prisma.event.delete({ where: { id } })
}
