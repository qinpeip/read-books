const Koa = require('koa2');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const fs = require('fs');
const https = require('https')
const { getArticle } = require('../books/index')

const AllBooks = require('../sql/allBooks/allBooks')

const path = __dirname

router.get('/getAllBooks', async ctx => {
  const allBooks = [];
  for (let key in AllBooks) {
    const data = await AllBooks[key].find({}, null, {limit: 9}).select({allBookSection: 0});
    allBooks.push(data)
  }
  ctx.body = JSON.stringify(allBooks)
})

router.get('/getBookDetail', async ctx => {
  const { bookId, bookTypeTitleId } = ctx.query
  const data = await AllBooks[`${bookTypeTitleId}Books`].findOne({_id: bookId})
  ctx.body = {
    auth: data.auth,
    bookName: data.bookName,
    bookTypeTitle: data.bookTypeTitle,
    bookTypeTitleId: data.bookTypeTitleId,
    bookUrl: data.bookUrl,
    imgUrl: data.imgUrl,
    total: data.allBookSection.length,
    newSection: data.newSection,
    _id: data._id
  }
})

router.get('/getArticle', async ctx => {
  let { articleIndex, bookTypeTitleId, bookId } = ctx.query
  const data = await AllBooks[`${bookTypeTitleId}Books`].findOne({_id: bookId}).select({allBookSection: 1})
  let text = await getArticle(data.allBookSection[articleIndex].bookDetailUrl)
  text = text.replace(/\n+/g, '<br/>')
  const bookDetailTitle = data.allBookSection[articleIndex].bookDetailTitle
  ctx.body = {text, total: data.allBookSection.length, articleIndex, bookTypeTitleId, bookId, bookDetailTitle}
})

router.get('/getCatalogueList', async ctx => {
  const { bookTypeTitleId, bookId } = ctx.query
  var data = await AllBooks[`${bookTypeTitleId}Books`].findOne({_id: bookId})
  data.total = data.allBookSection.length
  ctx.body = data
})

router.get('/getSearchData', async ctx => {
  const { keyWord } = ctx.query
  let regx = new RegExp(keyWord, 'i')
  console.log(regx)
  let allBooks = [];
  for (let key in AllBooks) {
    const data = await AllBooks[key].find({$or: [{auth: {$regex: regx}}, {bookName: {$regex: regx}}]}, null).select({allBookSection: 0});
    allBooks.push(...data)
  }
  ctx.body = JSON.stringify(allBooks)
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
console.log('the serve is run 3000')
