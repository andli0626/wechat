const Koa = require('koa')
const Router = require('koa-router')
const events = require('./router/events')
const validate = require('./router/validate')

const app = new Koa()
const router = new Router()

router.all('/', validate(),events())

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)