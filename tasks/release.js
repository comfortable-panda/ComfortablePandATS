const archiver = require('archiver');
const fs = require('fs');
const packageJSON = require('../package.json');

if (process.argv.length !== 3) {
    console.error("error: ex) node release chrome");
    process.exit(1);
}
const browser = process.argv[2];
const version = packageJSON.version;

const output = fs.createWriteStream(`./dist/release/comfortable-sakai-${browser}-v${version}.zip`);
const archive = archiver('zip', {
    zlib: {level: 9}
});

fs.mkdir('./dist/release', {recursive: true}, (err) => {
    if (err) throw err;
});

archive.pipe(output);

switch (browser) {
    case "chrome":
        archive.directory(`./dist/source/${browser}`, `comfortable-sakai-v${version}`);
        break;
    case "firefox":
        archive.directory(`./dist/source/${browser}`, ``);
}

archive.finalize();
