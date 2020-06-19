
angular
  .module('classroom')
  .controller('GuidesController', function ($scope, $state, $stateParams, guides, Guide, Chapter, Preferences, Breadcrumb, Notification, Domain) {
    Preferences($scope, 'lastChapter');
    if (_.isNil($scope.lastChapter)) $scope.lastChapter = { name: ''};
    $scope.setLastChapterOpened = (chapter) => { $scope.lastChapter = { name: chapter }};

    Breadcrumb.setCourse($stateParams.course);
    $scope.actualChapter = (name) => name === $scope.lastChapter.name;

    $scope.exams = guides.exams.map((it) => Guide.from(it.guide));
    $scope.chapters = guides.chapters.map((it) => Chapter.from(it));
    $scope.complements = guides.complements.map((it) => Guide.from(it.guide));

    $scope.noItemsToShow = 'no_guides_to_show';
    $scope.inputPlaceholder = 'filter_available_guides';

    $scope.sortCriteria = () => ['number', 'name'];
    $scope.present = (items) => !!items;

    $scope.open = (lesson) => {
      const [ org, repo ] = lesson.slug.split('/');
      $state.go('classroom.courses.course.guides.guide', _.defaults({ org, repo }, $stateParams));
    };

    const notifications = _.chain(Notification.get())
                           .filter({organization: Domain.tenant(), course: `${Domain.tenant()}/${$stateParams.course}` })
                           .groupBy('assignment.guide.slug')
                           .value();

    $scope.notifications = (lesson) => {
      return _.get(notifications, lesson.slug, []);
    }

    const count  = _.chain($scope.chapters)
                    .flatMap('lessons')
                    .concat($scope.complements.length)
                    .concat($scope.exams.length)
                    .size()
                    .value();

    $scope.setCount(count);

  });
