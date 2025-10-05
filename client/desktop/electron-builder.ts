import type { Configuration } from "electron-builder";

const config: Configuration = {
  appId: "com.bite-the-dust.secret-manager",
  files: ["dist/**/*"],
  directories: {
    output: "dist/release",
  },
  icon: "public/icon.png",
  compression: "maximum",
  mac: {
    target: { target: "dmg", arch: "arm64" },
  },
  linux: {
    target: {
      target: "AppImage",
      arch: "x64",
    },
    category: "Utility",
  },
  win: {
    target: [
      {
        target: "nsis", // NSIS быстрее MSI
        arch: ["x64", "arm64"], // Поддержка обеих архитектур
      },
      {
        target: "portable",
        arch: "x64",
      },
    ],
    // Оптимизации для Windows
    requestedExecutionLevel: "asInvoker",
    signAndEditExecutable: false,
  },
  nsis: {
    oneClick: false, // Позволяет пользователю выбрать папку
    perMachine: false, // Установка для текущего пользователя (быстрее)
    allowToChangeInstallationDirectory: true, // Выбор папки установки
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    deleteAppDataOnUninstall: false, // Сохраняем пользовательские данные
  },
};

export default config;
