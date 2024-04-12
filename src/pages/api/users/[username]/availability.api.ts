import dayjs from "dayjs"
import { NextApiRequest, NextApiResponse } from "next"

import { prisma } from "@/lib/prisma"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "GET") {
    return response.status(405).end()
  }

  const username = String(request.query.username)
  const { date } = request.query

  if (!date) {
    return response.status(400).json({
      message: "Date not provided.",
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return response.status(404).json({
      message: "User not found.",
    })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf("day").isBefore(new Date())

  if (isPastDate) {
    return response.json({
      availableTimes: [],
      possibleTimes: [],
    })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      userId: user.id,
      weekDay: referenceDate.get("day"),
    },
  })

  if (!userAvailability) {
    return response.json({
      availableTimes: [],
      possibleTimes: [],
    })
  }

  const { startTimeInMinutes, endTimeInMinutes } = userAvailability

  const startHour = startTimeInMinutes / 60
  const endHour = endTimeInMinutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    where: {
      userId: user.id,
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
    },
    select: {
      date: true,
    },
  })

  const availableTimes = possibleTimes.filter(time => {
    return !blockedTimes.some(block => block.date.getHours() === time)
  })

  return response.json({
    availableTimes,
    possibleTimes,
  })
}