
angular
  .module('classroom')
  .controller('NewCourseController', function ($scope, $state, toastr, Auth, Api) {

    $scope.course = { name: '', description: '' };
    $scope.isAdmin = Auth.isAdmin;

    $scope.isValidName = () => /^[a-z0-9_-]+$/.test(($scope.course.name || '').toLowerCase());
    $scope.isValidDescription = () => !_.isEmpty(($scope.course.description || '').trim());

    $scope.isValid = () => $scope.isValidName() && $scope.isValidDescription();

    $scope.create = () => {
      return Api
        .createCourse($scope.create)
        .then(() => $state.go('classroom.courses'))
        .then(() => toastr.success('Curso creado satisfactoriamente'))
        .catch((res) => toastr.error(res.data.message));
    }


  });
