const electron = require('electron')
const ipcMain = electron.ipcMain

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({ width: 1280, height: 720 })

  mainWindow.setMenu(null)

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.webContents.openDevTools()

  //mainWindow.setFullScreen(true)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('movie-details', (event, arg) => {
  mainWindow.loadURL(`file://${__dirname}/movie-details.html`)

  event.sender.send('movie-details-load')
})

