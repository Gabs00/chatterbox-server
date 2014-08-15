angular.module('chatter.chat.area',[])

.controller('ChatAreaController', function($scope){
  $scope.data = {};
  $scope.data.messages = ['one', 'two', 'three', 'four'];
});