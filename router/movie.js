const {request} = require('../util/index')

const apiUrl = `http://api.douban.com/v2/movie/subject/`
module.exports = function () {
  return async function movie(ctx, next) {
    const id = ctx.params.id
    const data = await request({
      method: 'get',
      url: apiUrl + id
    })
    const params = normalize(data)
    await ctx.render('movie', params)
  }
}

function normalize(data) {
  let casts_name = []
  let casts_info = []
  data.casts.forEach(item => {
    casts_name.push(item.name)
    casts_info.push({
      name: item.name,
      avatar: item.avatars.large
    })
  })
  const ret = {
    title: data.title,
    image: data.images.large,
    country: data.countries[0],
    year: data.year,
    comments_count: data.comments_count,
    wish_count: data.wish_count,
    original_title: data.original_title,
    rating: data.rating.average,
    director: data.directors[0].name,
    casts_name: casts_name.join('/'),
    genres: data.genres.join(' · '),
    summary: data.summary.replace('©豆瓣', ''),
    casts_info: casts_info
  }
  return ret
}