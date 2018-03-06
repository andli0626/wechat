const axios = require('axios')
const {request} = require('./index')
const qiniu = require('qiniu')
const nanoid = require('nanoid')
const { AK, SK, bucket} = require('../config/base')
let _uid = 0
// const request = require('superagent')
/**
 * 通过搜索到的歌曲mid, 获取到vKey的值
 * @param {Number} mid 
 */
async function getKey(mid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const params = {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: mid,
    filename: `C400${mid}.m4a`,
    guid: getUid()
  }
  const ret = await request({
    method: 'get',
    url: url,
    params: params
  })
  // console.log(ret.data.items[0].vkey)
  return ret.data.items[0].vkey
}

/**
 * 调用qq音乐接口获取歌曲
 * @param {String} name 
 */
async function searchSong(name) {
  const url = `https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp`
  const params = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: name,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: 1,
    remoteplace: 'txt.mqq.all'
  }
  const ret = await request({
    method: 'get',
    url: url,
    params: params
  })
  // console.log(ret.data.song.list[0])
  return ret.data.song.list[0]
}

/**
 * 获取通过时间戳定义的uid
 * @return {Number}
 */
function getUid() {
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    const t = (new Date).getUTCMilliseconds()
    _uid = Math.round(2147483647 * Math.random()) * t % 1e10
  }
  return _uid
}


async function getSongData(name) {
  const song = await searchSong(name)
  // console.log(song)
  const vkey = await getKey(song.songmid)
  //console.log(vkey)
  const MusicUrl = `http://dl.stream.qqmusic.qq.com/C400${song.songmid}.m4a?vkey=${vkey}&guid=${getUid()}&uin=0&fromtag=66`
  const Title = song.songname
  const Description = song.singer[0].name
  return {
    MusicUrl,
    Title,
    Description
  }
}


function getQiniuUrl(url) {
  const mac = new qiniu.auth.digest.Mac(AK, SK) 
  const config = new qiniu.conf.Config()
  const bucketManager = new qiniu.rs.BucketManager(mac, config)
  const key = nanoid() + '.m4a'
  const QiniuUrl = uploadToQiniu(bucketManager, url, key)
  return `http://wechats.kyriel.cn/${key}`
}

const uploadToQiniu = async (bucketManager, url, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(url, bucket, key, function (err, respBody, respInfo) {
      if (err) {
        reject(err)
      } else {
        if (respInfo.statusCode == 200) {
          resolve(respBody.key)
        } else {
          reject(respInfo)
        }
      }
    })
  })
}


module.exports = {
  getSongData,
  getQiniuUrl
}