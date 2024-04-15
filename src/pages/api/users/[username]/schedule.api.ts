import dayjs from "dayjs"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).end()
  }

  const username = String(request.query.username)

  const createSchedulingBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string().nullable(),
    date: z.string().datetime(),
  })

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

  const { name, email, observations, date } = createSchedulingBodySchema.parse(
    request.body,
  )

  const schedulingDate = dayjs(date).startOf("hour")

  if (schedulingDate.isBefore(new Date())) {
    return response.status(400).json({
      message: "Date is in the past.",
    })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      userId: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return response.status(400).json({
      message: "There is another scheduling at the same time.",
    })
  }

  await prisma.scheduling.create({
    data: {
      date: schedulingDate.toDate(),
      name,
      email,
      observations,
      userId: user.id,
    },
  })

  return response.status(201).end()
}
