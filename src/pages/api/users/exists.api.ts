import type { NextApiRequest, NextApiResponse } from "next"
import { setCookie } from "nookies"

import { prisma } from "@/lib/prisma"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "GET") {
    return response.status(405).end()
  }

  const username = String(request.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return response.status(404).json({
      message: "User not exists.",
    })
  }

  setCookie({ res: response }, `${process.env.COOKIE_PREFIX}userId`, user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7d
    path: "/",
  })

  return response.status(200).end()
}
