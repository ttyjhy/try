import { success, error } from './response'
const fs = require('fs');
const datapath = __dirname + '/../../data.json';

/**
* 随机截取指定长度的字符串
* @param {number} len 为截取字符串长度
* @param {string} letters 要截取的字符串模板，默认为 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
*/
export const randomStrWithLength = (len, letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') => {
  var str = ''
  for (let i = 0; i < len; i++) {
    var start = Math.floor(Math.random() * Math.floor(letters.length))
    str = str + letters.substring(start, start + 1)
  }
  return str
}

export const selectAll = (tableName) => {

  return new Promise((resolve, reject) => {
    // 读取文件内容
    fs.readFile(datapath, 'utf8', (err, data) => {
      if (err) {
        reject(error(err))
      };
      data = JSON.parse(data)
      resolve(success(data[tableName]))
    });
  })
}

export const selectById = (tableName, id) => {
  return new Promise((resolve, reject) => {
    // 读取文件内容
    fs.readFile(datapath, 'utf8', (err, data) => {
      if (err) {
        reject(error(err))
      };
      data = JSON.parse(data)
      const target = data[tableName].find(item => item.id == id)
      resolve(success(target))
    });
  })
}

export const update = (tableName, row) => {
  return new Promise((resolve, reject) => {
    // 读取文件内容
    fs.readFile(datapath, 'utf8', (err, data) => {
      if (err) {
        reject(error(err))
      };
      data = JSON.parse(data)
      const index = data[tableName].findIndex(item => item.id == row.id)
      data[tableName][index] = row

      // 写入文件内容
      fs.writeFile(datapath, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          reject(error(err))
        };
        resolve(success())
      });
    });
  })
}

export const updateLang = (tableName, lang) => {
  return new Promise((resolve, reject) => {
    // 读取文件内容
    fs.readFile(datapath, 'utf8', (err, data) => {
      if (err) {
        reject(error(err))
      };
      data = JSON.parse(data)
      data[tableName] = lang

      // 写入文件内容
      fs.writeFile(datapath, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          reject(error(err))
        };
        resolve(success())
      });
    });
  })
}

export const insert = (tableName, row) => {
  return new Promise((resolve, reject) => {
    // 读取文件内容
    fs.readFile(datapath, 'utf8', (err, data) => {
      if (err) {
        reject(error(err))
      };
      data = JSON.parse(data)
      row.id = randomStrWithLength(4) + `_${+new Date()}`
      data[tableName].push(row)

      // 写入文件内容
      fs.writeFile(datapath, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          reject(error(err))
        };
        resolve(success())
      });
    });
  })
}

export const deleteById = (tableName, id) => {
  return new Promise((resolve, reject) => {
    // 读取文件内容
    fs.readFile(datapath, 'utf8', (err, data) => {
      if (err) {
        reject(error(err))
      };
      data = JSON.parse(data)
      const index = data[tableName].findIndex(item => item.id == id)
      if (index != -1) {
        data[tableName].splice(index, 1)
      }
      // 写入文件内容
      fs.writeFile(datapath, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          reject(error(err))
        };
        resolve(success())
      });
    });
  })
}

