angular.module('chatter', [
  'chatter.user',
  'chatter.services',
  'chatter.chat',
  'chatter.chat.area',
  'chatter.chat.submit',
  'ui.router'
  ])
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
  //defaults to usr
  $urlRouterProvider.otherwise('/signin');
  //states
  $stateProvider
    .state('usr', {
      templateUrl: 'ang/user/username.html',
      controller: 'AuthController',
      url: '/signin'
    })/*
    .state('chat', {
      templateUrl: 'ang/chat/chat.html',
      controller: 'ChatController',
      url: '/chat'
    })
    .state('chat.area', {
      url:'/area',
      templateUrl: 'ang/chat_area/chat_area.html',
      controller: 'ChatAreaController'        
    })
    .state('chat.submit', {
      url:'/submit',
      templateUrl: 'ang/submit/chat.submit.html',
      controller: 'SubmitController'
    })*/
    .state('chat', {
      url: '/chat',
      views: {
        '': {
          templateUrl: 'ang/chat/chat.html',
          controller: 'ChatController',
        },

        'submit@chat': {
          url:'/submit',
          templateUrl: 'ang/chat/submit/chat.submit.html',
          controller: 'SubmitController'  
        },
        'area@chat':{
          url:'/area',
          templateUrl: 'ang/chat/area/chat.area.html',
          controller: 'ChatAreaController'  
        }     
      }
    });

    $httpProvider.interceptors.push('CORS');

})
.factory('CORS', function(){
  var attach = {
    request: function(object){
      //object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
     }
  };
  return attach;
})
.run(function($rootScope, Auth){
  $rootScope.userInfo = {
    name: ''
  };
});