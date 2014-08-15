var Parse = function(){
  this.base = "http://localhost:3000/classes";
  this.parseClass = "messages";
  this.currentUrl = this.base;
  this.intIds = {};
  
};

Parse.prototype = {};

Parse.prototype.setClass = function(parseClass){
  this.parseClass = parseClass || "/messages";
};

Parse.prototype.setcurrentUrl = function(parseClass){
  this.setClass(parseClass);
  this.currentUrl = this.base+this.parseClass;
  return this.currentUrl;
};

Parse.prototype.getCurrentUrl = function(){
  return this.currentUrl;
};

//GET REQUEST
Parse.prototype.getMessages = function(callback, filter, parseClass){
  if(typeof callback !== 'function'){
    throw "First arg should be a callback";
  }
  var url = this.setcurrentUrl(parseClass);
  var json = this.Filter(filter);
  $.ajax({
    url: url,
    type: 'GET',
    data: json,
    success: function(resp){
      var data = JSON.parse(resp);
      if(data.results){
        callback(_.map(data.results, function(v){
          return v;
        }));
      }
    },
    error: function(data){
      console.log('Failed to get chatterbox data');
    }

  });
};
Parse.prototype.createdAtFilter = function(){
  if(this.lastTime === undefined){
    this.lastTime = new Date(Date.now());
    var mins = this.lastTime.getMinutes();
    this.lastTime.setMinutes(mins - 30);
  }
  var currentTime = new Date(Date.now());
  var filterObject = {
      createdAt: {
          $gte: {
              "__type":"Date",
              "iso": this.lastTime.toISOString()
            },
          $lte: {
              "__type":"Date",
              "iso": currentTime.toISOString()
          }
      }
    };
    this.lastTime = currentTime;
  return filterObject;
};
Parse.prototype.asyncLoop = function(func, callback, time, argsArray){
  var self = this;
  if(argsArray === undefined){
    argsArray = [];
  }
  argsArray.unshift(callback);
  this.intIds[JSON.stringify(func.toString())] = setInterval(function(){
    func.apply(self, argsArray);
  }, time);
};
Parse.prototype.clearAsyncLoop = function(func){
  clearInterval(this.intIds[JSON.stringify(func.toString())]);
};
Parse.prototype.Filter = function(whereClause){
  return "where="+JSON.stringify(whereClause);
};

Parse.prototype.sendMessage = function(message, callback, parseClass){ 
  if(message.text === undefined){
    throw "Message does not contain anything";
  }
  else if(message.username === undefined){
    throw "Username not defined";
  }
  else if(typeof callback !== 'function'){
    throw "Callback should be a function";
  }
  var url = this.setcurrentUrl(parseClass);
  $.ajax({
    url: url,
    type:'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){
      console.log('message sent');
    },
    error: function(data){
      console.log("Failed to send message");
    }
  });
};