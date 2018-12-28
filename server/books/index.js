const superagent = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const request = require('request')
const fs = require('fs')
const bookHomeUrl = 'http://www.mytxt.cc/';
charset(superagent)

const getbooks = path => {
  superagent.get(path).charset().end((err, res) => {
    if (err) {
      console.log(err)
      return
    }
    const $ = cheerio.load(res.text);
    const articles = [];
    const recommendArticle = $('.vote_book_m62topxs>.book');
    $(recommendArticle).each((index, item) => {
      const article = {
        articleUrl: $(item.children[0].next.children[0]).attr('href'),
        imgUrl: $(item.children[0].children[0]).attr('src'),
        xing: $(item.children[0].children[1]).text(),
        auth: $(item.children[0].children[2]).text(),
        articleName: $(item.children[0].next.children[0]).text()
      };
      articles.push(article)
    })
    fs.writeFileSync(__dirname + '/data/recommendArticle.json', JSON.stringify(articles))
  })
}

// getbooks(bookHomeUrl)