
angular
  .module('classroom')
  .controller('GuidesController', function ($scope, guides, DevIcon) {

    $scope.list = guides;
    $scope.type = 'Guías';

    $scope.getName = (guide) => guide.name;
    $scope.iconClass = (guide) => `devicons devicons-${DevIcon.from(guide.language)}`;
    $scope.sortCriteria = (guide) => ['language', 'name'];

  });
