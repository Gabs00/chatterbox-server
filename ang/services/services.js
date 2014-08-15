angular.module('chatter.services', [])

.factory('Auth', function($location, $rootScope){
  var setUsername = function(username){
    $rootScope.userInfo.name = _.escape(username);
    console.log($rootScope.userInfo.name, 'a');
    $location.path('chat');
  };

  var isLoggedIn = function(){
    if($rootScope.userInfo.name.length > 0){
      $location.path('chat');
    }
  };
  return {
    setUsername: setUsername,
    isLoggedIn: isLoggedIn
  };
});