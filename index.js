var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('underscore');
var jade = require('jade');

// host /public as a static file location
app.use(express.static(__dirname + '/public'));


var clients = {};

// view options go here
var options = {

};

server.listen(8080);


var createClient = function() {
  var id = _.uniqueId('c');
  clients[id] = { joined: (new Date()).getTime() };
  return {
    id: id
  };
};

app.get('/', function(req, res) {
  var template = jade.compileFile(__dirname + '/views/index.jade');
  var html = template(_.extend({}, options, createClient()));
  res.send(html);
});

io.sockets.on('connection', function(socket) {
  var client;
  socket.on('update', function(data) {
    console.log("update from", data);
    clients[data.clientId].data = data;
    client = clients[data.clientId];
    io.emit('move', clients[data.clientId]);
  });
  socket.on('disconnect', function(data) {
    if(client) {
      console.log('client disconnected!', client);
      io.emit('destroy', client.data.clientId);
    }
  });
});
