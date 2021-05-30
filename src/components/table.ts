import { Metric } from '../interfaces'
import { formatDay, formatDuration, formatNumber } from '../utils'

interface HeaderProps {
  dayStringLength: number
  targetLengthNumber: number
  targetLengthDuration: number
}

const tableHeader = ({
  dayStringLength,
  targetLengthNumber,
  targetLengthDuration
}: HeaderProps) => {
  const dashesDay = '-'.repeat(dayStringLength + 2)
  const spaceDay = ' '.repeat(dayStringLength - 2)
  const dashesNum = '-'.repeat(targetLengthNumber + 2)
  const spaceNum = ' '.repeat(targetLengthNumber - 2)
  const dashesDur = '-'.repeat(targetLengthDuration + 2)
  const spaceDur = ' '.repeat(targetLengthDuration - 2)
  return `
| 📅 ${spaceDay}| 👀 ${spaceNum}| ⏱️ ${spaceDur}|
|${dashesDay}|${dashesNum}|${dashesDur}|`
}

export const legend = () => {
  return `
<b>Legend</b>
📅 = Day
👀 = Views
⏱️ = Duration`
}

interface Props {
  durations: Metric[]
  views: Metric[]
}

export const table = ({ durations, views }: Props) => {
  const targetLengthNumber = 4
  const targetLengthDuration = 5

  const row = (day: string, i: number) => {
    const viewCount = formatNumber(views[i].count, targetLengthNumber)
    const duration = formatDuration(durations[i].count, targetLengthDuration)
    return `| ${day} | ${viewCount} | ${duration} |`
  }

  const dayStringLength = formatDay(views[0].id).length
  const days = views.map((v) => formatDay(v.id))
  const tableBody = days.map(row).join('\n')

  return `
<b>Unique views and durations</b>
<pre>${tableHeader({
    dayStringLength,
    targetLengthNumber,
    targetLengthDuration
  })}\n${tableBody}
</pre>`
}
