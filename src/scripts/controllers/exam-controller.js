
angular
  .module('classroom')
  .controller('ExamController', function ($scope, $state, $stateParams, $filter, toastr, Api, Modal) {

    const isBefore = () =>
      !!$scope.exam &&
      !!$scope.exam.end_time &&
      !!$scope.exam.start_time &&
      moment($scope.exam.start_time).isBefore(moment($scope.exam.end_time));

    $scope.isValidStartTime = () => isBefore();
    $scope.isValidEndTime = () => isBefore();
    $scope.isValidDuration = () => !$scope.hasDuration || $scope.exam.duration > 0;
    $scope.isValidMaxProblemSubmissions = () => !!$scope.exam.max_problem_submissions && $scope.exam.max_problem_submissions > 0;
    $scope.isValidMaxChoiceSubmissions = () => !!$scope.exam.max_choice_submissions && $scope.exam.max_choice_submissions > 0;

    $scope.isValidMandatoryFields = () =>
      $scope.isValidEndTime() &&
      $scope.isValidDuration() &&
      $scope.isValidStartTime() &&
      $scope.isValidMaxProblemSubmissions() &&
      $scope.isValidMaxChoiceSubmissions();

    $scope.isValid = () => $scope.isValidMandatoryFields();

    $scope.getExam = () => {
      throw new Error('Not Implemented');
    }

    $scope.getExamInLocalTime = (localExam) => {
      localExam.start_time = moment(localExam.start_time).toDate();
      localExam.end_time = moment(localExam.end_time).toDate();
      return localExam;
    }

    const checkExistenceAndSave = (exam) => {
      return Api.isExamInUsage(exam)
        .then((hasUsage) => {
          if (hasUsage) {
            Modal.newExam(() => doCreate(exam));
          } else {
            doCreate(exam);
          }
        });
    }

    const doCreate = (exam) => {
      return $scope
        .submit($stateParams.course, exam)
        .then(() => $state.go('classroom.courses.course.exams', $stateParams, { reload: true }))
        .then(() => toastr.success($filter('translate')('exam_updated')))
        .catch((res) => toastr.error(res.data.message));
    }

    $scope.create = () => {
      const exam = $scope.getExam($scope.exam);
      if (!$scope.hasDuration) exam.duration = null;
      if ($scope.isNew) {
        checkExistenceAndSave(exam);
      } else {
        doCreate(exam);
      }
    }

  });
