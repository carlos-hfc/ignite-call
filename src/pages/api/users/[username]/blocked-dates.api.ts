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
  const { year, month } = request.query

  if (!year || !month) {
    return response.status(400).json({
      message: "Year or month not provided.",
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

  const availableWeeks = await prisma.userTimeInterval.findMany({
    select: {
      weekDay: true,
    },
    where: {
      userId: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(weekDay => {
    return !availableWeeks.some(available => available.weekDay === weekDay)
  })

  const blockedDatesRaw = await prisma.$queryRaw<Array<{ date: number }>>`
    SELECT
      EXTRACT(DAY FROM s.date) as date,
      COUNT(s.date) as amount,
      ((uti.endTimeInMinutes - uti.startTimeInMinutes) / 60) as size
    FROM schedulings s
    LEFT JOIN userTimeIntervals uti
      ON uti.weekDay = WEEKDAY(DATE_ADD(s.date, INTERVAL 1 DAY))
    WHERE s.userId = ${`${user.id}`}
      AND DATE_FORMAT(s.date, "%Y-%m") = ${`${year}-${month}`}
    GROUP BY EXTRACT(DAY FROM s.date),
    ((uti.endTimeInMinutes - uti.startTimeInMinutes) / 60)
    HAVING amount >= size
  `
  const blockedDates = blockedDatesRaw.map(item => item.date)

  return response.json({
    blockedWeekDays,
    blockedDates,
  })
}
