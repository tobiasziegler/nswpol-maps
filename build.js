const shell = require('shelljs');
const mapshaper = require('mapshaper');

// Define parameters for the map files that will be generated
const baseFileName = 'nswpol-maps-2013'; // Base string for generating filenames for each map
const simplifyPercentages = [20, 10, 5, 1]; // Percentage values to be used when simplifying maps

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
    shell.exit(shellstring.code);
  }
};

// Run a Mapshaper command and output the result
const runMapshaper = commands => {
  return new Promise((resolve, reject) => {
    mapshaper.runCommands(commands, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// Begin by converting the complete MapInfo dataset to an equivalent GeoJSON file
console.log('Converting NSWEC MapInfo files to GeoJSON...');
convertMapInfo(
  'download/DeterminedBoundaries2013.MID',
  `geojson/${baseFileName}-p100-alldistricts.json`
);

// Convert the GeoJSON file to TopoJSON
console.log('Converting GeoJSON file to TopoJSON...');
runMapshaper(
  `-i geojson/${baseFileName}-p100-alldistricts.json -o topojson/ format=topojson`
).then(() => {
  // Create TopoJSON versions of the full map with different simplification levels
  console.log(
    'Creating simplified (smaller) versions of the full TopoJSON file...'
  );
  simplifyPercentages.map(percentage => {
    console.log(`Simplify retaining ${percentage} of removable points...`);
    runMapshaper(
      `-i topojson/${baseFileName}-p100-alldistricts.json -simplify weighted percentage=${percentage}% -o topojson/${baseFileName}-p${percentage}-alldistricts.json format=topojson`
    );
  });
});
