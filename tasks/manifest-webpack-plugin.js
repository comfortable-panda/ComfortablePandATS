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
            const manifestV2Path = path.resolve(__dirname, '..') + "/manifest-v2.json";
            const firefoxManifestPath = path.resolve(__dirname, '..') + "/manifest-firefox.json";
            const savePath = path.resolve(__dirname, '..') + `/dist/source/${browser}/manifest.json`;

            const packageJson = await fs.readFile(packagePath, 'utf8');
            const manifestJson = await fs.readFile(manifestPath, 'utf8');
            const manifestV2Json = await fs.readFile(manifestV2Path, 'utf8');
            const ffManifestJson = await fs.readFile(firefoxManifestPath, 'utf8');
            let mergeManifestJson;
            switch (browser) {
                case "chrome":
                    mergeManifestJson = { ...JSON.parse(manifestJson) };
                    break;
                case "firefox":
                    mergeManifestJson = { ...JSON.parse(manifestV2Json), ...JSON.parse(ffManifestJson) };
                    break;
                case "safari":
                    mergeManifestJson = { ...JSON.parse(manifestV2Json) };
                    mergeManifestJson.content_scripts[0].matches[0] = "https://*/*";
                    break;
            }
            mergeManifestJson.version = JSON.parse(packageJson).version;
            await fs.writeFile(savePath, JSON.stringify(mergeManifestJson, null, 1));
            console.log("Merge manifest: Success ");
        });
    }
};