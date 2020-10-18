var d3 = require('d3');
const fs = require('fs');
const { program } = require('commander');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

// Command line arguments
program
  .option('-f, --filename <type>', 'input file to consume')

const csvParsePop = (d) => {
  return {
    fips: d.FIPS,
    pop: d.POP_ESTIMA,
  }
};

const getPopByFips = (inputString) => {
  const popKeyValues = d3.csvParse(inputString, csvParsePop);
  let popByFips = {};
  popKeyValues.forEach(row => {
    popByFips[row.fips] = parseInt(row.pop);
  });
  return popByFips;
}

const process = async (filename) => {
  const inputString = await readFileAsync(filename, 'utf8');

  const popByFips = getPopByFips(inputString);
  console.log(popByFips);
}

if (require.main === module) {
  program.parse(process.argv);
  process(program.filename);
}
