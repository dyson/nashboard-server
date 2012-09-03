module.exports = function(app, config, dashboard) {

  var https = require('https'),
      client_server = https.createServer(config.get('ssl_options')),
      clients = require('socket.io').listen(client_server), // Nashboard.js clients socket-io
      logger  = clients.log; // Use socket-io logger (It's pretty)

  client_server.listen(app.get('port') + 1,function(){
    logger.info("client server listening on port " + app.get('port') + 1);
  });

  clients.configure(function(){
    clients.set('authorization', function(handshakeData, callback) {
      if (config.get('whitelist:clients:' + handshakeData.query['client']) == handshakeData.query['token']) {
        callback(null, true);
      } else {
        callback('authentication failed for ' + handshakeData.query['client'], false);
      }
    });
  });

  // Client machines to check
  clients.sockets.on('connection',function(socket) {
    logger.info('client connection received');

    // Listen for results coming in from remote machines and broadcast to all dashboard connections
    socket.on('result',function(data) {
      if (data['success']) {
        logger.debug('client success: ' + data['check'] + ': ' + JSON.stringify(data['success']));
      } else if (data['error']) {
        logger.warn('client error: ' + data['check'] + ': ' + JSON.stringify(data['error']));
      }
      dashboard.sockets.emit('result', data);
    });

    socket.on('disconnect',function() {
      logger.info('client disconnection received');
    });
  });

}
