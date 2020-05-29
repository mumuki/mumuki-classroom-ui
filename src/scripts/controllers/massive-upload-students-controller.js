angular
  .module('classroom')
  .controller('MassiveUploadStudentsController', function ($scope, $state, $stateParams, toastr, Api) {

    $scope.input = {
      isTeachersUpload: false
    }

    $scope.upload = (result) => {
      const requestsPromises = _.chain(result)
        .groupBy('course')
        .map(toMultipleRequests)
        .value();
      return Api.multipleRequests(requestsPromises);
    }

    $scope.cancel = () => $state.go('classroom.courses', $stateParams);

    function toMultipleRequests(members, course) {
      const membersToPost = members.map(st => _.omit(st, 'course'));
      const request = $scope.input.isTeachersUpload
                        ? Api.addTeachersToCourse(course, membersToPost)
                        : Api.addStudentsToCourse(course, membersToPost)

      return request.catch((err) => toastr.error(err));
    }

  });
