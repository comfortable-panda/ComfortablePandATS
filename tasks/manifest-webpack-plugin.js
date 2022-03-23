const fs = require("fs");
const path = require("path");
const {jsonRegex} = require("ts-loader/dist/constants");

module.exports = class MergeManifestWebpackPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.done.tap("ManifestPlugin", stats => {
            const manifestPath = path.resolve(__dirname, '..') + "/manifest.json";
            const firefoxManifestPath = path.resolve(__dirname, '..') + "/manifest-firefox.json";
            const savePath = path.resolve(__dirname, '..') + "/dist/source/firefox/manifest.json";

            fs.readFile(manifestPath, "utf-8", (err, manifest) => {
                if (err) throw err;
                fs.readFile(firefoxManifestPath, "utf-8", (err, ffManifest) => {
                    if (err) throw err;
                    const mergeManifestJson = { ...JSON.parse(manifest), ...JSON.parse(ffManifest) };
                    fs.writeFile(savePath, JSON.stringify(mergeManifestJson, null, 1), (err) => {
                        if (err) throw err;
                    });
                });
            });
        });
    }
};