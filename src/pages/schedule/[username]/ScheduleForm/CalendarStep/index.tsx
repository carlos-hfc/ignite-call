import dayjs from "dayjs"
import { useState } from "react"

import { Calendar } from "@/components/Calendar"

import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles"

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate

  const weekDay = isDateSelected && dayjs(selectedDate).format("dddd")
  const describedDate =
    isDateSelected && dayjs(selectedDate).format("DD [de] MMMM")

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
            {Array.from({ length: 11 }).map((_, i) => (
              <TimePickerItem key={i}>
                {String(i + 8).padStart(2, "0")}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
