
angular
  .module('classroom')
  .controller('NavbarController', function ($scope, $state, $timeout, $sce, $filter, hotkeys, notifications, Student, Auth, Breadcrumb, Permissions, Notification, Api) {

    $scope.filter = { search: '' };

    Notification.set(notifications);
    $scope.Notification = Notification;
    $scope.signin = Auth.signin;
    $scope.signout = Auth.signout;
    $scope.profile = Auth.profile;
    $scope.imageUrl = Auth.imageUrl;
    $scope.isTeacher = Permissions.isTeacher;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.Breadcrumb = Breadcrumb;
    $scope.trust = (notification) => $sce.trustAsHtml($filter('translate')(notification.type.toLowerCase(), notification));

    $scope.goToAssignment = Notification.goToAssignment;

    let delaySearch;
    $scope.search = () => {
      $timeout.cancel(delaySearch);
      delaySearch = $timeout(() => {
        Api
          .getGuideProgress($state.params, { q: $scope.filter.search })
          .then((response) => {
            const students = _.map(response.guideProgress, (gp) => Student.from(gp.student));
            Breadcrumb.setStudents(students);
          })
      }, 750);
    }



    hotkeys
      .bindTo($scope)
      .add({
        combo: ['ctrl+down'],
        callback: () => {
          angular.element('ol.breadcrumb li.dropdown').addClass('open');
          angular.element('ol.breadcrumb li.dropdown input').focus();
        }
      })

  });
