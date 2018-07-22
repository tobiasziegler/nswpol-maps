const shell = require('shelljs');
const mapshaper = require('mapshaper');
const fs = require('fs');

// Define parameters for the map files that will be generated
const baseFileName = 'nswpol-maps-2013'; // Base string for generating filenames for each map
const simplifyPercentages = [20, 10, 5, 1]; // Percentage values to be used when simplifying maps
const districts = [
  // Electoral districts for filtering or joining
  { id: 1, name: 'tweed' },
  { id: 2, name: 'lismore' },
  { id: 3, name: 'ballina' },
  { id: 4, name: 'heathcote' },
  { id: 5, name: 'barwon' },
  { id: 6, name: 'murray' },
  { id: 7, name: 'albury' },
  { id: 8, name: 'wagga-wagga' },
  { id: 9, name: 'cootamundra' },
  { id: 10, name: 'monaro' },
  { id: 11, name: 'bega' },
  { id: 12, name: 'goulburn' },
  { id: 13, name: 'orange' },
  { id: 14, name: 'dubbo' },
  { id: 15, name: 'northern-tablelands' },
  { id: 16, name: 'clarence' },
  { id: 17, name: 'tamworth' },
  { id: 18, name: 'coffs-harbour' },
  { id: 19, name: 'south-coast' },
  { id: 20, name: 'kiama' },
  { id: 21, name: 'bathurst' },
  { id: 22, name: 'upper-hunter' },
  { id: 23, name: 'oxley' },
  { id: 24, name: 'port-macquarie' },
  { id: 25, name: 'myall-lakes' },
  { id: 26, name: 'port-stephens' },
  { id: 27, name: 'maitland' },
  { id: 28, name: 'cessnock' },
  { id: 29, name: 'newcastle' },
  { id: 30, name: 'wallsend' },
  { id: 31, name: 'charlestown' },
  { id: 32, name: 'swansea' },
  { id: 34, name: 'wyong' },
  { id: 35, name: 'the-entrance' },
  { id: 36, name: 'shellharbour' },
  { id: 37, name: 'wollongong' },
  { id: 38, name: 'keira' },
  { id: 39, name: 'blue-mountains' },
  { id: 40, name: 'wollondilly' },
  { id: 41, name: 'hawkesbury' },
  { id: 42, name: 'terrigal' },
  { id: 44, name: 'campbelltown' },
  { id: 45, name: 'camden' },
  { id: 46, name: 'mulgoa' },
  { id: 47, name: 'penrith' },
  { id: 48, name: 'londonderry' },
  { id: 49, name: 'mount-druitt' },
  { id: 50, name: 'riverstone' },
  { id: 51, name: 'blacktown' },
  { id: 52, name: 'prospect' },
  { id: 53, name: 'macquarie-fields' },
  { id: 54, name: 'newtown' },
  { id: 55, name: 'liverpool' },
  { id: 56, name: 'cabramatta' },
  { id: 57, name: 'fairfield' },
  { id: 58, name: 'granville' },
  { id: 59, name: 'hornsby' },
  { id: 60, name: 'castle-hill' },
  { id: 61, name: 'pittwater' },
  { id: 62, name: 'ku-ring-gai' },
  { id: 63, name: 'baulkham-hills' },
  { id: 64, name: 'epping' },
  { id: 65, name: 'ryde' },
  { id: 66, name: 'lane-cove' },
  { id: 67, name: 'davidson' },
  { id: 68, name: 'wakehurst' },
  { id: 69, name: 'manly' },
  { id: 70, name: 'north-shore' },
  { id: 71, name: 'willoughby' },
  { id: 72, name: 'seven-hills' },
  { id: 73, name: 'parramatta' },
  { id: 74, name: 'auburn' },
  { id: 75, name: 'holsworthy' },
  { id: 76, name: 'cronulla' },
  { id: 77, name: 'miranda' },
  { id: 78, name: 'bankstown' },
  { id: 79, name: 'east-hills' },
  { id: 80, name: 'oatley' },
  { id: 81, name: 'kogarah' },
  { id: 82, name: 'rockdale' },
  { id: 83, name: 'lakemba' },
  { id: 84, name: 'canterbury' },
  { id: 85, name: 'strathfield' },
  { id: 86, name: 'vaucluse' },
  { id: 87, name: 'maroubra' },
  { id: 88, name: 'coogee' },
  { id: 89, name: 'drummoyne' },
  { id: 90, name: 'balmain' },
  { id: 91, name: 'sydney' },
  { id: 92, name: 'heffron' },
  { id: 93, name: 'summer-hill' },
  { id: 94, name: 'gosford' },
  { id: 95, name: 'lake-macquarie' }
];

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
const runMapshaper = (commands, description) => {
  return new Promise((resolve, reject) => {
    if (description) console.log(`${description}...`);
    mapshaper.runCommands(commands, (error, result) => {
      if (error) {
        reject(error);
      } else {
        if (description) console.log('Completed.');
        resolve(result);
      }
    });
  });
};

// Begin by converting the complete MapInfo dataset to an equivalent GeoJSON file
console.log('Converting NSWEC MapInfo files to GeoJSON...');
convertMapInfo(
  'download/DeterminedBoundaries2013.MID',
  `download/${baseFileName}-p100-alldistricts.json`
);

// Convert the GeoJSON file to TopoJSON
runMapshaper(
  `-i download/${baseFileName}-p100-alldistricts.json -o topojson/ format=topojson`,
  'Converting GeoJSON file to TopoJSON'
)
  .then(() => {
    // Create TopoJSON versions of the full map with different simplification levels
    console.log(
      '\nCreating simplified (smaller) versions of the full TopoJSON file:'
    );
    return Promise.all(
      simplifyPercentages.map(percentage =>
        runMapshaper(
          `-i topojson/${baseFileName}-p100-alldistricts.json -simplify weighted percentage=${percentage}% -o topojson/${baseFileName}-p${percentage}-alldistricts.json format=topojson`,
          `Simplify retaining ${percentage} of removable points`
        )
      )
    );
  })
  .then(() => {
    // Create single-district map files at each simplification level
    console.log(
      '\nCreating single-district map files at each simplification level:'
    );
    return Promise.all(
      simplifyPercentages.map(percentage => {
        console.log(`Maps at ${percentage}% simplification level...`);
        return Promise.all(
          districts.map(district =>
            runMapshaper(
              `-i topojson/${baseFileName}-p${percentage}-alldistricts.json -filter 'ID === ${
                district.id
              }' -o topojson/${baseFileName}-p${percentage}-${
                district.name
              }.json`
            )
          )
        );
      })
    );
  })
  .then(() => {
    // Get an array of the filenames in the topojson directory
    console.log('\nGetting list of TopoJSON files...');
    return new Promise((resolve, reject) => {
      fs.readdir('topojson', (error, files) => {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });
  })
  .then(files => {
    console.log('Converting TopoJSON files to GeoJSON...');
    // Convert all TopoJSON files to GeoJSON
    return Promise.all(
      files.map(file =>
        runMapshaper(`-i topojson/${file} -o geojson/${file} format=geojson`)
      )
    );
  })
  .catch(error => {
    console.log(`Error: ${error.message}`);
  });
