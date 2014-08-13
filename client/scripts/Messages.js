var Message = function(username, text, roomname){
  this.roomname = roomname;
  this.text = text;
  this.username= username;
};

Message.prototype = {};
Message.prototype.Parse = function(message){
  _.each(message, function(v,i,c){
    c[i]=_.escape(v);
  });
  var mess = new Message(message.username, message.text, message.roomname);
  mess = _.defaults(mess, message);
  return mess;

};

Message.prototype.getText = function(){
  return this.text;
};

Message.prototype.getUsername = function(){
  return this.username;
};

Message.prototype.getRoomname = function(){
  return this.roomname;
};

Message.prototype.prepare = function(){
  return this.Parse(this);
};

var MessageList  = function(){
  this.message = new Message();
  this._messages = {};
  this.length = 0;
};

MessageList.prototype.addMessage = function(message){
  var mess = this.message.Parse(message);
  
  if(this._messages[mess.roomname] === undefined){
    this._messages[mess.roomname] = [];
  }
  this._messages[mess.roomname].push(mess);
  this.length++;
};
MessageList.prototype.removeMessage = function(roomName){
  if(Array.isArray(this._messages[roomName])){
    this.length--;
    return this._messages[roomName].shift();    
  }
};
MessageList.prototype.removeMessageFromTop = function(roomName){
  if(Array.isArray(this._messages[roomName])){
    this.length--;
    return this._messages[roomName].pop();    
  }
};
MessageList.prototype.multipleAdd = function(messageArray){
  _.each(messageArray, function(v){
    this.addMessage(v);
  }, this);
};
MessageList.prototype.getAllMessages = function(roomName){
  if(this._messages[roomName]){
    return this._messages[roomName].slice();
  }
};
MessageList.prototype.removeMultiple = function(roomName, amount){
  if(amount === undefined){
    if(this._messages[roomName] === undefined){
      return;
    }
    else{
      amount = this._messages[roomName].length;
    }
  }
  var i = 0;
  var messages = [];
  while(i < amount){
    var mess = this.removeMessage(roomName);
    if(mess !== undefined){
      messages.push(mess);
    }
    else{
      i = amount+1;
    }
    i++;
  }
  return messages;
};

var MessageDisplayer = function(messageList, $domElement, cache){
  this._messageList = messageList;
  this.$_domElement = $domElement;
  this._cache = cache;

};

MessageDisplayer.prototype = {};
MessageDisplayer.prototype.updateDisplay = function(room, lastRoom){
    var result = this._messageList.removeMultiple(room);
    if(lastRoom !== room){
      var pastMessages = this._cache.getAllMessages(room);
      $('.chat').empty();
      _.each(pastMessages, function(v){
        $('.chat').append('<li>' + v.username + ': ' + v.text + '</li>');
      });
    }
    
    if(result && result.length > 0){
      _.each(result, function(v){
        this._cache.addMessage(v);
        if(this._cache._messages[room].length > 15){
          this._cache.removeMessageFromTop(room);
        }
        $('.chat').append('<li>' + v.username + ': ' + v.text + '</li>');
      });
      
    }
    return room;
};