import { formatDate } from '../utils'

interface Props {
  domain: string
  isoStringStart: string
  isoStringStop: string
}

export const header = ({ domain, isoStringStart, isoStringStop }: Props) => {
  const interval = `${formatDate(isoStringStart)} - ${formatDate(
    isoStringStop
  )}`
  return `
📊 <b>Ackee report for ${domain} (${interval})</b>`
}
