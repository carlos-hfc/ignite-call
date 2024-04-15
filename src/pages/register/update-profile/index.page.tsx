import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  Textarea,
} from "@carlos-hfc-ignite-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import { NextSeo } from "next-seo"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { api } from "@/lib/axios"
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api"

import { Container, Header } from "../styles"
import { FormAnnotation, ProfileBox } from "./styles"

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
  })

  const router = useRouter()
  const session = useSession()

  async function handleUpdateProfile({ bio }: UpdateProfileSchema) {
    await api.put("/users/profile", {
      bio,
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  return (
    <>
      <NextSeo
        title="Atualize o seu perfil | Ignite Call"
        noindex
      />

      <Container>
        <Header>
          <Heading as="strong">Defina sua disponibilidade</Heading>

          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

          <MultiStep
            size={4}
            currentStep={4}
          />
        </Header>

        <ProfileBox
          as="form"
          onSubmit={handleSubmit(handleUpdateProfile)}
        >
          <label>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatarUrl}
              alt={session.data?.user.name}
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <Textarea {...register("bio")} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            Finalizar
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
