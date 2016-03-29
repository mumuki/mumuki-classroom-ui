
angular
  .module('classroom')
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('classroom', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'views/layout.html'
          },
          'navbar@classroom': {
            templateUrl: 'views/navbar.html',
            controller: 'NavbarController'
          }
        }
      })
      .state('classroom.home', {
        url: '/home',
        authenticated: false,
        views: {
          'content@classroom': {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
          }
        }
      })
      .state('classroom.students', {
        url: '/courses/:course/students',
        authenticated: false,
        views: {
          'navbar@classroom': {},
          'content@classroom': {
            templateUrl: 'views/student.html',
            controller: 'StudentController'
          }
        }
      })
      .state('classroom.courses', {
        url: '/courses',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/select.html',
            controller: 'CoursesController',
            resolve: {
              courses: ($state, Api) => {
                return Api
                  .getCourses()
                  .catch(() => $state.go('classroom.home', {}, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.courses.new', {
        url: '/new',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/new-course.html',
            controller: 'NewCourseController'
          }
        }
      })
      .state('classroom.courses.guides', {
        url: '/:org/:course',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/select.html',
            controller: 'GuidesController',
            resolve: {
              guides: ($state, $stateParams, Api) => {
                return Api
                  .getGuides($stateParams)
                  .catch(() => $state.go('classroom.courses', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.guideProgress', {
        url: '/:org/:course/:repo',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/guide-progress.html',
            controller: 'GuideProgressController',
            resolve: {
              data: ($state, $stateParams, Api) => {
                return Api
                  .getGuideProgress($stateParams)
                  .catch(() => $state.go('classroom.courses.guides', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.guideProgress.exercise', {
        url: '/:student/:exercise',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/exercise-progress.html',
            controller: 'ExerciseProgressController',
            resolve: {
              exerciseProgress: ($state, $stateParams, Api) => {
                return Api
                  .getExerciseProgress($stateParams)
                  .catch(() => $state.go('classroom.guideProgress', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      });

    $urlRouterProvider.otherwise(($injector) => {
      $injector.get('$state').go('classroom.home', {}, { reload: true, location: 'replace' });
    });

  })
  .run(($rootScope, $state, Auth) => {

    $rootScope.$on('$stateChangeStart', function(ev, toState) {

      Auth.authenticateIfPossible();

      if(toState.authenticated && !Auth.isLoggedIn()) {
        $state.go('classroom.home', {}, { location: 'replace' });
        ev.preventDefault();
      }

      if(toState.name === 'classroom.home' && Auth.isLoggedIn()) {
        $state.go('classroom.courses', {}, { location: 'replace' });
        ev.preventDefault();
      }

    });

  });
