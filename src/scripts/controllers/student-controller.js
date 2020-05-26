angular
  .module('classroom')
  .controller('StudentController', function ($scope, $controller, $state, $filter, $stateParams, $sce, toastr, Api, Organization, Breadcrumb) {
    $scope.inputType = {
      isMultiple: false
    };

    $controller('CsvController', { $scope: $scope });

    $scope.setAsPristine();

    const $translate = $filter('translate');
    const EMAIL_REGEX = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i

    Breadcrumb.setCourse($stateParams.course);

    $scope.student = {};
    $scope.titleKey = 'new_student';

    $scope.isTextValid = (text) => {
      return !_.isEmpty((text || '').trim())
    };

    $scope.isEmailValid = (text) => {
      return $scope.isTextValid(text) && EMAIL_REGEX.test(text);
    };

    $scope.toggleMultiple = () => $scope.inputType.isMultiple = !$scope.inputType.isMultiple;

    $scope.isValid = () =>
      $scope.isTextValid($scope.student.first_name) &&
      $scope.isTextValid($scope.student.last_name) &&
      $scope.isEmailValid($scope.student.email);

    $scope.submitStudent = () => {
      return Api
        .addStudent($stateParams.course, $scope.student)
        .then(() => $state.go('classroom.courses.course.guides', $stateParams))
        .catch((res) => toastr.error(res.data.message));
    };

    $scope.cancelSubmission = () => {
      $state.go('classroom.courses.course.students', $stateParams)
    }

    $scope.addStudents = () => {
      return Api.addStudentsToCourse($stateParams.course, $scope.csv.result)
        .then((result) => $scope.response.result = result)
        .then(() => $scope.response.finish = true)
        .catch((res) => toastr.error(res.data.message));
    };

    $scope.trust = (html) => $sce.trustAsHtml(html);
    $scope.termAndConditions = $scope.trust($translate('term_and_conditions', { url: Organization.tosUrl() }));

  });
