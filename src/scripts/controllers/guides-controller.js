
angular
  .module('classroom')
  .controller('GuidesController', function ($scope, $state, $stateParams, guides, DevIcon) {

    $scope.list = guides;
    $scope.type = 'Guías';

    $scope.getName = (guide) => guide.name;
    $scope.iconClass = (guide) => `devicons devicons-${DevIcon.from(guide.language.name)}`;
    $scope.sortCriteria = (guide) => ['language.name', 'name'];

    $scope.open = (guide) => {
      const [ org, repo ] = guide.slug.split('/');
      const course = $stateParams.course;
      $state.go('classroom.guideProgress', { org, repo, course });
    }

  });
