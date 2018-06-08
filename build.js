const shell = require('shelljs');
const mapshaper = require('mapshaper');

// Convert MapInfo interchange file(s) into GeoJSON with WGS84 coordinate system
const convertMapInfo = (input, output) => {
  // Check that the ogr2ogr command is available
  if (!shell.which('ogr2ogr')) {
    shell.echo(
      'ogr2ogr not found - the GDAL library must be installed to convert the map file(s)\n'
    );
    shell.exit(1);
  }

  // Convert the file and check for an error code
  const shellstring = shell.exec(
    `ogr2ogr -t_srs EPSG:4326 ${output} ${input}`,
    {
      silent: true
    }
  );
  if (shellstring.code === 0) {
    shell.echo('Completed.\n');
  } else {
    shell.exit(shellStr.code);
  }
};

// Begin by converting the complete MapInfo dataset to an equivalent GeoJSON file
console.log('Converting NSWEC MapInfo files to GeoJSON...');
convertMapInfo(
  'download/DeterminedBoundaries2013.MID',
  'geojson/nsw-electoral-boundaries-2013.json'
);

// Convert the GeoJSON file to TopoJSON
console.log('Converting GeoJSON file to TopoJSON...');
mapshaper.runCommands(
  '-i geojson/nsw-electoral-boundaries-2013.json -o topojson/ format=topojson',
  error => {
    if (error) {
      console.log(`Error: ${error.message}`);
    } else {
      console.log('Completed.');
    }
  }
);
