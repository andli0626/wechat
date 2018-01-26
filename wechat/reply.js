const Wechat = require('./Wechat')
const wechat = new Wechat()
const menu = require('./menu')
module.exports = async (ctx,next) => {
  const message = ctx.wechat
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      // console.log('订阅关注')
      ctx.body = {
        MsgType: 'text',
        Content:`                Hello! 谢谢关注!\n回复:\n【电影# + 名字】 查看电影信息\n例: 电影#肖申克的救赎\n\n【音乐# + 名字】 安静得听一首歌\n例: 音乐#红玫瑰\n`
      }
    } else if (message.Event === 'CLICK' && message.EventKey) {
      // 点击菜单拉取消息时的事件推送
      if (message.EventKey === 'MUSIC') {
        ctx.body = {
          MsgType: 'text',
          Content: `回复:【音乐# + 名字】\n例: 音乐#红玫瑰`
        }
      } else if (message.EventKey === 'MOVIE') {
        ctx.body = {
          MsgType: 'text',
          Content: `回复:【电影# + 名字】\n例: 电影#肖申克的救赎`
        }
      } else if (message.EventKey === 'MINA') {
        ctx.body = {
          MsgType: 'text',
          Content: `小程序暂未开发...`
        }
      }
    } else if (message.Event === 'pic_photo_or_album' && message.EventKey) {
      const PicList = message.SendPicsInfo.PicList
      ctx.body = {
        MsgType: 'text',
        Content: `真漂亮`
      }
    } else if (message.Event === 'location_select' && message.EventKey) {
      const Location_X = message.SendLocationInfo.Location_X
      const Location_Y = message.SendLocationInfo.Location_Y
      const Scale = message.SendLocationInfo.Scale
      const Label = message.SendLocationInfo.Label
      ctx.body = {
        MsgType: 'text',
        Content: `维度: ${Location_X}\n经度: ${Location_Y}\n地图缩放大小: ${Scale}\n位置信息: ${Label}`
      }
    }
  } else if (message.MsgType === 'text') {
    const patt = new RegExp('^(电影|音乐)#(.*)')
    let result = message.Content.match(patt)
    if (result) {
      if (result[1] === '电影') {
        ctx.body = {
          MsgType: 'text',
          Content: `你要查询的电影是:\n${result[2]}\n目前功能在开发...`
        }
      } else {
        ctx.body = {
          MsgType: 'text',
          Content: `你要听的歌曲是:\n${result[2]}\n目前功能在开发...`
        }
      }
    } else if (message.Content === '#创#') {
      const data = await wechat.createMenu(menu)
      // console.log(data)
      const reply = data.errcode == 0 ? '创建菜单成功' : '创建菜单失败'
      ctx.body = {
        MsgType: 'text',
        Content: reply
      }
    } else {
      ctx.body = {
        MsgType: 'text',
        Content: message.Content
      }
    }
  }  else if (message.MsgType === 'voice') {
    const MediaId = message.MediaId
    ctx.body = {
      MsgType: 'voice',
      MediaId
    }
  } else if ((message.MsgType === 'video' )|| (message.MsgType === 'shortvideo')) {
    // console.log('小视频或视频')
    const MediaId = message.MediaId
    ctx.body = {
      MsgType: 'video',
      MediaId,
      Title: '小视频',
      Description: '已收到得小视频'
    } 
  } else if (message.MsgType === 'link') {
    const Title = message.Title
    const Url = message.Url
    ctx.body = {
      MsgType: 'text',
      Content: `<a href="${Url}">${Title}</a>`
    }
  }
}