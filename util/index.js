const fs = require('fs')
const path = require('path')
const axios = require('axios')
const moment = require('moment')
const xml2js = require('xml2js')
const template = require('../wechat/template')
/**
 * 记录错误日志
 * @param {String} type 错误产生类型
 * @param {String} errStr 错误字符串
 */
const wirteLog = async (type, errStr) => {
  const data = await readFile('../log.txt')
  let str = moment().format('YYYY-MM-DD HH:mm:ss ') + type + '错误: \n' + errStr + '\n'
  str = data + str
  fs.writeFile('log.txt', str, 'utf8', (err) => {
    if (err) reject(err)
  })
}

/**
 * 读取文件
 * @param {String} fileName 文件路径
 */
const readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, fileName), 'utf8', async (err, data) => {
      if (err) {
        await wirteLog('读取文件', String(err))
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * 写入文件
 * @param {String} fileName 文件路径
 * @param {String} data //写入得数据
 */
const writeFile = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(__dirname, fileName), data, 'utf8', async (err, data) => {
      if (err) {
        await wirteLog('写入文件', String(err))
        reject(err)
      }
    })
  })
}

/**
 * 异步请求
 * @param {Object} params 参数
 */
const request = (params) => {
  axios(params).then((res) => {
    Promise.resolve(res.data)
  }).catch(async (err) => {
    await wirteLog('异步请求', String(err))
  })
}

/**
 * 解析xml
 * @param {XML} data xml数据
 */
const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml,{trim: true}, async (err, data) => {
      if (err) {
        await wirteLog('解析xml', String(err))
        reject(err)
      }else {
        resolve(data)
      }
    })
  })
}
/**
 * 解析parseXML后获取得xml对象
 * @param {Object} obj xml对象
 */
const formatMessage = (result) => {
  let message = {}
  if (typeof result === 'object') {
    const keys = Object.keys(result)
    for (let i =0; i < keys.length; i++) {
      let key = keys[i]
      let item = result[key]
      if (!(item instanceof Array) || item.length === 0) {
        continue
      }
      if (item.length === 1) {
        let val = item[0]
        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = []
        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return message
}

const tpl = (content, message) => {
  let info = Object.assign({}, content, {
    CreateTime: Date.now(),
    ToUserName: message.FromUserName,
    FromUserName: message.ToUserName
  })
  return template(info)
}
module.exports = {
  readFile,
  writeFile,
  wirteLog,
  request,
  parseXML,
  formatMessage,
  tpl
}
