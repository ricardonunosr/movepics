const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { format } = require('url');
const { organizeFiles } = require('@movepics/script');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    frame: false,
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setResizable(false);
  mainWindow.setMenuBarVisibility(false);

  const startURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : format({
          pathname: path.join(__dirname, '/../build/index.html'),
          protocol: 'file:',
          slashes: true,
        });
  mainWindow.loadURL(startURL);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

ipcMain.on('START_SCRIPT', async (e, data) => {
  try {
    await organizeFiles(data.directoryPath, data.saveDirectory, data.isMove);
    mainWindow.webContents.send('FINISH_SCRIPT');
  } catch (error) {
    console.log(error);
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
