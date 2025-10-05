# Secret Manager

Electron приложение с React + TypeScript + Vite для безопасного хранения секретов.

## 🚀 Доступные скрипты

### Разработка

```bash
npm run dev:react     # Запуск React dev server для разработки UI
npm run dev:electron  # Запуск Electron приложения
```

### Сборка

```bash
npm run transpile:electron  # Компиляция TypeScript кода Electron
npm run build               # Сборка React приложения
npm run preview            # Превью собранного приложения
```

### Создание дистрибутивов

```bash
npm run build:win    # Полная сборка для Windows (.exe)
npm run build:mac    # Полная сборка для macOS (.dmg)
npm run build:linux  # Полная сборка для Linux (.AppImage)
```

### Качество кода

```bash
npm run lint     # Проверка и автоисправление через ESLint
npm run format   # Форматирование кода через Prettier
```

## 📋 Рекомендуемый флоу

**Для разработки:**

1. `npm run dev:react` - в первом терминале
2. `npm run dev:electron` - во втором терминале

**Для сборки дистрибутива:**

- `npm run build:win` - создаст готовый .exe файл для Windows

---

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
import reactDom from "eslint-plugin-react-dom";
// eslint.config.js
import reactX from "eslint-plugin-react-x";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
