
angular
  .module('classroom')
  .controller('GuidesController', function ($scope, $state, $location, $timeout, $stateParams, clipboard, guides) {

    $scope.list = guides;
    $scope.type = 'Guías';
    $scope.preTitle = _.capitalize($stateParams.course.toUpperCase());

    const protocol = $location.protocol();
    const host = $location.host();
    const href = $state.href('classroom.students', { course: $stateParams.course })

    $scope.url = () => `${protocol}://${host}/${href}`;

    $scope.copy = () => {
      clipboard.copyText($scope.url());
      $scope.isCopied = true;
      $timeout(() => $scope.isCopied = false, 5000);
    };

    $scope.sortCriteria = (guide) => ['language.name', 'name'];

    $scope.open = (guide) => {
      const [ org, repo ] = guide.slug.split('/');
      const course = $stateParams.course;
      $state.go('classroom.guideProgress', { org, repo, course });
    }

  });
