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
      // 获取章节
      let allBookSection = []
      let newSection = {}
      superagent.get(book.bookUrl).charset().end(async (err, res) => {
        if (err) return
        const $ = cheerio.load(res.text)
        $('.story_list_m62topxs>.cp_list_m62topxs>ol>li>a').each((index, item) => {
          allBookSection.push({
            bookDetailUrl: `http://www.mytxt.cc${$(item).attr('href')}`,
            bookDetailTitle: $(item).text()
          })
        })
        newSection = allBookSection[allBookSection.length - 1]
        await allBooks.RecommendBooks.findOneAndUpdate({bookName: book.bookName}, {$set: {allBookSection, newSection}}, {upsert: true, new: true})
      })
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
              // 获取章节
              superagent.get(book.bookUrl).charset().end((err, res) => {
                if (err) {
                  return
                }
                const $ = cheerio.load(res.text)
                $('.lastrecord').each((index, newSectionItem) => {
                  $(newSectionItem.children).each((index, strongItem) => {
                    if (strongItem.name === 'strong') {
                      $(strongItem.children).each(async (index, aItem) => {
                        if (aItem.name === 'a') {
                          let newSection = {
                            bookDetailUrl: `http://www.mytxt.cc${$(aItem).attr('href')}`,
                            bookDetailTitle: $(aItem).text()
                          }
                          await allBooks[`${book.bookTypeTitleId}Books`].findOneAndUpdate({bookName: book.bookName}, {$set: {newSection}}, {upsert: true, new: true})
                          let allSectionUrl = newSection.bookDetailUrl.replace(/\/[0-9]*\.html/, '/')
                          let allBookSection = []
                          superagent.get(allSectionUrl).charset().end(async (err, res) => {
                            if (err) return
                            const $ = cheerio.load(res.text)
                            $('.story_list_m62topxs>.cp_list_m62topxs>ol>li>a').each((index, item) => {
                              allBookSection.push({
                                bookDetailUrl: `http://www.mytxt.cc${$(item).attr('href')}`,
                                bookDetailTitle: $(item).text()
                              })
                            })
                            await allBooks[`${book.bookTypeTitleId}Books`].findOneAndUpdate({bookName: book.bookName}, {$set: {allBookSection}}, {upsert: true, new: true})
                          })
                        }
                      })
                    }
                  })
                })
              })
            }
          })
          // console.log(item.children[3].children[1].children)
          $(item.children[3].children[1].children).each((index, item) => {
            if (item.name == 'span') {
              book.auth = $(item.children[1]).text()
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

// getbooks(bookHomeUrl)
// console.log(allBooks.RecommendBooks)


const getArticle = async url => {
  const res = await new Promise((resolve, reject) => {
    superagent.get(url).charset().end((err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
  const $ = cheerio.load(res.text)
  return $('#content>p').eq(0).text()
}


module.exports = {
  getArticle
}