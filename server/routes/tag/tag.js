import koaRouter from 'koa-router'
const router = koaRouter()
import { deleteById, insert, selectAll, selectById, update } from '../../utils/utils'
import { error } from '../../utils/response';

router.get('/list', async (ctx, next) => {
  ctx.body = await selectAll('tag');
})

router.post('/add', async (ctx, next) => {
  const data = ctx.request.body
  ctx.body = await insert('tag', data)
})

router.put('/edit', async (ctx, next) => {
  const data = ctx.request.body
  ctx.body = await update('tag', data)
})

router.delete('/delete', async (ctx, next) => {
  const data = ctx.request.query

  const t = await selectById('tag', data.id)
  const res = await selectAll('data')
  const target = res.data.find(d => {
    const tags = d.tags || []
    return tags.includes(t.data.name)
  })
  if (target) {
    ctx.body = error('不能删除已用标签')
  } else {
    ctx.body = await deleteById('tag', data.id)
  }
})

export default router
