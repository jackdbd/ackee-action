import { Facts, Metric, ViewsAndDurationsForDomainId } from '../interfaces'
import { header } from './header'
import { facts as factsComponent } from './facts'
import { legend, table } from './table'
import { ranking } from './ranking'

interface Props {
  facts: Facts
  tableData: ViewsAndDurationsForDomainId
  topPages: Metric[]
  topSizes: Metric[]
}

type Message = (props: Props) => string

export const message: Message = ({ facts, tableData, topPages, topSizes }) => {
  const domain = tableData.title
  const durations = tableData.durations
  const views = tableData.views

  const isoStringStart = views[views.length - 1].id
  const isoStringStop = views[0].id

  return `
${header({ domain, isoStringStart, isoStringStop })}
${factsComponent(facts)}
${table({
  durations,
  views
})}
${legend()}
${ranking({
  domain,
  isLink: true,
  metrics: topPages,
  thing: 'pages'
})}
${ranking({
  domain,
  metrics: topSizes,
  thing: 'sizes'
})}`
}
