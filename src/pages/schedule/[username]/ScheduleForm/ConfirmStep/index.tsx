import { Button, Text, Textarea, TextInput } from "@carlos-hfc-ignite-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { Calendar, Clock } from "lucide-react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { api } from "@/lib/axios"

import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles"

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve conter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Digite um e-mail válido" }),
  observations: z.string().nullable(),
})

type ConfirmFormSchema = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation(): void
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormSchema>({
    resolver: zodResolver(confirmFormSchema),
  })

  const router = useRouter()
  const username = router.query.username

  async function handleConfirmScheduling({
    name,
    email,
    observations,
  }: ConfirmFormSchema) {
    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date: schedulingDate,
    })

    onCancelConfirmation()
  }

  const describedDate = dayjs(schedulingDate).format("DD [de] MMMM [de] YYYY")
  const describedTime = dayjs(schedulingDate).format("HH:mm")

  return (
    <ConfirmForm
      as="form"
      onSubmit={handleSubmit(handleConfirmScheduling)}
    >
      <FormHeader>
        <Text>
          <Calendar />
          {describedDate}
        </Text>

        <Text>
          <Clock />
          {describedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput
          placeholder="Seu nome"
          {...register("name")}
        />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">E-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register("email")}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observaçoes</Text>
        <Textarea {...register("observations")} />
      </label>

      <FormActions>
        <Button
          type="button"
          variant="tertiary"
          onClick={onCancelConfirmation}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
