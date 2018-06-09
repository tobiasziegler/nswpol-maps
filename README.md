# nswpol-maps

A collection of GeoJSON and TopoJSON files representing NSW state electoral boundaries. The files have been created by transforming the MapInfo Interchange Format (.mif/.mid) files provided by the NSW Electoral Commission. The [original data files](http://www.elections.nsw.gov.au/about_elections/electoral_boundaries/electoral_maps/gda94_geographical_midmif_files) are copyright © State of New South Wales through the Office of New South Wales Electoral Commission.

## Getting Started

The map files in this collection are made available in two formats under the `geojson` and `topojson` directories. If you're not familiar with those formats and the differences, some starting points for information are [the GeoJSON specification](http://geojson.org/) and [the TopoJSON documentation](https://github.com/topojson/topojson/wiki).

You can clone or download the full repository, or download just the specific map file(s) you're interested in using.

## About the Project

All of the code used to generate the map files is available in this repository. You don't need to run any of that code to make use of the maps, but it's available for reproducibility, debugging and extension of the project.

If you want to run the code to (re-)generate the map files then you'll need to have [Node.js](https://nodejs.org/) and the `ogr2ogr` command line tool, which is part of [the GDAL (Geospatial Data Abstraction Library)](http://www.gdal.org/), installed on your system.

From a command line prompt in the project directory, you can rebuild the maps with the following steps:

1.  `npm install` to install the project dependencies.
1.  `npm run download` to download the MapInfo files from the NSWEC website.
1.  `npm run build` to transform the original files to GeoJSON and TopoJSON.

The project uses `ogr2ogr` to convert the original MapInfo files to an equivalent GeoJSON file, and then uses [Mapshaper](https://github.com/mbloch/mapshaper) for all subsequent transformations.
