const zip = require('bestzip');
const fs = require('fs');
const packageJSON = require('../package.json');

if (process.argv.length !== 3) {
    console.error("error: ex) node release chrome");
    process.exit(1);
}
const browser = process.argv[2];
const version = packageJSON.version;

fs.mkdir('./dist/release', { recursive: true }, (err) => {
    if (err) throw err;
});
zip({
    source: `dist/source/${browser}/*`,
    destination: `./dist/release/comfortable-sakai-${browser}-v${version}.zip`
}).then(function() {
    console.log('all done!');
}).catch(function(err) {
    console.error(err.stack);
    process.exit(1);
});