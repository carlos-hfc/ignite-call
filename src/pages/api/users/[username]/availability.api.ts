import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { NextApiRequest, NextApiResponse } from "next"

import { prisma } from "@/lib/prisma"

dayjs.extend(utc)

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "GET") {
    return response.status(405).end()
  }

  const username = String(request.query.username)
  const { date, timezoneOffset } = request.query

  if (!date || !timezoneOffset) {
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

  const timezoneOffsetInHours = Number(timezoneOffset) / 60
  const referenceDateTimezoneOffsetInHours =
    referenceDate.toDate().getTimezoneOffset() / 60

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
        gte: referenceDate
          .set("hour", startHour)
          .add(timezoneOffsetInHours, "hours")
          .toDate(),
        lte: referenceDate
          .set("hour", endHour)
          .add(timezoneOffsetInHours, "hours")
          .toDate(),
      },
    },
    select: {
      date: true,
    },
  })

  const availableTimes = possibleTimes.filter(time => {
    const isTimeBlocked = blockedTimes.some(
      block => block.date.getUTCHours() - timezoneOffsetInHours === time,
    )

    const isTimeInPast = referenceDate
      .set("hour", time)
      .subtract(referenceDateTimezoneOffsetInHours, "hours")
      .isBefore(dayjs().utc().subtract(timezoneOffsetInHours, "hours"))

    return !isTimeBlocked && !isTimeInPast
  })

  return response.json({
    availableTimes,
    possibleTimes,
  })
}
