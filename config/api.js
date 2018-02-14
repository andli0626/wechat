const {appID, appSecret} = require('./base')
const prefix = 'https://api.weixin.qq.com/cgi-bin/'

module.exports = {
  accessToken: `${prefix}token?grant_type=client_credential&appid=${appID}&secret=${appSecret}`,
  createMenu: `${prefix}menu/create`,
  temporary: {
    upload: `${prefix}media/upload`,
    fetch: `${prefix}media/get`
  },
  permanent: {
    upload: `${prefix}material/add_material`,
    uploadNews: `${prefix}material/add_news`,
    uploadNewsPic: `${prefix}media/uploadimg`,
    fetch: `${prefix}material/get_material`,
    del: `${prefix}material/del_material`,
    updateNews: `${prefix}material/update_news`,
    count: `${prefix}material/get_materialcount`,
    batch: `${prefix}material/batchget_material`,
  }
}