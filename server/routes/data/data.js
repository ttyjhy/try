import koaRouter from 'koa-router'
const router = koaRouter()
import { deleteById, insert, selectAll, update } from '../../utils/utils'

router.get('/list', async (ctx, next) => {
  ctx.body = await selectAll('data');
})

router.post('/add', async (ctx, next) => {
  const data = ctx.request.body
  ctx.body = await insert('data', data)
})

router.put('/edit', async (ctx, next) => {
  const data = ctx.request.body
  ctx.body = await update('data', data)
})

router.delete('/delete', async (ctx, next) => {
  const data = ctx.request.query
  console.log(data)
  ctx.body = await deleteById('data', data.id)
})

export default router
