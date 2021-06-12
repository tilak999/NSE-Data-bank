const axios = require("axios");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const url = `https://www1.nseindia.com/content/historical/EQUITIES/$year/$month/cm$dateStringbhav.csv.zip`;

function getFileName(url) {
  const chunks = url.split("/");
  return chunks[chunks.length - 1];
}

const cookie =
  "pointer=1; sym1=LT; ak_bmsc=2AB71B1FC0E935FDE369C91BFE1AF4481736535670770000A17ABC604B996D26~plPIUfgdZT+ZJm07sKl59OD9ixQnW5p3JmrGz6v2rFeuixdbGUpV32o1F5zDHVfXpMpgzlYbBJx7UZK7lcw+c8Um3D5LxZTa/vxqOnrAgAa5edWuS9k/nQC95LluH6n+bKoeHn97qWg8HwS65Wxp3BF1kfhwXoNW4VdwmeVDTt/quRBenX/TjJyuneXeQ5/XjiVRiDyG8+Rz39KJemmWH3auv1CaxBTrz0U9gyJ8Cow1ZL8E/NJtuv7Ry9JOzO8B4qnBoVnZ1iZpNJGASVuzl/jw==; AKA_A2=A; bm_sv=B599286690E667A7A7E93C8F87139702~SW01SHEikU6NqJY8hfA32ap6jbTJ7VGGCsVrrA+dyEORiqcOrCrYenWGWfE7VYepOZwN28tUW/gwnAYIK8c3HBWJPlC6w88AaklEUpf/zR02qHzXc0DfFTUeo6gWH3FOwG40M1l4Xksba+rZAQ7mzLutHTCyPu8QbzXA5CVQQzw=; bm_mi=BC64742DDFEDE631D8D91809CB778CEB~y7KMrh0/pgCdjI4fAb3o+o0rylyE+/XAo9OyQY+cd4uWxrhwJRs6BDyXaCkhQrlHAcyZfzFqmD1i0KycCwqAFJlJYRdNmvDkYSIANMYpRlkyVVNbQ2Wfd2YjQWRwQ3CUjqKcNDsMIblJoNo5Ikgv9Pjc2rL2zKdqG7n9qyyP8nTa5jFuX7yIhkphBOLO8ATlMPUKs4CFz+vy6/yn8EwgUCZpudtCPUNZNtLYcJ3fiKd1EYpjGprFEp/VHRsAc2X7GcraZNAf3iIPqaI2GsreZw==; NSE-TEST-1=1927290890.20480.0000";

function download(url) {
  const response = axios({
    url,
    method: "GET",
    responseType: "stream",
    headers: {
      DNT: 1,
      Referer:
        "https://www1.nseindia.com/products/content/equities/equities/archieve_eq.htm",
      Cookie: cookie,
    },
  })
    .then((response) => {
      const filepath = path.resolve(__dirname, "data", getFileName(url));
      const writer = fs.createWriteStream(filepath);
      if (response.statusText == "OK") {
        response.data.pipe(writer);
        console.log("File downloaded:", getFileName(url));
      }
    })
    .catch((e) => {
      console.error(e.toString(), `, Url: ${url}`);
    });
}

let start = moment("11022011", "DDMMyyyy");
const urlSet = [];

while (true) {
  start = start.add(1, "days");
  const day = start.format("dddd");
  const dateString = start.format("DDMMMyyyy").toUpperCase();

  if (day != "Saturday" && day != "Sunday") {
    const finalURL = url
      .replace("$dateString", dateString)
      .replace("$year", start.format("yyy"))
      .replace("$month", start.format("MMM").toUpperCase());
    urlSet.push(finalURL);
  }

  if (start.format("ddMMyyyy") == moment().format("ddMMyyyy")) break;
}

let i = 0;
const timer = setInterval(() => {
  if (i < urlSet.length) {
    download(urlSet[i]);
    i++;
  } else {
    clearInterval(timer);
  }
}, 1000);

//download(url);
