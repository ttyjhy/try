import Koa from 'koa'
import koaRouter from 'koa-router'
import views from 'koa-views'
import convert from 'koa-convert'
import json from 'koa-json'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import cors from 'koa2-cors'
import koaStatic from 'koa-static'

// Api
import data from './routes/data/data'
import tag from './routes/tag/tag'
import lang from './routes/lang/lang'

const app = new Koa()
const router = koaRouter()

// middlewares
app.use(convert(bodyparser()))
app.use(convert(cors()))
app.use(convert(json()))
app.use(convert(logger()))
app.use(convert(koaStatic(__dirname + '/../client/build')))
app.use(views(__dirname + '/views', { extension: 'jade' }))

router.use('/data', data.routes(), data.allowedMethods())
router.use('/tag', tag.routes(), tag.allowedMethods())
router.use('/lang', lang.routes(), lang.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${new Date().toLocaleString()}: ${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.on('error', function (err, ctx) {
  console.log('server error', err)
})

export default app
