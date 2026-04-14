// https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Zustand's package.json exports point to .mjs (ESM) files when the "import"
// condition is active. Those files use `import.meta` which Metro/Hermes cannot
// handle. We redirect every zustand import to its known CJS (.js) counterpart.
const zustandDir = path.dirname(
  require.resolve("zustand/package.json", { paths: [__dirname] }),
);

// Explicit map — avoids fragile string-replace heuristics
const ZUSTAND_CJS = {
  zustand: "index.js",
  "zustand/middleware": "middleware.js",
  "zustand/middleware/immer": "middleware/immer.js",
  "zustand/react": "react.js",
  "zustand/vanilla": "vanilla.js",
  "zustand/shallow": "shallow.js",
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const cjsFile = ZUSTAND_CJS[moduleName];
  if (cjsFile) {
    return {
      type: "sourceFile",
      filePath: path.join(zustandDir, cjsFile),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
