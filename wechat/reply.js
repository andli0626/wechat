const Wechat = require('./Wechat')

module.exports = async (ctx,next) => {
  const message = ctx.wechat
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      // console.log('订阅关注')
      ctx.body = {
        MsgType: 'text',
        Content:'hello! 欢迎关注!'
      }
    }
  } else if (message.MsgType === 'text') {
    if (message.Content == '1') {
      // console.log('回复1')
      ctx.body = {
        MsgType: 'text',
        Content: 'hello!!'
      }
    }
  }
}