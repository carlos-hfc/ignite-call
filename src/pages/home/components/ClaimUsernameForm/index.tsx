import { Button, Text, TextInput } from "@carlos-hfc-ignite-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormAnnotation } from "./styles"

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "O usuário deve conter pelo menos 3 caracteres",
    })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hifens",
    })
    .transform(value => value.toLowerCase()),
})

type ClaimUsernameFormSchema = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormSchema>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername({ username }: ClaimUsernameFormSchema) {
    await router.push({
      pathname: "/register",
      query: {
        username,
      },
    })
  }

  return (
    <>
      <Form
        as="form"
        onSubmit={handleSubmit(handleClaimUsername)}
      >
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register("username")}
        />
        <Button
          size="sm"
          type="submit"
          disabled={isSubmitting}
        >
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : "Digite o nome do usuário"}
        </Text>
      </FormAnnotation>
    </>
  )
}
