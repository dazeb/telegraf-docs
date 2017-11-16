const Telegraf = require('telegraf')
const fs = require('fs')

const bot = new Telegraf(process.env.BOT_TOKEN)

const downloadPhotoMiddleware = (ctx, next) => {
  return bot.telegram.getFileLink(ctx.message.photo[0])
    .then((link) => {
      ctx.state.fileLink = link
      return next()
    })
}

bot.command('album', (ctx) => {
  ctx.replyWithMediaGroup([
    {
      'media': 'http://lorempixel.com/400/200/cats/',
      'type': 'photo'
    },
    {
      'media': 'http://lorempixel.com/400/200/sports/',
      'type': 'photo'
    },
    {
      'media': 'http://lorempixel.com/400/200/nature/',
      'type': 'photo'
    }
  ])
})

bot.on('photo', downloadPhotoMiddleware, (ctx, next) => {
  console.log('Photo url:', ctx.state.fileLink)
  return ctx.replyWithPhoto({ source: '/directory/file.jpeg' })
})

bot.command('foo', (ctx) => {
  return Promise.all([
    // file
    ctx.replyWithPhoto({
      source: '/example/cat.jpeg'
    }),

    // Stream
    ctx.replyWithPhoto({
      source: fs.createReadStream('/example/cat2.jpeg')
    }),

    // Buffer
    ctx.replyWithPhoto({
      source: fs.readFileSync('/example/cat3.jpeg')
    }),

    // url
    ctx.replyWithPhoto({
      url: 'http://lorempixel.com/400/200/cats/'
    }),

    // url via Telegram servers
    ctx.replyWithPhoto('http://lorempixel.com/400/200/cats/'),

    // with caption
    ctx.replyWithPhoto('http://lorempixel.com/400/200/cats/', {caption: 'cute kitty'})
  ])
})

bot.startPolling()
