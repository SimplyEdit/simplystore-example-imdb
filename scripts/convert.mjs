import fs from 'node:fs'
import JSONTag from '@muze-nl/jsontag'
import serialize from '@muze-nl/od-jsontag/src/serialize.mjs'
import tsv from '../lib/tsv-parser.js'
const {TsvParser} = tsv

let count = 0
let data = {
	movies: [],
	genres: {}
}

let skipped = {
	"invalid-record": [],
	"not-movie": [],
}

let inputFile = process.argv[2]
let outputFile = process.argv[3]

const source = fs.createReadStream(inputFile)

function convert(record) {
	let movie = {}
	let id = record.tconst
	JSONTag.setAttribute(movie, 'id', id)
	JSONTag.setAttribute(movie, 'class', 'Movie')

	if (!record.primaryTitle || record.primaryTitle=='\\N') {
		movie.title = new JSONTag.Null()
	} else {
		movie.title = new String(record.primaryTitle)
	}
	JSONTag.setType(movie.title, 'text')

	if (!record.originalTitle || record.originalTitle=='\\N') {
		movie.originalTitle = new JSONTag.Null()
	} else {
		movie.originalTitle = new String(record.originalTitle)
	}
	JSONTag.setType(movie.originalTitle, 'text')

	movie.isAdult = record.isAdult=='1'

	if (!record.startYear || record.startYear=='\\N' || isNaN(parseInt(record.startYear))) {
		movie.startYear = new JSONTag.Null()
	} else {
		movie.startYear = new String(record.startYear)
	}
	JSONTag.setType(movie.startYear, 'decimal')

	if (!record.endYear || record.endYear=='\\N' || isNaN(parseInt(record.endYear))) {
		movie.endYear = new JSONTag.Null()
	} else {
		movie.endYear = new String(record.endYear)
	}
	JSONTag.setType(movie.endYear, 'decimal')
	//TODO: set a class 'year' or so on end/startYear

	if (record.runtimeMinutes && record.runtimeMinutes!=='\\N') {
		let hours = Math.floor(parseInt(record.runtimeMinutes) / 60)
		let minutes = parseInt(record.runtimeMinutes) % 60
		if (!isNaN(hours) && !isNaN(minutes) && hours<24) {
			movie.runtime = new String((hours<10 ? '0' + hours : hours)+':'+(minutes<10 ? '0' + minutes : minutes))
		} else {
			movie.runtime = new JSONTag.Null()
		}
	} else {
		movie.runtime = new JSONTag.Null()
	}
	JSONTag.setType(movie.runtime, 'time')

	data.movies.push(movie)
	if (record.genres && record.genres!=='\\N') {
		let genres = record.genres?.split(',')
		if (genres) {
			for(let genre of genres) {
				if (genre=='\\' || genre=='\\\\') {
					continue
				}
				if (!data.genres[genre]) {
					data.genres[genre] = {
						name: ''+genre,
						movies: []
					}
				}
				data.genres[genre].movies.push(movie)
				if (!movie.genres) {
					movie.genres=[]
				}
				movie.genres.push(data.genres[genre])
			}
		} else {
			movie.genres = []
		}
	} else {
		movie.genres = []
	}
}

source.pipe(TsvParser())
.on('data', (record) => {
	count++
	// if (count>1000) {
	// 	return
	// }
	if (record.titleType !== 'movie') {
		skipped['not-movie'].push(record)
	} else if ( ! record.tconst || typeof record.tconst !== 'string') {
		skipped['invalid-record'].push(record)
	} else {
		convert(record)
	}
})
.on('end', () => {
	data.genres = Object.values(data.genres)
  console.log('writing...')
  fs.writeFileSync(outputFile,serialize(data))
  console.log('\ndone\n')
})
