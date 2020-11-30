const path = require('path');
const mkdirp = require('mkdirp');
var mv = require('mv');
const cpFile = require('cp-file');
const spawn = require('child_process').spawn;

const getDateOfCreation = async (fileName, data) => {
  const type = fileName.split('.')[1];
  switch (type) {
    case 'MOV':
      const { CreationDate } = data;
      if (CreationDate === '0000:00:00 00:00:00') return undefined;
      return CreationDate;
    case 'JPG':
      const { DateTimeOriginal } = data;
      if (DateTimeOriginal === '0000:00:00 00:00:00') return undefined;
      return DateTimeOriginal;
    case 'MP4':
      const { CreateDate } = data;
      if (CreateDate === '0000:00:00 00:00:00') return undefined;
      return CreateDate;
  }
};

const organizeFiles = async (directoryPath, saveDirectory, isMove) => {
  console.log('Entrou');
  const imageProcess = spawn(
    path.join(__dirname, 'exiftool.exe'),
    ['-json', `"${directoryPath}"`],
    {
      shell: true,
    }
  );

  imageProcess.stdout.on('data', async (data) => {
    JSON.parse(data.toString()).forEach(async (fileMetaData) => {
      const fileName = fileMetaData.FileName;
      const creationDate = await getDateOfCreation(fileName, fileMetaData);
      let folder;
      if (creationDate !== undefined) {
        folder = new Date(creationDate.split(' ')[0]).getFullYear();
      } else {
        folder = 'Sem Data';
      }
      mkdirp(`${saveDirectory}/${folder}`).then((_) => {
        if (isMove) {
          mv(
            `${directoryPath}/${fileName}`,
            `${saveDirectory}/${folder}/${fileName}`,
            (err) => {
              if (err) throw err;
              console.log(`Moved Photo to ${folder}`);
            }
          );
        } else {
          cpFile(
            `${directoryPath}/${fileName}`,
            `${saveDirectory}/${folder}/${fileName}`
          );
        }
      });
    });
  });
};

//MainFunction('D:\\Test', 'D:\\Test');
module.exports = { organizeFiles };
