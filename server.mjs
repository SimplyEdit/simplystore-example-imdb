import simplystore from '@muze-nl/simplystore'

simplystore.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
})

simplystore.run({
  datafile: process.cwd() + '/data.od-jsontag'
})
