import { ChevronLeft, ChevronRight } from "lucide-react"

import { getWeekDays } from "@/utils/get-week-days"

import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./styles"

export function Calendar() {
  const weekDays = getWeekDays({ short: "short" })

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          Abril <span>2024</span>
        </CalendarTitle>

        <CalendarActions>
          <button>
            <ChevronLeft />
          </button>
          <button>
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
          {Array.from({ length: 4 }).map((_, i) => (
            <tr key={i}>
              <td>
                <CalendarDay>1</CalendarDay>
              </td>
              <td>
                <CalendarDay>2</CalendarDay>
              </td>
              <td>
                <CalendarDay disabled>3</CalendarDay>
              </td>
              <td>
                <CalendarDay>4</CalendarDay>
              </td>
              <td>
                <CalendarDay>5</CalendarDay>
              </td>
              <td>
                <CalendarDay>6</CalendarDay>
              </td>
              <td>
                <CalendarDay>7</CalendarDay>
              </td>
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
