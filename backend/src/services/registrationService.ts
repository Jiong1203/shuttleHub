import { PrismaClient, RegistrationStatus, Role } from '@prisma/client'

// 模擬 Prisma Client (直到資料庫準備好)
const prisma = new PrismaClient()

export const registerForEvent = async (
  eventId: number,
  userId: number,
  participantName: string,
  numberOfPeople: number,
) => {
  // 1. 檢查活動是否存在
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { registrations: true },
  })

  if (!event) {
    throw new Error('找不到此活動')
  }

  // 2. 檢查是否已報名
  const existingRegistration = await prisma.registration.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  })

  if (existingRegistration) {
    throw new Error('您已報名過此活動')
  }

  // 3. 計算目前報名人數
  const currentAttendees = event.registrations
    .filter((r) => r.status === RegistrationStatus.CONFIRMED)
    .reduce((sum, r) => sum + r.numberOfPeople, 0)

  // 4. 判斷是否需要候補
  let status: RegistrationStatus = RegistrationStatus.CONFIRMED
  if (currentAttendees + numberOfPeople > event.maxAttendees) {
    status = RegistrationStatus.WAITLISTED
  }

  // 5. 建立報名
  const registration = await prisma.registration.create({
    data: {
      userId,
      eventId,
      participantName,
      numberOfPeople,
      status,
    },
  })

  return registration
}

export const cancelRegistration = async (
  registrationId: number,
  userId: number,
  userRole: Role,
) => {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { event: true },
  })

  if (!registration) {
    throw new Error('找不到此報名紀錄')
  }

  // 檢查權限：只有本人、主辦人或管理員可以取消
  if (
    userRole !== Role.ADMIN &&
    registration.userId !== userId &&
    registration.event.organizerId !== userId
  ) {
    throw new Error('您無權取消此報名')
  }

  await prisma.registration.delete({
    where: { id: registrationId },
  })

  // TODO: 這裡可以加入自動遞補邏輯 (Optional)
}

export const getUserRegistrations = async (userId: number) => {
  const registrations = await prisma.registration.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          organizer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return registrations
}
