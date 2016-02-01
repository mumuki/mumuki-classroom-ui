
angular
  .module('classroom')
  .controller('GuidesController', function ($scope, $state, $stateParams, guides) {

    $scope.list = guides;
    $scope.type = 'Guías';
    $scope.preTitle = _.capitalize($stateParams.course.toUpperCase());

    $scope.sortCriteria = (guide) => ['language.name', 'name'];

    $scope.open = (guide) => {
      const [ org, repo ] = guide.slug.split('/');
      const course = $stateParams.course;
      $state.go('classroom.guideProgress', { org, repo, course });
    }

  });
