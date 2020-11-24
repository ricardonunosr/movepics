const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
var mv = require('mv');
const util = require('util');
const spawn = require('child_process').spawn;
const readdir = util.promisify(fs.readdir);

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

const MainFunction = async () => {
  const files = await readdir(directoryPath);
  var i = 0;
  var numberOfProcesses = 0;
  const MAX_PROCESSES = 5;
  const runMore = async () => {
    while (i < files.length && numberOfProcesses < MAX_PROCESSES) {
      ++numberOfProcesses;
      var file = files[i];
      const imageProcess = spawn(
        'exiftool.exe',
        ['-json', `"${directoryPath}/${file}"`],
        {
          shell: true,
        }
      );

      imageProcess.stdout.on('data', async (data) => {
        const creationDate = await getDateOfCreation(file, data.toString());
        let folder;
        if (creationDate !== undefined) {
          folder = new Date(creationDate.split(' ')[0]).getFullYear();
        } else {
          folder = 'Sem Data';
        }
        mkdirp(`${saveDirectory}/${folder}`).then((_) => {
          mv(
            `${directoryPath}/${file}`,
            `${saveDirectory}/${folder}/${file}`,
            (err) => {
              if (err) throw err;
              console.log(`Moved Photo to ${folder}`);
            }
          );
        });
      });

      imageProcess
        .on('close', (code) => {
          i++;
          --numberOfProcesses;
          console.log(`Finished with code ${code}`);
          runMore();
        })
        .on('error', (err) => {
          i++;
          console.error(err);
          --numberOfProcesses;
          runMore();
        });
    }
  };
  runMore();
};

MainFunction();
