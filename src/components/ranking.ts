import { Metric } from '../interfaces'

interface LinkProps {
  href: string
  content: string
}

const link = ({ href, content }: LinkProps) => {
  return `<a href="${href}">${content}</a>`
}

interface Props {
  delimiter?: string
  domain: string
  isLink?: boolean
  metrics: Metric[]
  thing: string
}

const toItem = (datum: string, i: number) => {
  switch (i + 1) {
    case 1:
      return `1️⃣ ${datum}`
    case 2:
      return `2️⃣ ${datum}`
    case 3:
      return `3️⃣ ${datum}`
    case 4:
      return `4️⃣ ${datum}`
    case 5:
      return `5️⃣ ${datum}`
    default:
      return `<b>${i + 1}</b> ${datum}`
  }
}

export const ranking = ({
  delimiter = '\n\n',
  isLink = false,
  metrics,
  domain,
  thing
}: Props) => {
  const toAnchor = ({ id }: { id: string }) => {
    const content = id.replace(`https://${domain}`, '')
    return link({ href: id, content })
  }

  const str = isLink
    ? `${metrics.map(toAnchor).map(toItem).join(delimiter)}`
    : `${metrics
        .map((m) => m.id)
        .map(toItem)
        .join(delimiter)}`

  return `
<b>Top ${metrics.length} ${thing}</b>
${str}`
}
