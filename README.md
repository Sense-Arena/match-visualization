# @sensearena/mv

React tennis match editor, shared Effector state and Unity/canvas coordinate utilities.

## Install in an application

```sh
pnpm add @sensearena/mv @sensearena/ui@^0.3.1 react@19 react-dom@19
```

The package is published to npm and also supports `npm install @sensearena/mv`.
Modern npm and pnpm install required peer dependencies automatically. Existing applications
must provide compatible versions from the table below; do not bypass conflicts with `--legacy-peer-deps`.

Import both stylesheets once in the application entry point:

```ts
import '@sensearena/ui/theme.css';
import '@sensearena/mv/theme.css';
```

Copy `node_modules/@sensearena/mv/imgs/tennis-courts` to the application's public
`imgs/tennis-courts` directory. The npm package includes all required images:

- `t_court_hard.jpg`, `t_court_clay.jpg`, `t_court_grass.jpg`
- `AI.svg`, `ball.svg`, `cannon.svg`, `player.svg`

The default URLs start at `/imgs/tennis-courts/`. For an application deployed under a prefix,
pass a trailing slash, for example `<SettingsCourt basePath="/my-app/" ... />`, and serve images
under `/my-app/imgs/tennis-courts/`.

## Integration

Initialize the shared state before displaying a new editor:

```tsx
import {
  SettingsCourt,
  StartType,
  forwardCourtStep,
  predefinedCourtSteps,
  resetMSState,
  saveMSSettings,
  settingsDefaultValues,
} from '@sensearena/mv';

resetMSState();
saveMSSettings({ ...settingsDefaultValues, type: StartType.Serve });
forwardCourtStep(predefinedCourtSteps[StartType.Serve][0]);

// Render within your application, supplying its persistence/navigation callbacks:
// <SettingsCourt createMS={createMS} editMS={editMS} goBack={goBack} loading={false} />
```

React and React DOM must use the same major. React, Effector and UI packages are shared with
the application through peer dependencies and excluded from the bundle. Effector holds editor
settings and trades; effector-react subscribes components to these stores. dnd-kit handles
movement, while @sensearena/ui uses react-spring for animation. MUI Tooltip uses Emotion and
its slots/slotProps API. vanilla-extract compiles styles during the library build: consumers
import generated CSS and do not need the vanilla-extract Vite plugin.

Use the package root and `@sensearena/mv/theme.css` exports. ESM import and CommonJS require
both have matching declarations, including TypeScript NodeNext resolution. For older browsers
without Array.prototype.at, supply a polyfill such as `core-js/actual/array/at`. The application's
dependencies determine its browser requirements; MUI 9 raises those requirements.

## Compatible dependencies

Updated and verified on 2026-10-21. Development versions are exact in package.json and
transitive versions are recorded in pnpm-lock.yaml.

| Packages                                         | Tested development versions    | Consumer peer range    |
| ------------------------------------------------ | ------------------------------ | ---------------------- |
| React / React DOM                                | 19.3.1 / 19.3.1                | 19.x                   |
| @sensearena/ui                                   | 0.3.1                          | ^0.3.1                 |
| @react-spring/web                                | 10.1.2                         | 10.x                   |
| @mui/material                                    | 9.5.0; also tested with 7.3.9 and 7.0.0  | 7.x or ^9.5.0       |
| @emotion/react / styled                          | 11.14.0 / 11.14.1              | 11.x                   |
| @dnd-kit/core / modifiers / sortable / utilities | 6.3.1 / 9.0.0 / 10.0.0 / 3.2.2 | 6.x / 9.x / 10.x / 3.x |
| effector / effector-react                        | 23.4.4 / 23.3.0                | 23.x                   |
| @vanilla-extract/css / recipes                   | 1.21.3 / 0.5.7                 | 1.x / 0.x              |
| perfect-arrows                                   | 0.3.7                          | 0.x                    |
| Vite / @vitejs/plugin-react                      | 8.3.4 / 6.1.2                  | Build tools only       |
| @vanilla-extract/vite-plugin                     | 5.2.6                          | Build tool only        |
| Storybook and its React/Vite/link packages       | 10.6.3                         | Development only       |
| TypeScript / unplugin-dts                        | 6.0.3 / 1.1.2                  | Build tools only       |

