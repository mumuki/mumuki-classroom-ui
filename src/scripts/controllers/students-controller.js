import * as _ from "lodash";

angular
  .module('classroom')
  .controller('StudentsController', function ($scope, $state, $controller, $stateParams, $timeout, toastr, $filter, students, Auth, Followers, Api, Modal, Domain, Breadcrumb, Humanizer, Permissions, Download) {

    $controller('ListHeaderController', {
      $scope: $scope,
      list: students.students,
      itemTemplate: 'views/templates/item-student.html',
      uidField: 'uid',
      apiEndpoint: $stateParams.course ? 'getStudents' : 'getAllStudents',
      responseField: "students"
    });

    $scope.availableSortingCriteria = ['name', 'progress', 'signup_date', 'last_submission_date'];

    if ($stateParams.course) {
      Breadcrumb.setCourse($stateParams.course);
      $scope.setCount(students.total);
    }

    $scope.Humanizer = Humanizer;

    $scope.withDetails = false;

    $scope.totalCount = students.total;
    $scope.isAdmin = Permissions.isAdmin();
    $scope.canTransfer = Permissions.isJanitor();
    $scope.canDetach = Permissions.isJanitor();
    $scope.canAddStudent = Permissions.isJanitor();

    $scope.stats = (student, field) => student.stats[field] * 100 / student.totalStats();

    $scope.followAction = (uid) => $scope.isFollowing(uid) ? $scope.unfollow(uid) : $scope.follow(uid);

    $scope.follow = (uid) => {
      return Api.follow(uid, $scope.course())
        .then(() => $state.reload())
        .catch((e) => toastr.error(e));
    };

    $scope.unfollow = (uid) => {
      return Api.unfollow(uid, $scope.course())
        .then(() => $state.reload())
        .catch((e) => toastr.error(e));
    };

    $scope.edit = (uid) => {
      const course = $scope.course();
      $state.go('classroom.students.edit', _.defaults({uid, course}, $stateParams))
    };

    $scope.remove = (student) => {
      Modal.removeStudent(student, () => {
        return Api
          .removeStudent(student.uid, $scope.course())
          .then(() => $state.reload())
          .catch((e) => toastr.error(e));
      });
    };

    $scope.attach = (student) => {
      Modal.attachStudent(student, () => {
        return Api
          .attachStudent(student.uid, $scope.course())
          .then(() => $state.reload())
          .catch((e) => toastr.error(e));
      });
    };

    $scope.detach = (student) => {
      Modal.detachStudent(student, () => {
        return Api
          .detachStudent(student.uid, $scope.course())
          .then(() => $state.reload())
          .catch((e) => toastr.error(e));
      });
    };

    $scope.transfer = (student) => {
      Modal.transfer(student, () => $state.reload());
    };

    $scope.reportUrl = () => {
      return `${Domain.classroomApiURL()}/students/report`;
    };
  });
