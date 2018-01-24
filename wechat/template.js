const ejs = require('ejs')

const tpl = `
  <xml>
    <ToUserName><![CDATA[<%= ToUserName %>]]></ToUserName>
    <FromUserName><![CDATA[<%= FromUserName %>]]></FromUserName> 
    <CreateTime><%= CreateTime %></CreateTime> 
    <MsgType><![CDATA[<%= MsgType %>]]></MsgType>
    <% if (MsgType === 'text') { %>
      <Content><![CDATA[<%- Content %>]]></Content>
    <% } else if (MsgType === 'image') { %>
      <MediaId><![CDATA[<%= MediaId %>]]></MediaId>
    <% } else if (MsgType === 'voice') { %>
      <MediaId><![CDATA[<%= MediaId %>]]></MediaId>
    <% } else if (MsgType === 'voice') { %>
      <MediaId><![CDATA[<%= MediaId %>]]></MediaId>
      <Title><![CDATA[<%= Title %>]]></Title>
      <Description><![CDATA[<%= Description %>]]></Description>
    <% } else if (MsgType === 'music') { %>
      <Title><![CDATA[<%= Title %>]]></Title>
      <Description><![CDATA[<%= Description %>]]></Description>
      <MusicURL><![CDATA[<%= MusicURL %>]]></MusicURL>
      <HQMusicUrl><![CDATA[<%= HQMusicUrl %>]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[<%= ThumbMediaId %>]]></ThumbMediaId>
    <% } else if (MsgType === 'news') { %>
      <ArticleCount><![CDATA[<%= ArticleCount %>]]></ArticleCount>
      <Articles>
        <% Articles.forEach(function(item){ %>
          <item>
            <Title><![CDATA[<%= item.Title %>]]></Title>
            <Description><![CDATA[<%= item.Description %>]]></Description>
            <PicUrl><![CDATA[<%= item.PicUrl %>]]></PicUrl>
            <Url><![CDATA[<%= item.Url %>]]></Url>
          </item>
        <% }) %>
      </Articles>
    <% } %>
  </xml>
`

module.exports.compile = ejs.compile(tpl)