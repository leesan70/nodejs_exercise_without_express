var fs = require('fs');
var util = require('util');
fs.readFileAsync = util.promisify(fs.readFile);

var f = (strings, ...values) => {
  console.log(strings);
  console.log(values);
  return 'tagged template literal';
};
const a = 1;
const text = f`hello`;
console.log(text);

var promises = [];
for (var i = 0; i < 3; i++) {
  promises.push(fs.readFileAsync(`${i + 1}.html`, 'utf-8', (err, data) => {
    console.log(data);
    console.log(i);
  }));
}
Promise.resolve(promises)