@sensearena/ui 0.2.x declared React 18 / react-spring 9 peers, conflicting with this library's
React 19 / react-spring 10 peers. Version 0.3.1 supports both and fixes its package exports.
Applications upgrading this library must also upgrade @sensearena/ui to at least 0.3.1.

TypeScript 7.0.2 is available, but does not provide the compiler API consumed by unplugin-dts.
This project uses TypeScript 6.0.3 throughout, without aliases, preview compilers or a second
top-level TypeScript version. Revisit TypeScript 7 after its API and declaration tooling are compatible.
baseUrl was replaced by explicit paths for the TypeScript 6/7 migration.

Declaration generation moved from vite-plugin-dts 4 to unplugin-dts 1. It writes .d.mts and
.d.cts trees and rewrites internal paths, without API Extractor or declaration bundling.
Vite 8 uses Rolldown and Lightning CSS; all peer subpaths remain external.
CSS is marked as a side effect so application bundlers preserve imported styles.
Transitive dependencies were also refreshed within their declared ranges; pnpm audit reports no vulnerabilities.

## Development and checks

Use Node.js 24 LTS and pnpm. The pnpm version is not pinned.
Vite 8 requires Node.js 20.19+ or 22.12+; CI uses Node.js 24 and installs pnpm latest.
Project settings for pnpm 12 live in pnpm-workspace.yaml; older pnpm versions also read .npmrc.
Release-age filtering is temporarily disabled in both files to permit the latest locked releases.
Only esbuild is allowed to run an installation script. No pnpm version is pinned and package.json
contains no package-manager configuration. Remove the temporary release-age settings when no longer needed.

```sh
pnpm install --frozen-lockfile --strict-peer-dependencies
pnpm typecheck
pnpm test:package
pnpm build:test
pnpm build-storybook
pnpm exec playwright install chromium
pnpm test:storybook
```

`test:package` builds the library, packs it, and installs the tarball using npm in a temporary
application with strict peer validation. It checks packed files, ESM/CommonJS exports, CSS,
strict TypeScript NodeNext resolution, SSR, Vite consumer builds with retained CSS, Effector events and coordinate conversion with both
supported MUI major versions. The temporary application is removed afterwards.

`test:storybook` serves the built Storybook locally and exercises Rally, Serve and Return:
assets, hints, drag and drop, configuration tooltips, back/next navigation and save.
CI installs Chromium with --with-deps on Linux and runs both suites before publication.

`pnpm build` emits the library and declarations. `pnpm build:test` additionally emits a bundle
visualizer report. npm pack and npm publish rebuild through prepack to prevent stale output.
These commands do not change the version or create commits. Publishing is a separate release action.

## Upstream documentation

- [TypeScript 6 migration](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [TypeScript 7 compiler API limitations](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0)
- [unplugin-dts migration](https://github.com/qmhc/unplugin-dts/blob/main/docs/en/migration-v4-to-v5.md)
- [unplugin-dts options and dual declarations](https://github.com/qmhc/unplugin-dts/blob/main/docs/en/options.md)
- [Vite 8 migration](https://vite.dev/guide/migration) and [library mode](https://vite.dev/guide/build#library-mode)
- [vanilla-extract with Vite](https://vanilla-extract.style/documentation/integrations/vite/)
- [MUI 7 to 9 migration, including Tooltip slots](https://mui.com/material-ui/migration/upgrade-to-v9/)
- [React 19 migration](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Storybook React/Vite integration](https://storybook.js.org/docs/get-started/frameworks/react-vite)
- [dnd-kit packages](https://dndkit.com/legacy/introduction/installation/)
- [Effector React bindings](https://effector.dev/en/api/effector-react/)
- [React Spring installation](https://react-spring.dev/docs/getting-started)
- [Emotion installation](https://emotion.sh/docs/install)
- [@sensearena/ui source and documentation](https://github.com/Sense-Arena/ui)
