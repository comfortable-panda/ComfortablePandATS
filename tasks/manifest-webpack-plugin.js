const fs = require("fs").promises;
const path = require("path");

module.exports = class MergeManifestWebpackPlugin {
    constructor(options) {
        this.options = options || {
            browser: "chrome"
        };
    }
    apply(compiler) {
        compiler.hooks.done.tap("ManifestPlugin", async (stats) => {
            const { browser } = this.options;
            const packagePath = path.resolve(__dirname, '..') + "/package.json";
            const manifestPath = path.resolve(__dirname, '..') + "/manifest.json";
            const firefoxManifestPath = path.resolve(__dirname, '..') + "/manifest-firefox.json";
            const savePath = path.resolve(__dirname, '..') + `/dist/source/${browser}/manifest.json`;

            const packageJson = await fs.readFile(packagePath, 'utf8');
            const manifestJson = await fs.readFile(manifestPath, 'utf8');
            const ffManifestJson = await fs.readFile(firefoxManifestPath, 'utf8');
            let mergeManifestJson;
            if (browser === "firefox") {
                mergeManifestJson = { ...JSON.parse(manifestJson), ...JSON.parse(ffManifestJson) };
            } else {
                mergeManifestJson = {...JSON.parse(manifestJson)};
            }
            mergeManifestJson.version = JSON.parse(packageJson).version;
            console.log(mergeManifestJson)
            await fs.writeFile(savePath, JSON.stringify(mergeManifestJson, null, 1));
        });
    }
};