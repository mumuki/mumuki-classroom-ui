angular
  .module('classroom')
  .controller('ExamController', function ($scope, $state, $stateParams, $filter, toastr, Api, Modal) {

    $scope.titleKey = 'exam_enable_students';

    const isBefore = () =>
      !!$scope.exam &&
      !!$scope.exam.end_time &&
      !!$scope.exam.start_time &&
      moment($scope.exam.start_time).isBefore(moment($scope.exam.end_time));

    $scope.isValidStartTime = () => isBefore();
    $scope.isValidEndTime = () => isBefore();
    $scope.isValidDuration = () => !$scope.hasDuration || $scope.exam.duration > 0;
    $scope.isValidMaxProblemSubmissions = () => !$scope.exam.max_problem_submissions || $scope.exam.max_problem_submissions > 0;
    $scope.isValidMaxChoiceSubmissions = () => !$scope.exam.max_choice_submissions || $scope.exam.max_choice_submissions > 0;
    $scope.isValidPassingCriterion = () => !!$scope.passing_criterion && $scope.passing_criterion.type && $scope.passing_criterion.type.isValid($scope.passing_criterion.value);

    $scope.isValidMandatoryFields = () =>
      $scope.isValidEndTime() &&
      $scope.isValidDuration() &&
      $scope.isValidStartTime() &&
      $scope.isValidMaxProblemSubmissions() &&
      $scope.isValidMaxChoiceSubmissions() &&
      $scope.isValidPassingCriterion();

    $scope.isValid = () => $scope.isValidMandatoryFields();

    $scope.getExam = () => {
      throw new Error('Not Implemented');
    };

    $scope.getExamInLocalTime = (localExam) => {
      localExam.start_time = moment(localExam.start_time).toDate();
      localExam.end_time = moment(localExam.end_time).toDate();
      return localExam;
    };

    const checkExistenceAndSave = (exam) => {
      return Api.isExamInUsage(exam)
        .then((hasUsage) => {
          if (hasUsage) {
            Modal.newExam(() => doCreate(exam));
          } else {
            doCreate(exam);
          }
        });
    };

    const doCreate = (exam) => {
      return $scope
        .submit($stateParams.course, exam)
        .then(() => $state.go('classroom.courses.course.exams', $stateParams, { reload: true }))
        .then(() => toastr.success($filter('translate')('exam_updated')))
        .catch((res) => toastr.error(res.data.message));
    };

    $scope.create = () => {
      const exam = $scope.getExam($scope.exam);
      if (!$scope.hasDuration) exam.duration = null;
      if ($scope.isNew) {
        checkExistenceAndSave(exam);
      } else {
        doCreate(exam);
      }
    };

    const PASSING_CRITERIA = [
      { key: 'none', isValid: (_) => true },
      { key: 'passed_exercises', isValid: (value) => value && value >= 0 },
      { key: 'percentage', isValid: (value) => value && value >= 0 && value <= 100 }
    ];

    $scope.passingCriteria = PASSING_CRITERIA;

    $scope.$watch('passing_criterion', () => {
      $scope.exam.passing_criterion = $scope.toExamCriterion($scope.passing_criterion);
    }, true);

    $scope.isNone = (type) => type === 'none';

    $scope.fromExamCriterion = (examCriterion) => {
      if (!examCriterion) return { type: $scope.passingCriteria[0] };

      const key = examCriterion.type;
      const value = examCriterion.value;
      const type = _.find(PASSING_CRITERIA, {key});

      return { type, value }
    };

    $scope.toExamCriterion = (scopeCriterion) => {
      var criterion = { type: scopeCriterion.type.key, value: scopeCriterion.value };

      if ($scope.isNone(criterion.type)) delete criterion.value;

      return criterion;
    };

    $scope.addPermissions = (result) => {
      const emails = _.compact(_.map(result, 'email'));
      Api
        .addStudentsToExam($stateParams.course, $scope.exam, emails)
        .then(processedStudents => {
          processedStudents.forEach(student_uid => setStudentAsSelected(student_uid));
          if(processedStudents.length === emails.length) {
            toastr.success($filter('translate')('students_added_successfully_to_exam'));
          }
          else {
            toastr.error($filter('translate')('students_not_added_to_exam'));
          }
        });
    };

    const setStudentAsSelected = (email) => {
      const student = _.find($scope.students, {email: email});
      if(student) {
        student.isSelected = true;
      }
    };
  });
