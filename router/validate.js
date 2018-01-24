const sha1 = require('sha1')
const {token} = require('../config/base')

module.exports = function () {
  return async function validate(ctx, next) {
    const {
      signature,
      timestamp,
      nonce,
      echostr
    } = ctx.request.query
    let str = [token, timestamp, nonce].sort().join('')
    if (sha1(str) === signature) {
      if (ctx.method == 'GET') {
        // console.log('验证成功')
        ctx.body = echostr
      } else {
        // console.log('下一个中间件')
        await next()
      }
    }
  }
}