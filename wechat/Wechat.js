const fs = require('fs')
const path = require('path')
const axios = require('axios')
const {promisify} = require('util')
const api = require('../config/api')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const {request} = require('../util/index')
const TIME = 600 // 提前10分钟

class Wechat {
  // 获取token
  async getAccessToken() {
    if (!this.validateAccessToken(this.token)) {
      const data = await readFile(path.resolve(__dirname, '../accessToken.txt'), 'utf8')
      if (data && this.validateAccessToken(JSON.parse(data))) {
        // console.log('文件读取: ' + data)
        this.token = JSON.parse(data)
      } else {
        let data = await request({
          method: 'get',
          url: api.accessToken
        })
        data.expires_in = (Date.now() / 1000) + data.expires_in - TIME
        writeFile(path.resolve(__dirname, '../accessToken.txt'), JSON.stringify(data))
        // console.log('GET获取: ' + JSON.stringify(data))
        this.token = data
      }
    }
    return this.token.access_token
  }
    // 检验token
    validateAccessToken(token) {
      if (token && token.access_token && token.expires_in) {
        const nowSeconds = Date.now() / 1000
        if (nowSeconds < token.expires_in) {
          return true
        }
      }
      return false
    }
    // 创建自定义菜单
  async createMenu(menu) {
    //api.createMenu
    const url = api.createMenu + '?access_token=' + await this.getAccessToken()
    const data = await request({
      method: 'post',
      url: url,
      data: menu
    })
    return data
  }
}

  module.exports = Wechat