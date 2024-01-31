const fs = require('fs');

var factorial = function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

const args = process.argv.slice(2);
const result = factorial(args[0]);
fs.writeFile(args[1], result.toString(), err => {
  if (err) {
    console.error(err);
  }
});
