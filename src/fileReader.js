const axios = require('axios');
const fs = require('fs');
const stockList = require('./data.json');

let names = [];

stockList.forEach(item => {
    let symbol = item["Holding Ticker"].trim();
    let name = item.Name.trim();

    names.push(name);
})

console.log(names);
let logos = {};

names.forEach(name => {
    axios.get("https://autocomplete.clearbit.com/v1/companies/suggest", {
        params: {
            query: name.split(' ')[0]
        }
    })
    .then(response => {
        logos[name] = response.data[0].logo;
        // console.log(JSON.stringify(logos));
        fs.writeFile('logos.json', JSON.stringify(logos), function (err) {
            if (err) throw err;
            console.log('Saved!');
            console.log(Object.keys(logos).length);
        });
    })
    .catch(error => {
        console.log(error);
    })
})
