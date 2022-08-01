let fs = require("fs");

// Read Data
const ppleByDollar = fs
  .readFileSync("fixtures/people_by_dollar.txt", {
    encoding: "utf8",
    flag: "r",
  })
  .trim()
  .split("\n");
const ppleByPercent = fs
  .readFileSync("fixtures/people_by_percent.txt", {
    encoding: "utf8",
    flag: "r",
  })
  .trim()
  .split("\n");

// data format must be an array
function reshapeData(arr, fieldSeperator = ",") {
  if (Array.isArray(arr)) {
    let [fields, ...records] = arr;
    fields = fields.split(fieldSeperator);

    arr = records
      .map((d) => d.trim().split(fieldSeperator))
      .map((row) => {
        let obj = {};
        if (Array.isArray(row)) {
          row.forEach((cell, i) => {
            obj[fields[i].trim()] = cell.trim();
          });
        }
        return obj;
      });
    return arr;
  } else {
    throw new Error("Data not of the right format");
  }
}

function sortData(arr) {
  if (Array.isArray(arr)) {
    return arr.sort((a, b) => {
      if (a.first_name < b.first_name) return -1;
      if (a.first_name > b.first_name) return 1;

      return 0;
    });
  } else {
    throw new Error("Wrong Data Format");
  }
}

function rearrangeDate(dateStr, dateSeparator = "-") {
  // day- month - year
  // year - month - day
  //  month - day - year
  let dateArr = dateStr.split(dateSeparator);
  let year = "";
  for (let i = 0; i < dateArr.length; i++) {
    if (i === 0 && dateArr[0].length === 4) {
      year = dateArr[i];
    }
    //  last item ecountered
    if (dateArr[0].length === 4 && i === dateArr.length - 1) {
      dateArr[0] = dateArr[dateArr.length - 1];
      dateArr[i] = year;
    }
  }

  return dateArr.join(dateSeparator);
}

function formatOutput(arr, dateSeparator = "/") {
  if (Array.isArray(arr)) {
    return arr.map((d) => {
      // console.log(rearrangeDate(d?.birthdate));
      let date = new Date(d?.birthdate);
      let day = date.getDate();
      let month = date.getMonth() + 1;

      let year = date.getFullYear();
      let dateFormat = `${day}${dateSeparator}${month}${dateSeparator}${year}`;

      return d?.first_name + ", " + d?.city + ", " + dateFormat;
    });
  }
}

let newPeopleByDollar = reshapeData(ppleByDollar, "$");
let newPeopleByPercent = reshapeData(ppleByPercent, "%");
// let fakeData = reshapeData("dksdlkdkldslkkls", "%");
let newArr = newPeopleByDollar.concat(newPeopleByPercent);

// new Array
console.log(newArr);

// Sorted Array
let sortedArr = sortData(newArr);
console.log(sortedArr);

// Data Output
const output = formatOutput(sortedArr);

console.log(output);
