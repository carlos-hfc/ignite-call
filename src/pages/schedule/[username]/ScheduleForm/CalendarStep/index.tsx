import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { useState } from "react"

import { Calendar } from "@/components/Calendar"
import { api } from "@/lib/axios"

import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles"

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime(date: Date): void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()
  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = isDateSelected && dayjs(selectedDate).format("dddd")
  const describedDate =
    isDateSelected && dayjs(selectedDate).format("DD [de] MMMM")

  const selectedDateWithoutTime = dayjs(selectedDate).format("YYYY-MM-DD")

  const { data: availability } = useQuery<Availability>({
    queryKey: ["availability", selectedDateWithoutTime],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
          timezoneOffset: selectedDate ? selectedDate.getTimezoneOffset() : 0,
        },
      })

      return response.data
    },
    enabled: isDateSelected,
  })

  function handleSelectTime(hour: number) {
    const dateTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate()

    onSelectDateTime(dateTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar
        selectedDate={selectedDate}
        onDateSelected={setSelectedDate}
      />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes?.map(hour => (
              <TimePickerItem
                key={hour}
                disabled={!availability.availableTimes.includes(hour)}
                onClick={() => handleSelectTime(hour)}
              >
                {String(hour).padStart(2, "0")}:00
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
