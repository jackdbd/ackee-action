import { message } from './components/message'
import * as factsJson from './sample-data/facts.json'
import * as pagesJson from './sample-data/pages.json'
import * as sizesJson from './sample-data/sizes.json'
import * as viewsAndDurationsJson from './sample-data/views-and-durations.json'

const debug = () => {
  const str = message({
    facts: factsJson.data.domain.facts,
    tableData: {
      durations: viewsAndDurationsJson.data.domain.statistics.durations,
      title: viewsAndDurationsJson.data.domain.title,
      views: viewsAndDurationsJson.data.domain.statistics.views
    },
    topPages: pagesJson.data.domain.statistics.pages,
    topSizes: sizesJson.data.domain.statistics.sizes
  })
  console.log(str)
}

debug()
