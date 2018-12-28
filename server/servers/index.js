const Koa = require('koa2');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const fs = require('fs');
const https = require('https')

const path = __dirname
router.get('/', async (ctx, next) => {
  const data = fs.readFileSync( '../server/books/data/recommendArticle.json')
  ctx.body = data.toString()
})

app.use(router.routes()).use(router.allowedMethods())


// const options = {
//   key: fs.readFileSync('../server/www.feisha.com.key'),
//   cert: fs.readFileSync('../server/www.feisha.com_ssl.crt')
// }
// https.createServer(options, app.callback()).listen(80)
app.listen(3000)
console.log('the serve is run 3000')