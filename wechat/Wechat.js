const api = require('../config/api')
const {readFile, writeFile, request} = require('../util/index')
const TIME = 600 // 提前10分钟

class Wechat {
  // 获取token
  async getAccessToken() {
    if (this.validateAccessToken(this.token)) {
      //console.log('未过期: ' + this.token)
      return this.token.access_token
    } else {
      let data = JSON.parse(await readFile('../accessToken.txt'))
      if (this.validateAccessToken(data)) {
        this.token = data
        //console.log('文件读取: ' + JSON.stringify(data))
        return data.access_token
      } else {
        let data = await request({
          method: 'get',
          url: api.accessToken
        })
        data.expires_in = (Date.now() / 1000) + data.expires_in - TIME
        this.token = data
        writeFile('../accessToken.txt', JSON.stringify(data))
        //console.log('GET获取: ' + JSON.stringify(data))
        return data.access_token
      }
    }
  }
  // 
  validateAccessToken(token) {
    if (token && token.access_token && token.expires_in) {
      const nowSeconds = Date.now() / 1000
      if (nowSeconds < token.expires_in) {
        return true
      }
    }
    return false
  }
}

module.exports = Wechat