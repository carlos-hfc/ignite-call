import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"

import { api } from "@/lib/axios"
import { capitalizeFirstLetter, getWeekDays } from "@/utils/get-week-days"

import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./styles"

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected(date: Date): void
}

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1)
  })

  const router = useRouter()
  const username = String(router.query.username)

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, "month")

    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, "month")

    setCurrentDate(nextMonthDate)
  }

  const weekDays = getWeekDays({ short: "short" })

  const currentMonth = currentDate.format("MMMM")
  const currentYear = currentDate.format("YYYY")

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      "blockedDates",
      currentDate.get("year"),
      String(currentDate.get("month") + 1).padStart(2, "0"),
    ],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get("year"),
          month: String(currentDate.get("month") + 1).padStart(2, "0"),
        },
      })

      return response.data
    },
  })

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set("date", i + 1)
    })

    const firstWeekDay = currentDate.get("day")

    const previousMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, i) => {
        return currentDate.subtract(i + 1, "day")
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get("day")

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, "day")
    })

    const calendarDays = [
      ...previousMonthFillArray.map(date => ({ date, disabled: true })),
      ...daysInMonthArray.map(date => ({
        date,
        disabled:
          date.endOf("day").isBefore(new Date()) ||
          blockedDates?.blockedWeekDays.includes(date.get("day")) ||
          blockedDates?.blockedDates.includes(date.get("date")),
      })),
      ...nextMonthFillArray.map(date => ({ date, disabled: true })),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeek[]>(
      (prev, _, index, array) => {
        const isNewWeek = index % 7 === 0

        if (isNewWeek) {
          prev.push({
            week: index / 7 + 1,
            days: array.slice(index, index + 7),
          })
        }

        return prev
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {capitalizeFirstLetter(currentMonth)} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            onClick={handlePreviousMonth}
            aria-label="Mês anterior"
            title="Mês anterior"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNextMonth}
            aria-label="Próximo mês"
            title="Próximo mês"
          >
            <ChevronRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {weekDays.map(weekDay => (
              <th key={weekDay}>{weekDay.toUpperCase()}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(day => (
                <td key={day.date.toString()}>
                  <CalendarDay
                    disabled={day.disabled}
                    onClick={() => onDateSelected(day.date.toDate())}
                  >
                    {day.date.get("date")}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
