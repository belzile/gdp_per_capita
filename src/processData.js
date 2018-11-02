const fs = require('fs');
const xml2js = require('xml2js');
const dataFilePath = __dirname + '/../data.xml';
const parser = new xml2js.Parser();
const dataPerYear = {};

const dataToJSON = (xmlData) => {
    xmlData.Root.data[0].record
        .forEach(entry => parseSingleEntry(entry));
}

const parseSingleEntry = (entry) => {
    const country = entry.field[0]["_"];
    const year = entry.field[2]["_"];
    const value = entry.field[3]["_"];

    if (value) {
        addToYear(country, parseInt(year), Math.round(value));
    }
}

const addToYear = (country, year, value) => {
    let yearObject = dataPerYear[year];
    if (!yearObject) {
        dataPerYear[year] = [];
        yearObject = dataPerYear[year];
    }
    yearObject.push({
        name: country,
        value: value
    });
}

const writeDataToFile = () => {
    fs.writeFile(__dirname + "/data.json", JSON.stringify(dataPerYear), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

fs.readFile(dataFilePath, (err, data) => {
    parser.parseString(data, (err, result) => {
        dataToJSON(result);
        writeDataToFile();
    });
});