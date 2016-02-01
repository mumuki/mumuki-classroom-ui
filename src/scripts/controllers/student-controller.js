
angular
  .module('classroom')
  .controller('StudentController', function ($scope, $state, $stateParams, toastr, Auth, Api) {

    $scope.student = { first_name: '', last_name: '' };

    $scope.isTextValid = (text) => !_.isEmpty((text || '').trim());

    $scope.isValid = () => $scope.isTextValid($scope.student.first_name) && $scope.isTextValid($scope.student.last_name);

    $scope.update = () => {
      return Api
        .updateStudent($stateParams.course, $scope.student)
        .catch((res) => {})
        .then(() => $state.go('classroom.home'))
        .then(() => toastr.success('Gracias por actualizar tus datos'))
        .catch((res) => toastr.error(res.data.message));
    }


  });
