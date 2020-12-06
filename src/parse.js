const Papa = require('papaparse');
const fs = require('fs');

const animeFilePath = './assets/data.csv';
const animeFile = fs.readFileSync(animeFilePath, "utf8");

const animeRows = {};
Papa.parse(animeFile, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        animeRows.data = results.data;
        animeRows.errors = results.errors;
        animeRows.meta = results.meta;
    }
})

fs.writeFile('data.json', JSON.stringify(animeRows.data), function (err) {
    if (err) throw err;
    console.log('Saved!');
});