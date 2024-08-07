import simplystore from '@muze-nl/simplystore'
import path from 'node:path'
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

console.log('Loading data from '+root+'/data/data.od-jsontag')
simplystore.get('/', (req, res) => {
  res.sendFile(root + '/www/index.html')
})

simplystore.run({
  datafile: root + '/data/data.od-jsontag'
})
