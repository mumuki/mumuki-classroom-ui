
angular
  .module('classroom')
  .controller('EditExamController', function ($scope, $state, $timeout, $controller, clipboard, exam, students, Api, Breadcrumb, Domain) {

    angular.extend(this, $controller('ExamController', { $scope: $scope }));

    $scope.students = students.students;

    $scope.itemsPerPage = 30
    $scope.actualPage = 1,
    $scope.totalCount = students.total;

    const getParams = () => ({
      page: $scope.actualPage,
      per_page: $scope.itemsPerPage,
      with_detached: false,
    });

    $scope.params = getParams();

    $scope.selectPage = (n) => {
      $scope.params.page = n;
    }

    $scope.students
      .filter((student) => _(exam.uids).includes(student.uid))
      .forEach((student) => student.isSelected = true)

    Breadcrumb.setExam(exam);

    const isSelected = (student, newVal) => {
      Api[`${newVal ? 'add' : 'remove'}StudentToExam`](course, exam, student)
        .then(() => student.isSelected = newVal)
    };

    $scope.getExam = () => {
      return $scope.getExamInLocalTime($scope.exam);
    }

    $scope.exam = $scope.getExamInLocalTime(exam);
    $scope.exam_type = 'edit_exam';

    $scope.passing_criterion = $scope.fromExamCriterion($scope.exam.passing_criterion);

    $scope.sortCriteria = (student) => student.fullName();

    $scope.toggle = (student) => isSelected(student, !student.isSelected);

    $scope.openExamInLaboratory = () => Domain.openExamInLaboratory($state.params.exam);

    $scope.url = () => Domain.examURL($scope.exam.id);

    $scope.copy = () => {
      clipboard.copyText($scope.url());
      $scope.isCopied = true;
      $timeout(() => $scope.isCopied = false, 5000);
    };

    let delayParamsChange;
    $scope.$watch('params', () => {
      $timeout.cancel(delayParamsChange);
      $scope.params = getParams();
      delayParamsChange = $timeout(() => {
        Api.getStudents($state.params, $scope.params).then((response) => {
          $scope.students = response.students;
          $scope.actualPage = response.page;
          $scope.totalCount = response.total;
        });
      }, 100);
    }, true);

  });
