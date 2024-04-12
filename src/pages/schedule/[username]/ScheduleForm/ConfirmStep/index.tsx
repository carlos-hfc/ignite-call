import { Button, Text, Textarea, TextInput } from "@carlos-hfc-ignite-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Clock } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles"

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve conter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Digite um e-mail válido" }),
  observations: z.string().nullable(),
})

type ConfirmFormSchema = z.infer<typeof confirmFormSchema>

export function ConfirmStep() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormSchema>({
    resolver: zodResolver(confirmFormSchema),
  })

  async function handleConfirmScheduling(data: ConfirmFormSchema) {}

  return (
    <ConfirmForm
      as="form"
      onSubmit={handleSubmit(handleConfirmScheduling)}
    >
      <FormHeader>
        <Text>
          <Calendar />
          12 de abril de 2024
        </Text>

        <Text>
          <Clock />
          18:00
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