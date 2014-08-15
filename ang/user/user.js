angular.module('chatter.user', [])

.controller('AuthController', function($scope, Auth){
  $scope.loginCheck = function(){
    Auth.isLoggedIn();
  };

  $scope.loginCheck();
  $scope.data = {};
  $scope.setUsername = function(){
    Auth.setUsername($scope.data.user);
  };
});
