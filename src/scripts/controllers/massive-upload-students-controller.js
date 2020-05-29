angular
  .module('classroom')
  .controller('MassiveUploadStudentsController', function ($scope, $state, $stateParams, $toastr, Api) {

    $scope.upload = (result) => {
      const requestsPromises = _.chain(result)
        .groupBy('course')
        .map(toMultipleRequests)
        .value();
      return Api.multipleRequests(requestsPromises);
    }

    $scope.cancel = () => $state.go('classroom.courses', $stateParams);

    function toMultipleRequests(students, course) {
      return Api.addStudentsToCourse(course, students.map(st => _.omit(st, 'course')))
                .catch($toastr.error(`Course ${course} does not exists`))
    }

  });
