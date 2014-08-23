var start = function(client) {
  var pos = {
    top: ($(window).height() / 2) - 32
    , left: ($(window).width() / 2) - 64
  };
  client.css(pos);
};

var move = function(clientId, pos) {
  console.log('moving', arguments);
  var $client = $('#' + clientId);

  if($client.size() === 0) {
    $client = $('<div />', { 'class': 'client', id: clientId });
    $('body').append($client);
  }

  $client.css({ top: pos.y, left: pos.x });
};

var getMovement = function(key, pos) {
  return ({
    '37': function(pos) { pos.x -= 10; return pos; },
    '38': function(pos) { pos.y -= 10; return pos; },
    '39': function(pos) { pos.x += 10; return pos; },
    '40': function(pos) { pos.y += 10; return pos; }
  })[key](pos);
};

(function($) {
  $(function() {
    var $me = $('.me');
    start($me);

    $(document).on('keydown', function(e) {
      if(e.keyCode >= 37 && e.keyCode <= 40) {
        e.preventDefault();
        var pos = $('.me').offset();
        pos.clientId = client.id;
        pos.x = pos.left;
        pos.y = pos.top;
        pos = getMovement(e.keyCode, pos);
        move(client.id, pos);
        connection.emit('update', pos);
        return false;
      }
    });
  });
})(jQuery);

var connection = io.connect('http://localhost:8080');
connection.on('move', function(client) {
  if(client.data.clientId != client.id) {
    console.log('someone moved!', client);
    move(client.data.clientId, client.data);
  }
});
