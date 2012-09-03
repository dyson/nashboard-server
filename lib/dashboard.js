module.exports = function(app, config) {

  var https = require('https'),
    dashboard_server = https.createServer(config.get('ssl_options'), app),
    dashboard = require('socket.io').listen(dashboard_server), // Nashboard.js dashboard socket-io
    logger  = dashboard.log; // Use socket-io logger (It's pretty)

  dashboard_server.listen(app.get('port'),function(){
    logger.info("dashboard server listening on port " + app.get('port'));
  });

  dashboard.configure(function(){
    dashboard.set('authorization', function(handshakeData, callback) {
      if (config.get('whitelist:dashboards:' + handshakeData.query['dashboard']) == handshakeData.query['token']) {
        callback(null, true);
      } else {
        callback('authentication failed for ' + handshakeData.query['dashboard'], false);
      }
    });
  });

  // Log dashboard socket-io connections
  dashboard.sockets.on('connection',function(socket) {
    logger.info('display connection received');

    socket.on('disconnect',function() {
      logger.info('display disconnection received');
    });
  });

  return dashboard;

}
