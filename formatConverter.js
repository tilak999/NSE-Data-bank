const moment = require("moment");
const { EOL } = require("os");
const path = require("path");
const fs = require("fs");

const NEW_FORMAT_HEADERS = [
  `SYMBOL`,
  `SERIES`,
  `DATE1`,
  `PREV_CLOSE`,
  `OPEN_PRICE`,
  `HIGH_PRICE`,
  `LOW_PRICE`,
  `LAST_PRICE`,
  `CLOSE_PRICE`,
  `AVG_PRICE`,
  `TTL_TRD_QNTY`,
  `TURNOVER_LACS`,
  `NO_OF_TRADES`,
  `DELIV_QTY`,
  `DELIV_PER`,
];

function csvToArray(filepath) {
  const file = fs.readFileSync(filepath);
  const data = file.toString("utf8");
  return data
    .split(EOL)
    .filter((row) => row != "")
    .map((row) => row.split(","));
}

function arrayToCsv(destPath, rows) {
  rows = rows.map((row) => row.join(","));
  const data = rows.join(EOL);
  fs.writeFileSync(destPath, data);
}

function oldToNewFormat(sourcePath, destPath) {
  const data = csvToArray(sourcePath);
  const rows = [NEW_FORMAT_HEADERS];
  for (let i = 1; i < data.length; i++) {
    const row = [];
    row[0] = data[i][0];
    row[1] = data[i][1];
    row[2] = data[i][10];
    row[3] = data[i][7];
    row[4] = data[i][2];
    row[5] = data[i][3];
    row[6] = data[i][4];
    row[7] = data[i][6];
    row[8] = data[i][5];
    row[9] = 0;
    row[10] = data[i][8];
    row[11] = data[i][9];
    row[12] = 0;
    row[13] = 0;
    row[14] = 0;
    rows.push(row);
  }
  return rows;
}

function main() {
  const files = fs.readdirSync(path.resolve("historic_data"));
  for (const file of files) {
    if (!file.endsWith(".csv")) continue;
    const source = path.resolve(`historic_data/${file}`);
    const rows = oldToNewFormat(source);
    const date = path.basename(source).substr(2, 9).toLowerCase();
    const outDate = moment(date, "DDMMMYYYY").format("DDMMYYYY");
    const dest = path.resolve(`data/sec_bhavdata_full_${outDate}.csv`);
    if (outDate == "Invalid date") err.push(source);
    arrayToCsv(dest, rows);
    console.log(`processed: ${source}`);
  }
}

main();
