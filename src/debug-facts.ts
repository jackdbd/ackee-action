import { facts } from './components/facts'
import * as factsJson from './sample-data/facts.json'

const debug = () => {
  const str = facts({
    ...factsJson.data.domain.facts
  })
  console.log(str)
}

debug()
