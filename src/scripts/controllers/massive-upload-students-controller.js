angular
  .module('classroom')
  .controller('MassiveUploadStudentsController', function ($scope, $state, $stateParams, Api, $q) {

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
    }

  });
