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
    zlib: {level: 9} // Sets the compression level.
});

fs.mkdir('./dist/release', {recursive: true}, (err) => {
    if (err) throw err;
});
// zip({
//     source: `./dist/source/${browser}/css/*`,
//     destination: `./dist/release/comfortable-sakai-${browser}-v${version}.zip`
// }).then(function() {
//     console.log('all done!');
// }).catch(function(err) {
//     console.error(err.stack);
//     process.exit(1);
// });

archive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
// archive.directory( `./dist/source/${browser}/css/*`, `./dist/release`);
if (browser === "chrome") {
    archive.directory(`./dist/source/${browser}`, `comfortable-sakai-v${version}`);
}

if (browser === "firefox") {
    archive.directory(`./dist/source/${browser}`, ``);
}


archive.finalize();