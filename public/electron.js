/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line import/no-extraneous-dependencies
const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    icon: path.join(__dirname, '../build/alarm-clock.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: false,
      }),
  );
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
