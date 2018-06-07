// Import libraries
const fetch = require('node-fetch');
const fs = require('fs');

// The URL for downloading the electoral map from the NSWEC website
const url =
  'http://www.elections.nsw.gov.au/__data/assets/file/0019/221158/GIS_Files.zip';

// The location of the downloaded zip file
const zipFile = './download/GIS_Files.zip';

// An alternate link in case the above one breaks:
// http://www.elections.nsw.gov.au/__data/assets/file/0018/210744/GIS_Files.zip

fetch(url).then(response => {
  return new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(zipFile);
    response.body.pipe(dest);
    response.body.on('error', err => {
      reject(err);
    });
    dest.on('finish', () => {
      resolve();
    });
    dest.on('error', err => {
      reject(err);
    });
  });
});
