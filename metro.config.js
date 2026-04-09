// https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Zustand's package.json exports point .mjs (ESM) files when the "import"
// condition is active. Those .mjs files use `import.meta` which Metro/Hermes
// cannot handle. We intercept zustand imports and redirect them to the
// known-good CommonJS (.js) files in the package root.
const zustandDir = path.dirname(
  require.resolve("zustand/package.json", { paths: [__dirname] }),
);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("zustand")) {
    const subpath =
      moduleName.replace("zustand/", "").replace("zustand", "index") + ".js";
    return {
      type: "sourceFile",
      filePath: path.join(zustandDir, subpath),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
