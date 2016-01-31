
angular
  .module('classroom')
  .controller('CoursesController', function ($scope, $state, courses) {

    $scope.list = courses;
    $scope.type = 'Cursos';

    $scope.sortCriteria = () => ['slug'];

    $scope.open = (course) => {
      const slug = course.slug.split('/');
      $state.go('classroom.courses.guides', { org: slug[0], course: slug[1] })
    }

  });
