import {
  Button,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@carlos-hfc-ignite-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { api } from "@/lib/axios"

import { Container, Form, FormError, Header } from "./styles"

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "O usuário deve conter pelo menos 3 caracteres",
    })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hifens",
    }),
  name: z.string().min(3, {
    message: "O nome deve conter pelo menos 3 caracteres",
  }),
})

type RegisterFormSchema = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue("username", String(router.query.username))
    }
  }, [router?.query?.username, setValue])

  async function handleRegister(data: RegisterFormSchema) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      })
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        alert(error.response?.data?.message)
      }
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep
          size={4}
          currentStep={1}
        />
      </Header>

      <Form
        as="form"
        onSubmit={handleSubmit(handleRegister)}
      >
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register("username")}
          />
          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput
            placeholder="Seu nome"
            {...register("name")}
          />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
