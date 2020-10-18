var d3 = require('d3');
const fs = require('fs');
const { program } = require('commander');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const moment = require('moment');
const { start } = require('repl');
const put = console.log;
const numDays = 14;  // todo: should not be hardcoded

// Command line arguments
program
  .option('-f, --filename <type>', 'input file to consume')

const csvParsePop = (d) => {
  const county = Object.values(d)[0];
  return {
    fips: d.FIPS,
    pop: d.POP_ESTIMA,
    state: d.state,
    county: county
  };
};

const getPopByFips = (inputString) => {
  const popKeyValues = d3.csvParse(inputString, csvParsePop);
  let popByFips = {};
  popKeyValues.forEach(row => {
    popByFips[row.fips] = parseInt(row.pop);
  });
  return popByFips;
}

const getNameByFips = (inputString) => {
  const popKeyValues = d3.csvParse(inputString, csvParsePop);
  let nameByFips = {};
  popKeyValues.forEach(row => {
    nameByFips[row.fips] = `${row.county}, ${row.state}`;
  });
  return nameByFips;
}

const getMatrix = (inputString) => {
  let lines = inputString.split('\n').filter(line => line.length > 3);
  let matrix = [];
  lines.forEach(line => {
    let row = line.split(',');
    matrix.push(row);
  });
  return matrix;
}

// The one that requires some column stuff
const getCasesByDateByFips = (inputString) => {
  const matrix = getMatrix(inputString);
  const offset = 4;   // todo: should not be hardcoded
  let byDate = {};

  // For each day
  let startDay = moment().month('2').date('15');
  for (i = 0; i < numDays; i++) {
    let date = startDay.format('YYYY-MM-DD');
    let byFips = {};
    for (j = 0; j < matrix.length; j++) {
      byFips[matrix[3]] = matrix[offset + i];
    }
    byDate[date] = byFips;
    startDay.add(1, 'day');
  }

  return byDate;
};

const process = async (filename) => {
  const inputString = await readFileAsync(filename, 'utf8');
  // const popByFips = getPopByFips(inputString);
  // const nameByFips = getNameByFips(inputString);
  const casesByDateByFips = getCasesByDateByFips(inputString);
  put(casesByDateByFips);
}

if (require.main === module) {
  program.parse(process.argv);
  process(program.filename);
}
