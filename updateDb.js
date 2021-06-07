const sqlite3 = require('sqlite3')
const path = require('path')
const schema = require('./schema')
const fs = require('fs')
const moment = require('moment')

function csvToArray(filepath) {
    const file = fs.readFileSync(filepath)
    const data = file.toString('utf8')
    return data.split('\r\n').filter(row => row != '').map(row=> row.split(','))
}

function main(filepath) {
    const db = new sqlite3.Database(path.resolve(__dirname, './compiledSqli.db'));
    const rows = csvToArray(filepath);
    const filename = filepath.split(path.sep).pop()

    db.serialize(function () {
        
        db.run(schema);
        db.run(`DELETE FROM daily_bhav where filename='${filename}'`)

        const stmt = db.prepare("INSERT INTO daily_bhav VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", );
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i]
            const date = moment(row[2],'DD-MMM-yyyy').format('yyyyMMDD')
            row.splice(2,0,date)
            row.push(filename)
            stmt.run(row);
        }
        stmt.finalize();

        db.each(`SELECT count(1) as RECORDS_INSERTED FROM daily_bhav where filename='${filename}'`, function (err, row) {
            console.log(row);
        });
    });

    db.close();
}

main(path.resolve(__dirname,'./data/sec_bhavdata_full_01062021.csv'))