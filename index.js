const axios = require("axios")
const fs = require("fs")
const path = require("path")
const moment = require('moment')

const date = process.argv[2] ? moment(new Date(process.argv[2])) : moment()
const dateString = date.format("DDMMyyyy")
const url = `https://archives.nseindia.com/products/content/sec_bhavdata_full_${dateString}.csv`

function getFileName(url) {
    return url.split("/").pop()
}

function download() {
    const response = axios({
        url,
        method: 'GET',
        responseType: 'stream'
    }).then((response) => {
        const filepath = path.resolve(__dirname, 'data', getFileName(url))
        const writer = fs.createWriteStream(filepath)
        if (response.statusText == "OK") {
            response.data.pipe(writer)
            console.log("File downloaded:", getFileName(url))
        }
    }).catch((e) => {
        console.error(e.toString(), `, Url: ${url}`)
    })
}

const day = date.format('dddd')
if(day != 'Saturday' && day != 'Sunday') download()
