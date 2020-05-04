
angular
  .module('classroom')
  .controller('CourseController', function ($scope, $state, $stateParams, $timeout, clipboard, toastr, Api, Download, Modal, CurrentCourse, Domain, Permissions) {

    const tabs = {
      guides: 'classroom.courses.course.guides',
      students: 'classroom.courses.course.students',
      teachers: 'classroom.courses.course.teachers',
      exams: 'classroom.courses.course.exams'
    };

    $scope.course = CurrentCourse.get();

    $scope.inviteStudents = () => {
      Modal.inviteStudents($scope.course, (expirationDate) => {
        return Api
          .postInvitation($stateParams.course, expirationDate)
          .then((invitation) => {
            $scope.course.invitation = invitation;
            CurrentCourse.set($scope.course);
          })
          .catch((e) => toastr.error(e));
      });
    };

    $scope.tabs = _.keys(tabs);
    $scope.open = (tab) => $state.go(tabs[tab], $stateParams, { location: 'replace' });
    $scope.is = (tab) => $state.is(tabs[tab], $stateParams);

    $scope.setCount = (count) => $scope.count = count;

    $scope.goToAddStudents = () => $state.go('classroom.students.new', $stateParams);

    $scope.export = () => {
      Modal.exportCourseDataToJson($stateParams.course, () => {
        return Api
          .getCourseProgress($stateParams.course)
          .then((data) => Download.json($stateParams.course, data.exercise_student_progress))
          .catch((e) => toastr.error(e));
      });
    };

    $scope.isAdmin = Permissions.isAdmin();
    $scope.isJanitor = Permissions.isJanitor();

    $scope.reportUrl = () => {
      return `${Domain.classroomApiURL()}/courses/${$stateParams.course}/report`;
    };

    $scope.guideProgressReportUrl = () => {
      return `${Domain.classroomApiURL()}/courses/${$stateParams.course}/guide_progress_report`;
    };

    $scope.copy = (link) => {
      clipboard.copyText(link);
      $scope.isCopied = true;
      $timeout(() => $scope.isCopied = false, 2500);
    }

  });
