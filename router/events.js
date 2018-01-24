const Router = require('koa-router')
const getRawBody = require('raw-body')
const util = require('../util/index')
const reply = require('../wechat/reply')

module.exports = function () {
  return async function envents(ctx, next) {
    const data = await getRawBody(ctx.req, {
      length: ctx.length,
      limit: '1mb',
      encoding: ctx.charset
    })
    const content = await util.parseXML(data)
    const message = util.formatMessage(content.xml)
    // 将解析后得信息对象挂载到ctx.wechat上，以便其他可以拿到
    ctx.wechat = message
    // 业务逻辑，将返回得信息挂载到ctx.body
    await reply.apply(ctx, [ctx, next])
    // 通过tpl方法将所有信息转化没xml格式
    const xml = util.tpl(ctx.body, ctx.wechat)
    // console.log(xml)
    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
  }
}