import { NextApiRequest, NextApiResponse, NextPageContext } from "next"
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"

import { PrismaAdapter } from "@/lib/auth/prisma-adapter"

export function buildNextAuthOptions(
  request: NextApiRequest | NextPageContext["req"],
  response: NextApiResponse | NextPageContext["res"],
): AuthOptions {
  return {
    adapter: PrismaAdapter(request, response),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        authorization: {
          params: {
            scope:
              "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar",
          },
        },
        profile(profile: GoogleProfile) {
          return {
            avatarUrl: profile.picture,
            email: profile.email,
            id: profile.sub,
            name: profile.name,
            username: "",
          }
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async signIn({ account }) {
        if (
          !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
        ) {
          return "/register/connect-calendar?error=permissions"
        }

        return true
      },

      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  return await NextAuth(
    request,
    response,
    buildNextAuthOptions(request, response),
  )
}
