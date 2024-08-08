# SimplyStore IMDb Example

This example demonstrates how to use [SimplyStore][1] to create a simple API for [the IMDb Non-Commercial Datasets][2]. 

As SimplyStore exposes an [Express server][3], it is straightforward to add custom routes to the server.
In this example, only a homepage has been added.

The original dataset from IMDb is a set of Gzipped TSV files.

Scripts have been provided which download and unzip the data, and converts it to a file that can be used by SimplyStore.

SimplyStore itself exposes the data as [Tagged JSON][4] (or "JSONTag")

## Installation

To start using this example, clone this repository and run `npm install` to install the dependencies.

## Usage

Once the dependencies are installed, the data needs to be downloaded and converted.

The required data can be downloaded by running `npm run download`.
This will download the IMDb Non-Commercial Datasets and unzip them in the `data` directory.

The data then needs to be converted to a format that can be loaded by SimplyStore.
This can be done by running `npm run convert`. This will convert the TSV files to On-Demand JSONTag (OD-JSONTag) files.
This is a JSONTag file, formatted for easier consumption by machines. You don't _have_ to know anything about this, but if you _want to_ visit: https://github.com/muze-nl/od-jsontag

Run `npm start` to start a server on http://localhost:3000.
As the data is quite large, it can take a while to load.

Once the server is running, visit http://localhost:3000 to see the homepage and start exploring the data.

## Contributing

If you have any questions or suggestions, please [open an issue][5].

## License

Created by [Muze][6] under an [MPL-2.0 license][7]

[1]: https://github.com/simplyedit/SimplyStore
[2]: https://developer.imdb.com/non-commercial-datasets/
[3]: https://expressjs.com/
[4]: https://github.com/muze-nl/jsontag
[5]: https://github.com/SimplyEdit/simplystore-example-imdb/issues/ 
[6]: https://muze.nl/
[7]: LICENSE
