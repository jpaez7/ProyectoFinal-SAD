const fs = require('fs');

function pi(n) {
  let area = 0;

  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) / n;
    area += 4.0 / (1.0 + x * x);
  }

  const result = area / n;
  return result;
}

const args = process.argv.slice(2);
const output = pi(args[0]);



fs.writeFile(args[1], output.toString(), err => {
  if (err) {
    console.error(err);
  }
});
