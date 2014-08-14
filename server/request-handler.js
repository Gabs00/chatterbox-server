/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var RequestHandler = function(){
  this.header = defaultCorsHeaders;
  this.storage = {
    results: []
  };

  this.statusCodes = {
    'accept': 200,
    'bad-request': 400,
    'created':201,
    'not-found':404
  };
  var self = this;
  ///1/classes/messages
  this.type = {
    GET: {
      "/classes/messages": function(request, response){ 
          self.getMessages(request,response);
        },//func
      "/" : function(){
          self.defaultLocation(request, response);
      }
    },
    POST: {
      "/classes/messages": function(request, response){
        self.postMessages(request, response);
      }
    }

  };
  this.type.OPTIONS = this.type.GET;

  //to remove
  this.handler = this.handleRequest;
};

RequestHandler.prototype.writeHead = function(statusCode, response){
  response.writeHead(statusCode, this.header);

};
RequestHandler.prototype.postMessages = function(request, response){
  var self = this;
  //console.log("is request" + req);
  request.on("data", function(body){
    self.parseMessage(body, response);
  });
/* request.on("end", function(error, data){
    self.writeHead(self.statusCode['accept'], response);
  }); */
};

RequestHandler.prototype.parseMessage = function(message, response){
  var obj = {};
  try{
    obj = JSON.parse(message);
  } catch(e) {
    this.writeHead(this.statusCodes["bad-request"], response);
    response.end(e.message);
    return;
  }
  this.storage.results.push(obj);
  this.writeHead(this.statusCodes.created, response);
  response.end(JSON.stringify(this.storage));
};

RequestHandler.prototype.getMessages = function(request, response){

  var headers = {};
  headers['Content-Type'] = "text/html";
  response.writeHead(this.statusCodes.accept, headers);
  response.end(JSON.stringify(this.storage));
}; 
RequestHandler.prototype.setStorage = function(data){
  this.storage = data;
};
RequestHandler.prototype.defaultLocation = function(request, response){
  var headers = defaultCorsHeaders;
  headers.location = "http://localhost:3000/client/index.html";
  headers['Content-Type'] = "text/html";
  response.writeHead(this.statusCodes.accept, headers);
  response.end();

};
  
RequestHandler.prototype.handleRequest = function(request, response) {
 // console.log("Serving request type " + request.method + " for url " + request.url);

  var requestFunc = this.type[request.method][request.url]; //(request, response);
  if(requestFunc !== undefined){
    requestFunc(request, response);
  }else{
    response.writeHead(this.statusCodes["not-found"]);
    response.end("error");
  }
  // /* the 'request' argument comes from nodes http module. It includes info about the
  // request - such as what URL the browser is requesting. */

  // /* Documentation for both request and response can be found at
  //  * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  


  //  Without this line, this server wouldn't work. See the note
  //  * below about CORS. 
  // var headers = defaultCorsHeaders;

  // headers['Content-Type'] = "text/plain";

  // /* .writeHead() tells our server what HTTP status code to send back */
  // response.writeHead(statusCode, headers);

  // /* Make sure to always call response.end() - Node will not send
  //  * anything back to the client until you do. The string you pass to
  //  * response.end() will be the body of the response - i.e. what shows
  //  * up in the browser.*/
  // response.end("Hello, World!");
};

module.exports = new RequestHandler();
/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */


