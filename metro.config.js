// https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Zustand's package.json exports point .mjs (ESM) files when the "import"
// condition is active. Those .mjs files use `import.meta` which Metro/Hermes
// cannot handle. We intercept zustand imports and redirect them to the
// known-good CommonJS (.js) files in the package root.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "zustand" || moduleName === "zustand/middleware" || moduleName === "zustand/middleware/immer" || moduleName === "zustand/react" || moduleName === "zustand/vanilla") {
    const packageDir = path.dirname(
      require.resolve("zustand/package.json", { paths: [__dirname] })
    );
    // e.g. "zustand/middleware" → "<packageDir>/middleware.js"
    const subpath = moduleName === "zustand"
      ? "index.js"
      : moduleName.replace("zustand/", "") + ".js";
    return {
      type: "sourceFile",
      filePath: path.join(packageDir, subpath),
    };
  }
  // Fall back to default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
