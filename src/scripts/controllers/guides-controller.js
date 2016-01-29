
angular
  .module('classroom')
  .controller('GuidesController', function ($scope, $state, guides, DevIcon) {

    $scope.list = guides;
    $scope.type = 'Guías';

    $scope.getName = (guide) => guide.name;
    $scope.iconClass = (guide) => `devicons devicons-${DevIcon.from(guide.language)}`;
    $scope.sortCriteria = (guide) => ['language', 'name'];

    $scope.open = (guide) => {
      const [ org, repo ] = guide.guide.slug.split('/');
      const [ __, course] = guide.course.slug.split('/');
      $state.go('classroom.guideProgress', { org, repo, course });
    }

  });
