const path = require('path');
const fs = require('fs');
const util = require('util');
const mkdirp = require('mkdirp');
var mv = require('mv');
const exec = util.promisify(require('child_process').exec);

const directoryPath = path.join('D:\\Test');
const saveDirectory = `D:\\Test Org`;

const getDateOfCreation = async (fileName, data) => {
  const type = fileName.split('.')[1];
  switch (type) {
    case 'MOV':
      const { CreationDate } = JSON.parse(data)[0];
      if (CreationDate === '0000:00:00 00:00:00') return undefined;
      return CreationDate;
    case 'JPG':
      const { DateTimeOriginal } = JSON.parse(data)[0];
      if (DateTimeOriginal === '0000:00:00 00:00:00') return undefined;
      return DateTimeOriginal;
    case 'MP4':
      const { CreateDate } = JSON.parse(data)[0];
      if (CreateDate === '0000:00:00 00:00:00') return undefined;
      return CreateDate;
  }
};

fs.readdir(directoryPath, (err, files) => {
  if (err) return console.log('Unable to scan directory: ' + err);

  files.forEach(async (file) => {
    await exec(
      `exiftool -json "${directoryPath}\\${file}"`,
      async (err, data) => {
        const creationDate = await getDateOfCreation(file, data);
        if (creationDate !== undefined) {
          let year = new Date(creationDate.split(' ')[0]).getFullYear();
          mkdirp(`${saveDirectory}/${year}`).then((_) => {
            mv(
              `${directoryPath}/${file}`,
              `${saveDirectory}/${year}/${file}`,
              (err) => {
                if (err) throw err;
                console.log(`Moved Photo to ${year}`);
              }
            );
          });
        } else {
          console.log('Sem data');
          mkdirp(`${saveDirectory}/Sem Data`).then((_) => {
            mv(
              `${directoryPath}/${file}`,
              `${saveDirectory}/Sem Data/${file}`,
              (err) => {
                if (err) throw err;
                console.log(`Moved Photo to Sem Data`);
              }
            );
          });
        }
      }
    );
  });
});
