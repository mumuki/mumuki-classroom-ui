
angular
  .module('classroom')
  .controller('EditExamController', function ($scope, $state, $timeout, $controller, clipboard, exam, students, Api, Breadcrumb, Domain) {

    angular.extend(this, $controller('ExamController', { $scope: $scope }));

    $scope.totalCount = students.total;

    $scope.params = {
      q: '',
      page: 1,
      per_page: 30,
      sort_by: 'name',
      with_detached: false,
      order_by: 'asc'
    }

    $scope.selectPage = (n) => {
      $scope.params.page = n;
    }

    $scope.submit = Api.updateExam;

    Breadcrumb.setExam(exam);

    const isSelected = (student, newVal) => {
      student.isProcessing = true;
      return Api[`${newVal ? 'add' : 'remove'}StudentToExam`]($state.params.course, $scope.getExam(), student)
        .then(() => student.isSelected = newVal)
        .then(() => student.isProcessing = false);
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

    $scope.url = () => Domain.examURL($scope.exam.eid);

    $scope.copy = () => {
      clipboard.copyText($scope.url());
      $scope.isCopied = true;
      $timeout(() => $scope.isCopied = false, 5000);
    };

    let delayParamsChange;

    const withSelectedStudents = (students) => {
      students.forEach((student) => student.isSelected = _.includes(exam.uids, student.uid));
      return students;
    }

    $scope.$watch('params', () => {
      $timeout.cancel(delayParamsChange);
      delayParamsChange = $timeout(() => {
        Api.getStudents($state.params, $scope.params).then((response) => {
          $scope.students = withSelectedStudents(response.students);
          $scope.totalCount = response.total;
        });
      }, 250);
    }, true);

  });
