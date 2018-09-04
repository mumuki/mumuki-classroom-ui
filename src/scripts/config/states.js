
angular
  .module('classroom')
  .config(function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, OrganizationMapperProvider) {
    cfpLoadingBarProvider.includeSpinner = false;

    $stateProvider
      .state('classroom', {
        abstract: true,
        url: OrganizationMapperProvider.current().stateUrl(),
        views: {
          '@': {
            templateUrl: 'views/layout.html',
            resolve: {
              organization: (Organization) => {
                Organization.fetchFromServer()
              },
              languages: (Api, Languages) => {
                Api.getLanguages().then(Languages.set)
              }
            }
          },
          'navbar@classroom': {
            templateUrl: 'views/navbar.html',
            resolve: {
              notifications: (Api) => Api.getNotifications()
            },
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
      .state('classroom.notifications', {
        url: '/notifications?page',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/notifications.html',
            controller: 'NotificationsController',
            resolve: {
              notifications: ($stateParams, Notification) => {
                return Notification.getPage($stateParams.page || 0);
              }
            }
          }
        }
      })
      .state('classroom.students', {
        url: '/students/:course',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/student.html',
            controller: 'StudentController'
          }
        }
      })
      .state('classroom.students.edit', {
        url: '/students/edit/:course/:uid',
        authenticated: true,
        views: {
          'navbar@classroom': {},
          'content@classroom': {
            templateUrl: 'views/student.html',
            controller: 'StudentEditController',
            resolve: {
              student: ($stateParams, Api) => {
                return Api
                  .getStudent($stateParams.course, $stateParams.uid);
              }
            }
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
              courses: ($state, Api, $stateParams) => {
                return Api
                  .getCourses()
                  .catch(() => $state.go('classroom.home', $stateParams, { location: 'replace' }));
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
      .state('classroom.courses.course', {
        url: '/:course',
        abstract: true,
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/course.html',
            controller: 'CourseController',
            resolve: {
              course: ($state, $stateParams, Api, CurrentCourse) => {
                return Api
                  .getCourse($stateParams)
                  .then((course) => CurrentCourse.set(course))
                  .catch(() => $state.go('classroom.courses', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.courses.course.guides', {
        url: '/guides',
        authenticated: true,
        views: {
          'main@classroom.courses.course': {
            templateUrl: 'views/guides.html',
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
      .state('classroom.courses.course.guides.guide', {
        url: '/:org/:repo',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/guide-progress.html',
            controller: 'GuideProgressController',
            resolve: {
              data: ($state, $stateParams, Api, Languages) => {
                return Api
                  .getGuideProgress($stateParams)
                  .then((data) => {
                    return Api.getBibliothecaGuide($stateParams)
                      .then((guide) => {
                        if(guide.language){
                          Languages.fromName(guide.language).setAssets();
                        }
                        return {
                          guide: guide,
                          guideProgress: data.guideProgress
                        }
                      });
                  })
                  .catch(() => $state.go('classroom.courses.course.guides', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.courses.course.guides.guide.students', {
        url: '/:student/:eid?:tab',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/assignment.html',
            controller: 'AssignmentController',
            resolve: {
              guide: ($state, $stateParams, Api) => {
                return Api
                  .getBibliothecaGuide($stateParams)
                  .catch(() => $state.go('classroom.courses.course.guides.guide', $stateParams, { location: 'replace' }));
              },
              assignments: ($state, $stateParams, Api) => {
                return Api
                  .getAssignments($stateParams)
                  .catch(() => $state.go('classroom.courses.course.guides.guide', $stateParams, { location: 'replace' }));
              },
              guideProgress: ($state, $stateParams, Api) => {
                return Api
                  .getGuideProgress($stateParams)
                  .then((data) => data.guideProgress)
                  .catch(() => $state.go('classroom.courses.course.guides', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.courses.course.students', {
        url: '/students',
        authenticated: true,
        views: {
          'main@classroom.courses.course': {
            templateUrl: 'views/students.html',
            controller: 'StudentsController',
            resolve: {
              students: ($state, $stateParams, Api) => {
                return Api
                  .getStudents($stateParams)
                  .catch(() => $state.go('classroom.courses.course.guides', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.courses.course.teachers', {
        url: '/teachers',
        authenticated: true,
        views: {
          'main@classroom.courses.course': {
            templateUrl: 'views/teachers.html',
            controller: 'TeachersController',
            resolve: {
              teachers: ($state, $stateParams, Api) => {
                return Api
                  .getTeachers($stateParams)
                  .catch(() => $state.go('classroom.courses.course.guides', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.courses.course.teachers.new', {
        url: '/new',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/new-teacher.html',
            controller: 'NewTeacherController'
          }
        }
      })
      .state('classroom.courses.course.exams', {
        url: '/exams',
        authenticated: true,
        views: {
          'main@classroom.courses.course': {
            templateUrl: 'views/exams.html',
            controller: 'ExamsController',
            resolve: {
              exams: ($state, $stateParams, Api) => {
                return Api
                  .getExams($stateParams)
                  .catch(() => $state.go('classroom.courses.course.guides', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.courses.course.exams.new', {
        url: '/new',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/exam.html',
            controller: 'NewExamController',
            resolve: {
              guides: ($state, $stateParams, Api) => {
                return Api
                  .getBibliothecaGuides($stateParams)
                  .catch(() => $state.go('classroom.courses.course.guides', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      })
      .state('classroom.courses.course.exams.edit', {
        url: '/:exam',
        authenticated: true,
        views: {
          'content@classroom': {
            templateUrl: 'views/exam.html',
            controller: 'EditExamController',
            resolve: {
              exam: ($state, $stateParams, Api) => {
                return Api
                  .getExam($stateParams)
                  .catch(() => $state.go('classroom.courses.course.guides', $stateParams, { location: 'replace' }));
              },
              students: ($state, $stateParams, Api) => {
                return Api
                  .getStudents($stateParams)
                  .catch(() => $state.go('classroom.courses.course.guides', $stateParams, { location: 'replace' }));
              }
            }
          }
        }
      });

    $urlRouterProvider.otherwise(($injector) => {
      const $state = $injector.get('$state');
      const $stateParams = $injector.get('$stateParams');
      $state.go('classroom.home', $stateParams, { reload: true, location: 'replace' });
    });

  })
  .run(($rootScope, $state, Auth) => {

    $rootScope.$on('$stateChangeStart', function(ev, toState, toParams) {

      Auth.authenticateIfPossible();

      if(toState.authenticated && !Auth.isLoggedIn()) {
        $state.go('classroom.home', toParams, { location: 'replace' });
        ev.preventDefault();
      }

      if(toState.name === 'classroom.home' && Auth.isLoggedIn()) {
        $state.go('classroom.courses', toParams, { location: 'replace' });
        ev.preventDefault();
      }

    });

  });
