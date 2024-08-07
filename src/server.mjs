import simplystore from '@muze-nl/simplystore'

const root = dirname(process.cwd())

simplystore.get('/', (req, res) => {
  res.sendFile(root + '/www/index.html')
})

simplystore.run({
  datafile: root + '/data/data.od-jsontag'
})
