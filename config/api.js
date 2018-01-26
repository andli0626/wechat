const {appID, appSecret} = require('./base')
const prefix = 'https://api.weixin.qq.com/cgi-bin/'

module.exports = {
  accessToken: `${prefix}token?grant_type=client_credential&appid=${appID}&secret=${appSecret}`,
  createMenu: `${prefix}menu/create`
}