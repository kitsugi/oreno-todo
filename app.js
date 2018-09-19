'use strict'

const SwaggerExpress = require('swagger-express-mw')
const app = require('express')()
const path = require('path')
const fs = require('fs-extra')
const bodyParser = require('body-parser')
const morganBody = require('morgan-body')

module.exports = app // for testing

// ログ設定
const directory = path.join(__dirname, 'tmp')
fs.existsSync(directory) || fs.mkdirSync(directory)
const accessLogStream = fs.createWriteStream(path.join(directory, 'access.log'), { flags: 'a' })
app.use(bodyParser.json())
morganBody(app, {
  noColors: true,
  prettify: true,
  stream: accessLogStream
})

const config = {
  appRoot: __dirname // required config
}

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err
  }

  // install middleware
  swaggerExpress.register(app)

  const port = process.env.PORT || 8080

  // swagger-ui使用
  app.use(swaggerExpress.runner.swaggerTools.swaggerUi())

  app.listen(port)
})
