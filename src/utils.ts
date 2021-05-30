export const formatNumber = (num: number, targetLength: number) => {
  const str = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    notation: 'compact'
  } as any).format(num)
  return str.padStart(targetLength, ' ')
}

export const formatDuration = (ms: number, targetLength: number) => {
  const seconds = ms / 1000

  let unit
  let value
  if (seconds > 60) {
    unit = 'minute'
    value = seconds / 60
  } else {
    unit = 'second'
    value = seconds
  }

  const str = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 3,
    notation: 'compact',
    style: 'unit',
    unit,
    unitDisplay: 'narrow'
  } as any).format(value)
  return str.padStart(targetLength, ' ')
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters
const OPTIONS = {
  day: 'numeric' as 'numeric' | '2-digit' | undefined,
  weekday: 'short' as 'narrow' | 'short' | 'long' | undefined,
  month: 'short' as
    | 'narrow'
    | 'short'
    | 'long'
    | 'numeric'
    | '2-digit'
    | undefined,
  year: 'numeric' as 'numeric' | '2-digit' | undefined
}

export const formatDate = (isoString: string) => {
  const date = Date.parse(isoString)
  return new Intl.DateTimeFormat('en-GB', OPTIONS).format(date)
}

export const formatDay = (isoString: string) => {
  const date = Date.parse(isoString)
  const parts = new Intl.DateTimeFormat('en-GB', OPTIONS).formatToParts(date)
  const day = parts.filter((p) => p.type === 'day')[0]
  const month = parts.filter((p) => p.type === 'month')[0]
  return `${month.value} ${day.value}`
}

// console.log('=== formatDay ===', formatDay('2021-05-30T19:26:17.324Z'))
