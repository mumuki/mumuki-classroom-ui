
angular
  .module('classroom')
  .controller('NavbarController', function ($scope, $state, Auth) {

    $scope.$state = $state;
    $scope.signin = Auth.signin;
    $scope.signout = Auth.signout;
    $scope.profile = Auth.profile;
    $scope.isLoggedIn = Auth.isLoggedIn;

  });
