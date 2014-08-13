// YOUR CODE HERE:
window.app = {};
window.app.parse = new Parse();
window.app.MessageList = new MessageList();
window.app.RoomHistory = new MessageList();
window.room = 'lobby';
window.app.username = prompt('Please enter a username');
var lastRoom = room;
window.app.friends = {};
$(document).ready(function(){
  p = window.app.parse;
  mlist = window.app.MessageList;
  rlist = window.app.RoomHistory;
  friends = Friends();
  
  init();
  setInterval(function(){
    display();
  },3000);
  p.asyncLoop(p.getMessages, messageAdder, 5000, [p.createdAtFilter()]);

  
  $('.chat').on('click', '.username', function(){
    friends.addFriend($(this).html());
  });

  $('.rooms').on('click', 'li', function(e){
    room = $(this).html();
    if(rlist._messages[room] === undefined){
      rlist._messages[room] = [];
    }
    console.log($(this));
    display();
  });

  $('form').on('submit', function(event){
    event.preventDefault();
    var text = $('.mess').val();
    $('.mess').val('');
    console.log(text);
    send(text);
  });

});

var display = function(){
     var result = mlist.removeMultiple(room);
    if(lastRoom !== room){
      var pastMessages = rlist.getAllMessages(room);
      $('.chat').empty();
      _.each(pastMessages, function(v){
        $('.chat').append('<li>' + v.username + ': ' + v.text + '</li>');
      });
    }
    if(result && result.length > 0){
      _.each(result, function(v){
        rlist.addMessage(v);
        if(rlist._messages[room].length > 15){
          rlist.removeMessageFromTop(room);
        }
        $('.chat').append('<li><span class="username">' + v.username + '</span>: ' + v.text + '</li>');
      });
      
    }
    lastRoom = room;
  };
function messageAdder(array){
  mlist.multipleAdd(array);
  getRooms(friends);
}
function getRooms(friends){
  var rooms = Object.keys(mlist._messages);
  rooms.concat(friends.list);
  $('.rooms').empty();
  _.each(rooms, function(v){
    $('.rooms').append('<li>'+v+'</li>');
  });
}
var send = function(text){
  var mess = new Message(app.username,text, room);
  p.sendMessage(mess.prepare(), console.log);
  p.getMessages(messageAdder);
};
var init = function(){
  p.getMessages(messageAdder, p.createdAtFilter());
  display();
};

var Friends = function($displayArea){
  var friends = {};
  var un;
  function addMessages(array){
    _.each(array,function(v){
      friends[un].push(v);
    });
    display(un);
  }
  var addFriend = function(username){
    un =username;
    friends[username] = [];
    var friendQuery = {
      username: un,
    };
    console.log(JSON.stringify(friendQuery));
    p.getMessages(addMessages, friendQuery);
  };
  var display = function(username){
    $($displayArea).empty();
    _.each(friends[username], function(v){
      $('.chat').append('<li><span class="username">' + v.username + '</span>: ' + v.text + '</li>');
    });
  };
  return {
    addFriend: addFriend,
    display: display,
    list: function(){return Object.keys(friends);}
  };
};

/*
look at ajax data attribute
*/