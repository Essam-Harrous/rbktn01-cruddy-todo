const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id)=> {
    if(err) callback(err, null)
    fs.writeFile(`test/testData/${id}.txt`, text, err => {
      if(err) callback(err, null)
      callback(null, {id:id, text:text})
    })





  });
};

exports.readAll = (callback) => {
  fs.readdir('test/testData', (err, files)=>{
    if(err) callback(err, null);
    if(!files.length) callback(null, []);
    var items = [];
    files.forEach((file, i)=>{
      fs.readFile(`test/testData/${file}`, (err, text)=>{
        var id = file.slice(0, file.length - 4);
        if(err) callback(err, null);
        items.push({id: id, text: text + ''})
        if(i == files.length - 1) callback(null, items)
      })
    })
  })

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var existed = false;
  fs.readdir('test/testData', (err, files)=>{
    if(files.length){
      files.forEach((file, i)=>{
        if(file === id + '.txt'){
          existed = true;
          fs.readFile(`test/testData/${file}`, (err, fileData)=> {
            if (err) callback(new Error('there is no id'), null)
            else callback(err, {id: id, text: fileData + ''} )
          })
        }else if(i === files.length - 1 && !existed){
          callback(new Error('there is no id'), null)
        }
      })
    } else {
      callback(new Error('there is no id'), null)
    }
  })
};

exports.update = (id, text, callback) => {

  exports.readOne(id, (err, data) => {
    if(err) callback(new Error(`No item with id: ${id}`));
    else {

      data.text = text;
      fs.writeFile(`test/testData/${data.id}.txt`, text, (err)=> {

        if(err) callback(new Error(`No item `));
        else callback(null, data.text)
      })
    }

  })

};

exports.delete = (id, callback) => {
  exports.readOne(id, (err, data) => {
    if(err) callback(new Error(`No item with id: ${id}`));
    else {
      fs.unlink(`test/testData/${data.id}.txt`, (err)=> {

        if(err) callback(new Error(`No item `));
        else callback(null)
      })
    }

  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
