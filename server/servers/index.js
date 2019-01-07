const Koa = require('koa2');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const fs = require('fs');
const https = require('https')

const AllBooks = require('../sql/allBooks/allBooks')

const path = __dirname
router.get('/', async (ctx, next) => {
  const data = fs.readFileSync( '../server/books/data/recommendArticle.json')
  ctx.body = data.toString()
})


router.get('/getAllBooks', async ctx => {
  const allBooks = [];
  for (let key in AllBooks) {
    const data = await AllBooks[key].find({}, null, {limit: 9});
    allBooks.push(data)
  }
  ctx.body = JSON.stringify(allBooks)
})

app.use(router.routes()).use(router.allowedMethods())


// const options = {
//   key: fs.readFileSync('../server/www.feisha.com.key'),
//   cert: fs.readFileSync('../server/www.feisha.com_ssl.crt')
// }
// https.createServer(options, app.callback()).listen(80)
app.listen(3000)
console.log('the serve is run 3000')