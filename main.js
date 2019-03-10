const {app, BrowserWindow, TouchBar, nativeImage} = require('electron')
const path = require('path');
let mainWindow

function createSegment(item) {
  let icon;
  if (item.iconLocation) {
    icon = nativeImage.createFromPath(item.iconLocation);
  }

  return {
    id: item.id,
    label: !icon ? item.title : undefined,
    icon
  };
}

function createTouchBarGroup(items = []) {
  const segments = items.map(createSegment);
  const control = new TouchBar.TouchBarSegmentedControl({
    segments,
    mode: 'buttons',
    segmentStyle: 'automatic'
  });
  return control;
}

const touchbarGroups = [
  createTouchBarGroup([{
    id: 'ID-1',
    title: 'First',
    iconLocation: path.join(__dirname, 'poo.png')
  }])
];

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // 1. Create new touchbar with our initial control (the poo emoji)
  mainWindow.setTouchBar(new TouchBar({ items: touchbarGroups }));

  // 2. After 5 seconds we're going to change the control to just have a text label
  setTimeout(() => {
    touchbarGroups[0].segments = [createSegment({
      id: 'ID-2',
      title: 'No icon should show'
    })];
  }, 5000);

  // 3. After 10 seconds we're going to replace the control with the party popper emoji
  setTimeout(() => {
    touchbarGroups[0].segments = [createSegment({
      id: 'ID-3',
      title: 'Party popper should show',
      iconLocation: path.join(__dirname, 'tada.png')
    })];
  }, 10000);
}


app.on('ready', createWindow)
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
