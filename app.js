'use strict';

const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
module.exports = app; // for testing

const config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) {
     throw err; 
  }

  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 8080;

  // swagger-ui使用
  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

  app.listen(port);
});
