
angular
  .module('classroom')
  .controller('HomeController', function ($scope, $state, Auth) {

    $scope.login = () => Auth.signin(() => $state.go('classroom.courses', {}, { reload: true }));

    $scope.login();

  });
