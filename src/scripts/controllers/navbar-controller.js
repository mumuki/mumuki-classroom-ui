
angular
  .module('classroom')
  .controller('NavbarController', function ($scope, Auth) {

    $scope.signin = Auth.signin;
    $scope.signout = Auth.signout;
    $scope.isLoggedIn = Auth.isLoggedIn;

  });
