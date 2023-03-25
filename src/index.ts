import updateElectron from 'update-electron-app';
import { app, BrowserWindow, autoUpdater } from 'electron';
import ms from "ms"
import { getIconPath } from './main/shared/getIconPath';

updateElectron({
    logger: require('electron-log'),
    notifyUser: true
})

const server = 'https://update.electronjs.org';
const feed = `${server}/DnsChanger/dnsChanger-desktop/${process.platform}-${process.arch}/${app.getVersion()}`;

autoUpdater.setFeedURL({
    url: feed,
    serverType: 'default',
})

setInterval(() => {
    autoUpdater.checkForUpdates();
}, ms("1h"))

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
    const icon = getIconPath();
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 500,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        darkTheme: true,
        resizable: false,
        icon
    });

    mainWindow.setMenu(null);

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // Open the DevTools.
    if (process.env.ENV)
        mainWindow.webContents.openDevTools();
};


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

import './main/ipc/ui';
import './main/ipc/notif';
import './main/ipc/dialogs';

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

