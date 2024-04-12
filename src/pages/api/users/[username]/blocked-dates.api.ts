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

  const blockedDatesRaw = await prisma.$queryRaw`
    SELECT
      *
    FROM schedulings s
    WHERE s.userId = ${user.id}
    AND DATE_FORMAT(s.date, "%Y-%m") = ${`${year}-${month}`}
  `

  return response.json({
    blockedWeekDays,
  })
}
