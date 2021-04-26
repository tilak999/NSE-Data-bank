const axios = require("axios")
const fs = require("fs")
const path = require("path")

const date = process.argv[2] ? new Date(process.argv[2]) : new Date()
const month = date.getMonth() + 1
const dateString = date.getDate() + (month < 10 ? ('0' + month) : month) + date.getFullYear() + ''
const url = `https://archives.nseindia.com/products/content/sec_bhavdata_full_${dateString}.csv`

function getFileName(url) {
    const chunks = url.split("/")
    return chunks[chunks.length - 1]
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

if(date.getDay() >= 1 && date.getDay() <=5) download()
