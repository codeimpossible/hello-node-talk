
var move = function(clientId, client) {
  var $client = $('#' + clientId);
  var pos = client.data;

  if($client.size() === 0) {
    $client = $('<div />', { 'class': 'client', id: clientId, 'data-joined': client.joined });
    $('body').append($client);
  }

  $client.css({ top: pos.top, left: pos.left });
};

var getMovement = function(key, pos) {
  return ({
    '37': function(pos) { pos.left -= 10; return pos; },
    '38': function(pos) { pos.top -= 10; return pos; },
    '39': function(pos) { pos.left += 10; return pos; },
    '40': function(pos) { pos.top += 10; return pos; }
  })[key](pos);
};

var onKeyDown = function(e) {
  if(e.keyCode >= 37 && e.keyCode <= 40) {
    e.preventDefault();

    var pos = $('.me').offset();
    pos.clientId = client.id;

    // move locally
    pos = getMovement(e.keyCode, pos);
    move(client.id, { data: pos });

    // send the move to other clients
    connection.emit('update', pos);

    return false;
  }
};

var blur = function() {
  $('.client:not(.me)').each(function() {
    var $client = $(this);
    var joined = $client.data().joined;
    var time = (new Date()).getTime();

    if(time - 180000 >= joined) $client.addClass('distance3');
    else if(time - 120000 >= joined) $client.addClass('distance2');
    else if(time - 60000 >= joined)  $client.addClass('distance1');
  });
};

(function($) {
  $(function() {
    var $me = $('.me');
    var pos = {
      top: ($(window).height() / 2) - 32
      , left: ($(window).width() / 2) - 64
    };
    $me.css(pos);

    pos.clientId = $me.attr('id');

    connection.emit('update', pos);

    setInterval(blur, 30000);

    $(document).on('keydown', onKeyDown);
  });
})(jQuery);

var connection = io.connect('http://localhost:8080');
connection.on('move', function(client) {
  if(client.data.clientId != client.id) {
    move(client.data.clientId, client);
  }
});
connection.on('destroy', function(clientId) {
  $('#' + clientId).addClass('destroy');
});
