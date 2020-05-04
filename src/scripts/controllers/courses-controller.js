
angular
  .module('classroom')
  .controller('CoursesController', function ($scope, $state, $stateParams, courses, Permissions, Notification, Domain) {

    $scope.list = courses;
    $scope.noItemsToShow = 'no_courses_to_show';
    $scope.inputPlaceholder = 'filter_available_courses';

    const notifications = _.chain(Notification.get())
                           .filter({organization: Domain.tenant()})
                           .groupBy('course')
                           .value();

    $scope.notifications = (course) => {
      return _.get(notifications, course.slug, []);
    };

    $scope.isJanitor = Permissions.isJanitor();
    $scope.isCourse = true;
    $scope.sortCriteria = () => ['getName()'];

    $scope.open = (course) => {
      const slug = course.slug.split('/');
      $state.go('classroom.courses.course.guides', _.defaults({ course: slug[1] }, $stateParams))
    }

  });
