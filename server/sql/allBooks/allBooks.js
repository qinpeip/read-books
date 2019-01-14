const mongoose = require('mongoose');

const allBooksSchema = new mongoose.Schema({
  bookUrl: String,
  imgUrl: String,
  xing: String,
  auth: String,
  bookName: String,
  bookTypeTitle: String,
  bookTypeTitleId: String,
  info: String,
  newSection: {
    bookDetailUrl: String,
    bookDetailTitle: String
  },
  allBookSection: Array
})

const RecommendBooks = mongoose.model('recommend_books', allBooksSchema)
const SwordsmanBooks = mongoose.model('swordsman_books', allBooksSchema)
const MagicBooks = mongoose.model('magic_books', allBooksSchema)
const HistoryBooks = mongoose.model('history_books', allBooksSchema)
const DetectiveBooks = mongoose.model('detective_books', allBooksSchema)
const OnlineBooks = mongoose.model('online_books', allBooksSchema)
const ScienceBooks = mongoose.model('science_books', allBooksSchema)
const TerrorBooks = mongoose.model('terror_books', allBooksSchema)
const TraversingBooks = mongoose.model('traversing_books', allBooksSchema)
const LoveBooks = mongoose.model('love_books', allBooksSchema)

module.exports = {
  RecommendBooks,
  SwordsmanBooks,
  MagicBooks,
  HistoryBooks,
  DetectiveBooks,
  OnlineBooks,
  ScienceBooks,
  TerrorBooks,
  TraversingBooks,
  LoveBooks
};