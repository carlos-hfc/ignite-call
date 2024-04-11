export function getWeekDays(lang: string = "pt-BR") {
  const weekdayFormatter = new Intl.DateTimeFormat(lang, {
    weekday: "long",
  })
  const daysOfWeek: string[] = []

  for (let day = 0; day < 7; day++) {
    const date = new Date(Date.UTC(2021, 5, day))
    const weekday = formatWeekday(date, weekdayFormatter)
    daysOfWeek.push(capitalizeFirstLetter(weekday))
  }

  return daysOfWeek
}

function formatWeekday(date: Date, formatter: Intl.DateTimeFormat) {
  return formatter.format(date)
}

function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
