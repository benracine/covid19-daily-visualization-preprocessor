var d3 = require('d3');
const fs = require('fs');
const { program } = require('commander');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

// Command line arguments
program
  .option('-f, --filename <type>', 'input file to consume')



const process = async (filename) => {
  const inputString = await readFileAsync(filename, 'utf8');
  const inputCSV = d3.csvParse(filename);
  console.log(inputCSV);
}

if (require.main === module) {
  program.parse(process.argv);
  process(program.filename);
}
