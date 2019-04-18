import wepy from 'wepy'

const config = {
  dev: 'http://192.168.20.82:3000/',
  production: 'https://www.qppml.com.cn/'
}

export default {
  jointQuery (query = {}) {
    return Object.keys(query).reduce((url, key) => {
      url += `${key}=${query[key]}&`
      return url
    }, '?').replace(/&$/, '')
  },
  async getData(url, params = {}) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let result = await new Promise((resolve, reject) => {
      wepy.request({
        url: `${config.dev}${url}`,
        success: res => {
          resolve(res.data)
        }
      })
    })
    wx.hideLoading()
    return result
  }
}
