import dayjs from "dayjs"
import { google } from "googleapis"

import { prisma } from "./prisma"

export async function getGoogleOAuthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: "google",
      userId,
    },
  })

  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })

  auth.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
    expiry_date: account.expiresAt ? account.expiresAt * 1000 : null,
  })

  if (!account.expiresAt) {
    return auth
  }

  const isTokenExpired = dayjs(account.expiresAt * 1000).isBefore(new Date())

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        accessToken: credentials.access_token,
        expiresAt: credentials.expiry_date
          ? Math.floor(credentials.expiry_date / 1000)
          : null,
        idToken: credentials.id_token,
        refreshToken: credentials.refresh_token,
        scope: credentials.scope,
        tokenType: credentials.token_type,
      },
    })

    auth.setCredentials({
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      expiry_date: credentials.expiry_date,
    })
  }

  return auth
}
