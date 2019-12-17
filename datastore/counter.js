const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter((err, id) => {
    if(err) return callback(err, null)
    writeCounter(id + 1, (err, counterString) => {
      if(err) return callback(err, null)
      callback(null, counterString)
    })
  })

};

// fs.readFile(counterFile, (err, data)=>{
//   if(err) throw err;
//   counter = parseInt(data.toString()) + 1;
//   id = zeroPaddedNumber(counter);
//   console.log(id)
//   fs.writeFile(counterFile, '25', (err)=>{
//     if(err) throw err;
//     if(id){
//       callback(null, id)
//     }
//     else callback('not valid id')
//   })
// });
// console.log(fs.readFileSync(counterFile).toString(), 'this is just o make sure')


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////
exports.counterFile = path.join(__dirname, 'counter.txt');
