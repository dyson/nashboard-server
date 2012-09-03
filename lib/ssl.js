module.exports = function(config) {

  var fs = require('fs');

  config.set('ssl_options', {
    key:  fs.readFileSync(config.get('ssl:key')).toString(),
    cert: fs.readFileSync(config.get('ssl:certificate')).toString()
  });

}
