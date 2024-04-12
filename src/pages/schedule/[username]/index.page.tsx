import { Avatar, Heading, Text } from "@carlos-hfc-ignite-ui/react"
import { GetStaticPaths, GetStaticProps } from "next"

import { prisma } from "@/lib/prisma"

import { ScheduleForm } from "./ScheduleForm"
import { Container, UserHeader } from "./styles"

interface SchedulePageProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function SchedulePage({ user }: SchedulePageProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar
          src={user?.avatarUrl}
          alt={user?.name}
        />
        <Heading>{user?.name}</Heading>
        <Text>{user?.bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    },
    revalidate: 60 * 60 * 24, // 1d
  }
}
