import { Facts } from '../interfaces'

export const facts = ({
  activeVisitors,
  averageDuration,
  averageViews,
  viewsToday,
  viewsMonth,
  viewsYear
}: Facts) => {
  return `
<b>active visitors:</b> <pre>${activeVisitors}</pre>
<b>average duration (sec):</b> <pre>${averageDuration / 1000}</pre>
<b>average views:</b> <pre>${averageViews}</pre>
<b>views today:</b> <pre>${viewsToday}</pre>
<b>views this month:</b> <pre>${viewsMonth}</pre>
<b>views this year:</b> <pre>${viewsYear}</pre>
`
}
