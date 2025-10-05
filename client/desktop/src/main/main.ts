import { app, BrowserWindow, Menu, nativeImage, Tray } from "electron";
import path from "node:path";

import { isDev } from "./util.js";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

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

const createTray = () => {
  const iconPath = path.join(__dirname, "icon.png");
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Показать",
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: "Выход",
      click: () => {
        mainWindow?.destroy();
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Моё приложение");
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    mainWindow?.show();
  });
};

app.whenReady().then(() => {
  createMainWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
