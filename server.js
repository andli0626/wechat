const Koa = require('koa')
const {resolve} = require('path')
const views = require('koa-views')
const Router = require('koa-router')
const movie = require('./router/movie')
const events = require('./router/events')
const validate = require('./router/validate')
const staticCache = require('koa-static-cache')

const app = new Koa()
const router = new Router()

router.all('/', validate(),events())
  .get('/movie/:id', movie())

app
  .use(views(resolve(__dirname, './views'), {
    extension: 'pug'
  }))
  .use(staticCache(resolve(__dirname, './public')))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)