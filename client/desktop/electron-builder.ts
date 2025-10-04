import type { Configuration } from "electron-builder";

const config: Configuration = {
  appId: "com.bite-the-dust.secret-manager",
  files: ["dist/**/*"],
  directories: {
    output: "dist/release",
  },
  icon: "icon.png",
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
        target: "msi",
        arch: "x64",
      },
      {
        target: "portable",
        arch: "x64",
      },
    ],
    signAndEditExecutable: false,
  },
};

export default config;
