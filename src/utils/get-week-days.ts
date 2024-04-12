interface GetWeekDaysParams {
  short?: Intl.DateTimeFormatOptions["weekday"]
  lang?: string
}

export function getWeekDays({
  short = "long",
  lang = "pt-BR",
}: GetWeekDaysParams = {}) {
  const weekdayFormatter = new Intl.DateTimeFormat(lang, {
    weekday: short,
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

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
