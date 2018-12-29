const superagent = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const request = require('request')
const fs = require('fs')
const bookHomeUrl = 'http://www.mytxt.cc/';
const allBooks = require('../sql/allBooks/allBooks')
charset(superagent)

const getbooks = async path => {
  superagent.get(path).charset().end((err, res) => {
    if (err) {
      console.log(err)
      return
    }
    let $ = cheerio.load(res.text);
    // 获取热门书籍
    const recommendArticle = $('.vote_book_m62topxs>.book');
    $(recommendArticle).each(async(index, item) => {
      const book = {
        bookUrl: $(item.children[0].next.children[0]).attr('href'),
        imgUrl: $(item.children[0].children[0]).attr('src'),
        xing: $(item.children[0].children[1]).text(),
        auth: $(item.children[0].children[2]).text(),
        bookName: $(item.children[0].next.children[0]).text(),
        bookTypeTitle: '热门书籍',
        bookTypeTitleId: 'Recommend'
      };
      let findData = await allBooks.RecommendBooks.findOneAndUpdate({bookName: book.bookName}, {$set: book}, {upsert: true, new: true})
      if (findData) {
        // console.log('数据保存成功', findData)
      }
    })
    const otherBookObj = {
      '武侠修真': 'Swordsman',
      '玄幻魔法': 'Magic',
      '历史军事': 'History',
      '侦探推理': 'Detective',
      '网游动漫': 'Online',
      '科幻小说': 'Science',
      '恐怖灵异': 'Terror',
      '穿越小说': 'Traversing',
      '都市言情': 'Love'
    }
    // 获取分类书籍
    $('.ph-box_m62topxs>.ph_list>.content').each((index, parentItem) => {
      superagent.get(bookHomeUrl + $(parentItem.children[1].children[0]).attr('href')).charset().end((err, res) => {
        if (err) {
          console.log(err)
          return
        }
        let $ = cheerio.load(res.text)
        $('#alist_m62topxs > #alistbox_m62topxs').each(async (index, item) => {
          const book = {};
          book.bookTypeTitleId = otherBookObj[$(parentItem.children[1].children[0]).text()]
          book.bookTypeTitle = $(parentItem.children[1].children[0]).text()
          $(item.children[1].children).each((index, aItem) => {
            if (aItem.name == 'a') {
              book.bookUrl = $(aItem).attr('href')
              book.imgUrl = $(aItem.children[0]).attr('src')
              book.bookName = $(aItem.children[0]).attr('title')
              // 文章地址 : $(aItem).attr('href')
              // 图片地址$(aItem.children[0]).attr('src')
            }
          })
          // console.log(item.children[3].children[1].children)
          $(item.children[3].children[1].children).each((index, item) => {
            if (item.name == 'span') {
              book.auth = $(item.children[1]).text()
              // 文章作者 $(item.children[1]).text()
            }
          })
          book.info = $(item.children[3].children[3]).text()
          let findData = await allBooks[`${book.bookTypeTitleId}Books`].findOneAndUpdate({bookName: book.bookName}, {$set: book}, {upsert: true, new: true})
          if (findData) {
            // console.log('数据保存成功', findData)
          }
        })
      })
    })
  })
}

getbooks(bookHomeUrl)
// console.log(allBooks.RecommendBooks)