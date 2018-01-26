
const axios = require('axios')
const xml2js = require('xml2js')
const template = require('../wechat/template')

/**
 * 异步请求
 * @param {Object} params 参数
 */
const request = async (params) => {
  return await axios(params).then((res) => {
    return res.data
  }).catch((err) => {
    return err
  })
}






/**
 * 解析xml
 * @param {XML} data xml数据
 */
const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml,{trim: true}, (err, data) => {
      if (err) {
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






/**
 * 整合所有需要返回数据，套用模板返回
 * @param {Object} content 业务逻辑处理后返回得数据
 * @param {Object} message 接受到得数据 (ToUserName, FromUserName)
 */
const tpl = (content, message) => {
  let info = Object.assign({}, content, {
    CreateTime: Date.now(),
    ToUserName: message.FromUserName,
    FromUserName: message.ToUserName
  })
  return info.MsgType ? template(info) : ''
}





module.exports = {
  request,
  parseXML,
  formatMessage,
  tpl
}
