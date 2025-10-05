import { app, BrowserWindow, Menu, nativeImage, Tray } from "electron";
import path from "node:path";
import AutoLaunch from "auto-launch";

import { isDev } from "./util.js";

const iconPath = path.join(app.getAppPath(), "dist/renderer/icon.png");

const autoLauncher = new AutoLaunch({
  name: "Secret Manager",
  path: app.getAppPath(),
  isHidden: true,
});

const enableAutoStart = async (): Promise<void> => {
  try {
    await autoLauncher.enable();
  } catch (error) {
    console.error("Ошибка при включении автозапуска:", error);
  }
};

const disableAutoStart = async (): Promise<void> => {
  try {
    await autoLauncher.disable();
  } catch (error) {
    console.error("Ошибка при отключении автозапуска:", error);
  }
};

const isAutoStartEnabled = async (): Promise<boolean> => {
  try {
    return await autoLauncher.isEnabled();
  } catch (error) {
    console.error("Ошибка при проверке автозапуска:", error);
    return false;
  }
};

const toggleAutoStart = async (): Promise<void> => {
  const enabled = await isAutoStartEnabled();
  if (enabled) {
    await disableAutoStart();
  } else {
    await enableAutoStart();
  }
};

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(
      path.join(app.getAppPath(), "dist/renderer/index.html")
    );
  }

  mainWindow.on("close", (e: Electron.Event) => {
    e.preventDefault();
    mainWindow?.hide();
  });
};

const createTray = async () => {
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);

  const buildContextMenu = async () => {
    const autoStartEnabled = await isAutoStartEnabled();

    return Menu.buildFromTemplate([
      {
        label: "Показать",
        click: () => {
          mainWindow?.show();
        },
      },
      { type: "separator" },
      {
        label: autoStartEnabled
          ? "Отключить автозапуск"
          : "Включить автозапуск",
        click: async () => {
          await toggleAutoStart();
          const newMenu = await buildContextMenu();
          tray?.setContextMenu(newMenu);
        },
      },
      { type: "separator" },
      {
        label: "Выход",
        click: () => {
          mainWindow?.destroy();
          app.quit();
        },
      },
    ]);
  };

  const contextMenu = await buildContextMenu();
  tray.setToolTip("Secret Manager");
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    mainWindow?.show();
  });
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
    }
  });

  app.whenReady().then(async () => {
    createMainWindow();
    await createTray();

    const args = process.argv.slice(1);
    if (args.includes("--hidden") || args.includes("--start-minimized")) {
      mainWindow?.hide();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else {
      mainWindow?.show();
    }
  });
}
