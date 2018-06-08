// Import libraries
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');

// The URL for downloading the electoral map from the NSWEC website
const url =
  'http://www.elections.nsw.gov.au/__data/assets/file/0019/221158/GIS_Files.zip';

// The location of the downloaded zip file
const zip = './download/GIS_Files.zip';

// An alternate link in case the above one breaks:
// http://www.elections.nsw.gov.au/__data/assets/file/0018/210744/GIS_Files.zip

fetch(url)
  // Save the downloaded zip file
  .then(response => {
    return new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(zip);
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
  })
  // Now extract the contents of the zip
  .then(() => {
    yauzl.open(zip, { lazyEntries: true }, (err, zipfile) => {
      if (err) throw err;
      zipfile.readEntry();
      zipfile.on('entry', entry => {
        if (/\/$/.test(entry.fileName)) {
          // Directory file names end with '/'.
          // Note that entries for directories themselves are optional.
          // An entry's fileName implicitly requires its parent directories to exist.
          zipfile.readEntry();
        } else {
          // file entry
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) throw err;
            readStream.on('end', () => {
              zipfile.readEntry();
            });
            const writeStream = fs.createWriteStream(
              path.join('./download', entry.fileName)
            );
            readStream.pipe(writeStream);
          });
        }
      });
    });
  });
