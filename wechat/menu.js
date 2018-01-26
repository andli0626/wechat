module.exports = {
  "button": [
    {
      "name": "测试一下",
      "sub_button": [
        {
          "name": "博客",
          "type": "view",
          "url": "http://www.kyriel.cn/",
          "key": "BLOG"
        },
        {
          "name": "扫一扫",
          "type": "scancode_push",
          "key": "SCAN"
        },
        {
          "name": "发张美照",
          "type": "pic_photo_or_album",
          "key": "PICTURE"
        },
        {
          "name": "你在哪",
          "type": "location_select",
          "key": "LOCATION"
        },
      ]
    },
    {
      "name": "小功能",
      "sub_button": [
        {
          "name": "听一首歌",
          "type": "click",
          "key": "MUSIC"
        },
        {
          "name": "查看一部电影",
          "type": "click",
          "key": "MOVIE"
        },
      ]
    },
    {
      "name": "小程序入口",
      "type": "click",
      "key": "MINA"
    }
  ]
}