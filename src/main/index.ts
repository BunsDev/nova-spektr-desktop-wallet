import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as process from 'process';

import { MainWindow } from './main';
import { makeAppWithSingleInstanceLock } from './factories/instance';
import { makeAppSetup } from './factories/setup';

// @ts-ignore
const setupAutoUpdate = () => {
  if (process.env.BUILD_SOURCE !== 'github') return;

  autoUpdater.autoRunAppAfterInstall = true;

  app.on('ready', () => {
    autoUpdater.checkForUpdates();
  });
  autoUpdater.on('checking-for-update', () => {
    console.log('[app-updater] Checking for update...');
  });
  autoUpdater.on('update-not-available', () => {
    console.log(`[app-updater] No updates available. Application is up to date.`);
  });
  autoUpdater.on('update-available', (info) => {
    console.log(`[app-updater] New update available ${info.releaseName} ${info.releaseDate} ${info.version}`);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    console.log(
      `[app-updater] Downloading update ${progressObj.percent}% of ${progressObj.total} bytes; ${progressObj.bytesPerSecond} bytes per second`,
    );
  });
  autoUpdater.on('update-downloaded', (info) => {
    console.log(`[app-updater] Downloaded update ${info.releaseName} ${info.releaseDate} ${info.version}`);
    dialog
      .showMessageBox({
        title: 'Update Available',
        message: `A new version ${info.version} of Nova Spektr is ready to be installed.`,
        detail: info.releaseNotes?.toString().replaceAll(/<[a-zA-Z0-9/]*>/g, ''), // clear html tags from changelog
        type: 'question',
        buttons: ['Install now', 'Install on next launch', 'Not now'],
        defaultId: 0,
        cancelId: 2,
      })
      .then((result) => {
        switch (result.response) {
          case 0:
            autoUpdater.quitAndInstall();
            break;
          case 1:
            autoUpdater.autoInstallOnAppQuit = true;
            break;
          case 2:
            autoUpdater.autoInstallOnAppQuit = false;
            break;
        }
      });
  });
  autoUpdater.on('update-cancelled', (info) => {
    console.error(`[app-updater] Update cancelled ${info.releaseName} ${info.releaseDate} ${info.version}`);
  });
  autoUpdater.on('error', (err) => {
    console.error('[app-updater] Error on update', err);
    dialog.showErrorBox('Error', 'Error updating the application');
  });
};

makeAppWithSingleInstanceLock(async () => {
  app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

  // setupAutoUpdate();

  await app.whenReady();
  await makeAppSetup(MainWindow);
});
