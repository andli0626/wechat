const Wechat = require('./Wechat')
const wechat = new Wechat()
const path = require('path')
const menu = require('./menu')
const {getNewData} = require('../util/movie')
const {getSongUrl} = require('../util/song')
let SendPicsCount = 0 //菜单发照片的数量
module.exports = async (ctx, next) => {
  const message = ctx.wechat
  if (message.MsgType === 'event') {
    // 事件
    switch (message.Event) {
      case 'subscribe':
        ctx.body = {
          MsgType: 'text',
          Content: `                Hello! 谢谢关注!\n回复:\n【电影# + 名字】 查看电影信息\n例: 电影#肖申克的救赎\n\n【音乐# + 名字】 安静得听一首歌\n例: 音乐#红玫瑰\n`
        }
        break
      case 'CLICK':
        if (!message.EventKey) return
        switch (message.EventKey) {
          case 'MUSIC': 
            ctx.body = {
              MsgType: 'text',
              Content: `回复:【音乐# + 名字】\n例: 音乐#红玫瑰`
            }
            break
          case 'MOVIE': 
            ctx.body = {
              MsgType: 'text',
              Content: `回复:【电影# + 名字】\n例: 电影#肖申克的救赎`
            }
            break
          case 'MINA': 
            ctx.body = {
              MsgType: 'text',
              Content: `小程序暂未开发...`
            }
            break
          
        }
        break
      case 'pic_photo_or_album':
        SendPicsCount = message.SendPicsInfo.Count
        break;
    }
  }
  else if (message.MsgType === 'text') {
    const patt = new RegExp('^(电影|音乐)#(.*)')
    let result = message.Content.match(patt)
    switch (message.Content) {
      case '电影':
        ctx.body = {
          MsgType: 'text',
          Content: `回复:【电影# + 名字】\n例: 电影#肖申克的救赎`
        }
        break
      case '音乐':
        ctx.body = {
          MsgType: 'text',
          Content: `回复:【音乐# + 名字】\n例: 音乐#红玫瑰`
        }
        break
      default:
        if (!result) return
        if (result[1] === '电影') {
          const arr = await getNewData(result[2])
          ctx.body = {
            MsgType: 'news',
            ArticleCount: 1,
            Articles: arr
          }
        } else {
          const data = await wechat.upload('image',path.resolve(__dirname, '../lihaozecq.jpg'))
          // console.log(data)
          const ThumbMediaId = data.media_id
          const MusicURL = await getSongUrl(result[2])
          console.log(MusicURL)
          ctx.body = {
            MsgType: 'music',
            Title: result[2],
            Description: '测试',
            ThumbMediaId: ThumbMediaId,
            HQMusicUrl: MusicURL,
            MusicURL: MusicURL
          }
        }
        break
    }
  }
  else if (message.MsgType === 'image') {
    if (SendPicsCount > 0) {
      SendPicsCount--
      if (SendPicsCount === 0) {
        ctx.body = {
          MsgType: 'text',
          Content: `你真美！`
        }
      }
    } else {
      const MediaId = message.MediaId
      ctx.body = {
        MsgType: 'image',
        MediaId
      }
    }
  }
  else if (message.MsgType === 'voice') {
    const MediaId = message.MediaId
    ctx.body = {
      MsgType: 'voice',
      MediaId
    }
  }
  else if (message.MsgType === 'video' || message.MsgType === 'shortvideo') {
    const MediaId = message.MediaId
    const ThumbMediaId = message.ThumbMediaId
    ctx.body = {
      MsgType: 'text',
      Content: '视频已收到'
    }
  }
  else if (message.MsgType === 'location') {
    const Location_X = message.Location_X
    const Location_Y = message.Location_Y
    const Scale = message.Scale
    const Label = message.Label
    ctx.body = {
      MsgType: 'text',
      Content: `维度: ${Location_X}\n经度: ${Location_Y}\n地图缩放大小: ${Scale}\n位置信息: ${Label}`
    }
  }
  else if (message.MsgType === 'link') {
    const Title = message.Title
    const Url = message.Url
    ctx.body = {
      MsgType: 'text',
      Content: `<a href="${Url}">${Title}</a>`
    }
  }
}