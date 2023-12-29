import koaRouter from 'koa-router'
const router = koaRouter()
import { deleteById, insert, selectAll, selectById, update, updateLang } from '../../utils/utils'
import { error } from '../../utils/response';

router.get('/list', async (ctx, next) => {
  ctx.body = await selectAll('lang');
})

router.put('/edit', async (ctx, next) => {
  const data = ctx.request.body
  ctx.body = await updateLang('lang', data.lang)
})

export default router
