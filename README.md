# nswpol-maps-2013

A collection of GeoJSON and TopoJSON files representing NSW state electoral boundaries from the 2013 redistribution. These maps show the boundaries as they were at the 2015 and 2019 state elections. The files have been created by transforming the MapInfo Interchange Format (.mif/.mid) files provided by the NSW Electoral Commission.

The [original data files](http://www.elections.nsw.gov.au/about_elections/electoral_boundaries/electoral_maps/gda94_geographical_midmif_files) are copyright © State of New South Wales through the Office of New South Wales Electoral Commission.

## Getting Started

The map files in this collection are made available in two formats under the `geojson` and `topojson` directories. If you're not familiar with those formats and the differences, some starting points for information are [the GeoJSON specification](http://geojson.org/) and [the TopoJSON documentation](https://github.com/topojson/topojson/wiki).

You can clone or download the full repository, or download just the specific map file(s) you're interested in using.

## About the Project

All of the code used to generate the map files is available in this repository. You don't need to run any of that code to make use of the maps, but it's available for reproducibility, debugging and extension of the project.

If you want to run the code to (re-)generate the map files then you'll need to have [Node.js](https://nodejs.org/) and the `ogr2ogr` command line tool, which is part of [the GDAL (Geospatial Data Abstraction Library)](http://www.gdal.org/), installed on your system.

From a command line prompt in the project directory, you can rebuild the maps with the following steps:

1.  `npm install` to install the project dependencies.
2.  ~~`npm run download` to download the MapInfo files from the NSWEC website.~~ _NB: The NSW Electoral Commission launched a new website in late 2018, and at this stage it doesn't appear that the map files are available for download from the new site. Until a new public link is available, the `download.js` script won't work. To build the transformed map files in the next step, you'll need to obtain a copy of the NSWEc source file (`GIS_Files.zip`) and extract its contents (`DeterminedBoundaries2013.MID` and `DeterminedBoundaries2013.mif`) into a `download` directory within this project's base directory. [Contact me](https://github.com/tobiasziegler) if you need a copy of the original file._
3.  `npm run build` to transform the original files to GeoJSON and TopoJSON.

The project uses `ogr2ogr` to convert the original MapInfo files to an equivalent GeoJSON file, and then uses [Mapshaper](https://github.com/mbloch/mapshaper) for all subsequent transformations.
