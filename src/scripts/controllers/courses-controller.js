
angular
  .module('classroom')
  .controller('CoursesController', function ($scope, $state, courses) {

    $scope.list = courses;
    $scope.type = 'Cursos';

    $scope.iconClass = (course) => 'fa fa-graduation-cap';
    $scope.sortCriteria = () => ['slug'];

    $scope.getName = (course) => {
      const slug = course.slug.split('/');
      return `${slug[0]} - ${slug[1]}`;
    };

  });
