import wepy from 'wepy'

const config = {
  dev: 'http://192.168.20.82:3000/',
  production: ''
}

export default {
  async getData (url, params = {}) {
    let result = await new Promise((resolve, reject) => {
      wepy.request({
        url: `${config.dev}${url}`,
        success: res => {
          resolve(res.data)
        }
      })
    })
    return result
  }
}
