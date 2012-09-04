module.exports = function(config) {

  var fs = require('fs');

  if (config.get('ssl:ca')) {
    config.set('ssl_options', {
      key:  fs.readFileSync(config.get('ssl:key')).toString(),
      cert: fs.readFileSync(config.get('ssl:certificate')).toString(),
      ca: fs.readFileSync(config.get('ssl:ca')).toString()
    });
  } else {
    config.set('ssl_options', {
      key:  fs.readFileSync(config.get('ssl:key')).toString(),
      cert: fs.readFileSync(config.get('ssl:certificate')).toString()
    });
  }
}
