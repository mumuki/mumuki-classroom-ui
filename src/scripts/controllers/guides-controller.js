
angular
  .module('classroom')
  .controller('GuidesController', function ($scope, guides, DevIcon) {

    $scope.list = guides;
    $scope.type = 'Guías';

    $scope.getName = (item) => item.name;
    $scope.iconClass = (item) => `devicons devicons-${DevIcon.from(item.language)}`;
    $scope.sortCriteria = (item) => ['language', 'name'];


  });
