const apiUrl = 'http://api.douban.com/v2/movie/search'
const {request} = require('./index')

const getMovie = async (tag) => {
  const ret = await request({
    method: 'get',
    url: apiUrl,
    params: {
      q: tag
    }
  })
  return ret
}

const getNewData = async (tag) => {
  const data = await getMovie(tag)
  const movieData = data.subjects
  let ret = []
  movieData.forEach(item => {
    ret.push({
      Title: item.title,
      Description: '',
      PicUrl: item.images.small,
      Url: `http://wechat.kyriel.cn/movie/${item.id}`
    })
  })
  return ret
}

module.exports = {
  getNewData
}