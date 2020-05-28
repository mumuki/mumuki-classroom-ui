angular
  .module('classroom')
  .controller('MassiveUploadStudentsController', function ($scope, $state, $stateParams, Api) {

    $scope.upload = (result) => Api.addStudentsToMultipleCourses(result);

    $scope.cancel = () => $state.go('classroom.courses', $stateParams);

  });
