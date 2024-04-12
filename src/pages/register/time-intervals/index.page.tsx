import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@carlos-hfc-ignite-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/router"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { api } from "@/lib/axios"
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes"
import { getWeekDays } from "@/utils/get-week-days"

import { Container, Header } from "../styles"
import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from "./styles"

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.string(),
        weekDayIndex: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform(intervals => intervals.filter(item => item.enabled))
    .refine(intervals => intervals.length > 0, {
      message: "Você precisa selecionar pelo menos um dia da semana!",
    })
    .transform(intervals => {
      return intervals.map(item => {
        return {
          weekDay: item.weekDayIndex,
          startTimeInMinutes: convertTimeStringToMinutes(item.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(item.endTime),
        }
      })
    })
    .refine(
      intervals => {
        return intervals.every(
          item => item.endTimeInMinutes - 60 >= item.startTimeInMinutes,
        )
      },
      {
        message: "O intervalo de horas deve ser de, no mínimo, 1 hora",
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const weekDays = getWeekDays()

  const router = useRouter()

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsFormInput, any, TimeIntervalsFormOutput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: weekDays.map((weekDay, index) => ({
        weekDay,
        weekDayIndex: index,
        enabled: !(index === 0 || index === 6),
        startTime: "08:00",
        endTime: "18:00",
      })),
    },
  })

  const { fields } = useFieldArray({
    name: "intervals",
    control,
  })

  const intervals = watch("intervals")

  async function handleSetTimeIntervals({
    intervals,
  }: TimeIntervalsFormOutput) {
    await api.post("/users/time-intervals", {
      intervals,
    })

    await router.push("/register/update-profile")
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá!</Heading>

        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep
          size={4}
          currentStep={3}
        />
      </Header>

      <IntervalBox
        as="form"
        onSubmit={handleSubmit(handleSetTimeIntervals)}
      >
        <IntervalsContainer>
          {fields.map(field => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller
                  name={`intervals.${field.weekDayIndex}.enabled`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      onCheckedChange={checked =>
                        field.onChange(checked === true)
                      }
                      checked={field.value}
                    />
                  )}
                />
                <Text>{field.weekDay}</Text>
              </IntervalDay>

              <IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={!intervals[field.weekDayIndex].enabled}
                  {...register(`intervals.${field.weekDayIndex}.startTime`)}
                />
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={!intervals[field.weekDayIndex].enabled}
                  {...register(`intervals.${field.weekDayIndex}.endTime`)}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalsContainer>

        {errors?.intervals?.root?.message && (
          <FormError size="sm">{errors.intervals.root.message}</FormError>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
