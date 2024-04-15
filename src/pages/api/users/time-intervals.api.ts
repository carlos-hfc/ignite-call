import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

import { buildNextAuthOptions } from "../auth/[...nextauth].api"

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).end()
  }

  const session = await getServerSession(
    request,
    response,
    buildNextAuthOptions(request, response),
  )

  if (!session) {
    return response.status(401).end()
  }

  const { intervals } = timeIntervalsBodySchema.parse(request.body)

  await prisma.userTimeInterval.createMany({
    data: intervals.map(interval => {
      return {
        weekDay: interval.weekDay,
        startTimeInMinutes: interval.startTimeInMinutes,
        endTimeInMinutes: interval.endTimeInMinutes,
        userId: session.user.id,
      }
    }),
  })

  return response.status(201).end()
}
