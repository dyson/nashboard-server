var config = require('nconf');

env = (process.env.NODE_ENV || 'development');

config.argv(
  {
    'nashboard-config': {
      default: './config/nashboard/' + env + '.json'
    }
  })
  .env();

config.file({file: config.get('nashboard-config')});

module.exports = config
