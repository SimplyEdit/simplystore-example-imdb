/**
 * This script downloads the GZipped file for the provided name from https://datasets.imdbws.com/ and saves it to the data folder.
 *
 * The available names are:
 *
 * - name.basics
 * - title.akas
 * - title.basics
 * - title.crew
 * - title.episode
 * - title.principals
 * - title.ratings
 *
 * The file(s) are read as a stream from `https://datasets.imdbws.com/${name}.tsv.gz`, ungziped on the fly, and saved to `data/${name}.tsv`.
 * The download is done in parallel for all the provided names.
 * The download progress is logged to the console.
 * Errors are logged to the console.
 * The script is meant to be run from the root of the project.
 * It is meant to be called like this:
 *
 * ```
 * node scripts/download.mjs name1 name2 name3 ...
 * ```
 */
import fs from 'node:fs'
import https from 'node:https'
import zlib from 'node:zlib'

const names = process.argv.slice(2)

const availableNames = ['name.basics', 'title.akas', 'title.basics', 'title.crew', 'title.episode', 'title.principals', 'title.ratings']

if (names.length === 0) {
  console.error('One parameter required: <name> [<name> ...]')
  process.exit(1)
} else {
  names.forEach((name) => {
    if ( ! availableNames.includes(name)) {
      console.error(`Invalid name: "${name}", must be one of ${availableNames.join(', ')}`)
      process.exit(1)
    }
  })
}

const root = process.cwd()
const dataDir = root + '/data'

if ( ! fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

const download = (name) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(`${dataDir}/${name}.tsv`)

    console.log(` -----> Start fetching ${name}`)

    https.get(`https://datasets.imdbws.com/${name}.tsv.gz`, (response) => {
      const gunzip = zlib.createGunzip()

      response
        .pipe(gunzip)
        .pipe(file)

      response.on('end', () => {
        console.log(` -----> Finished fetching ${name}`)
        resolve()
      })
    })
      .on('error', (err) => {
        reject(err)
      })
  })
}

console.log(' =====> Downloading...')
Promise.all(names.map(download))
  .then(() => {
    console.log('Done.')
  })
  .catch((err) => {
    console.error(err)
  })
