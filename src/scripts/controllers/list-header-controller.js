
angular
  .module('classroom')
  .controller('ListHeaderController', function ($scope, $stateParams, $filter, $timeout, list, responseField, uidField, apiEndpoint, itemTemplate, Api, Auth, Preferences, Followers, Domain, Permissions) {

    const filter = $filter('filter');

    $scope.listOptions = {
      search: ''
    };

    Preferences($scope, 'options');

    _.defaultsDeep($scope, { options: { sortingType: 'progress', isAscending: true }});

    $scope.actualPage = 1;
    $scope.itemsPerPage = 30;

    $scope.filters = [{ icon: 'fa fa-search', text: 'filter_students', type: 'string', queryOperands: [] }];
    if($scope.extraFilters) $scope.filters.push.apply($scope.filters, $scope.extraFilters);

    $scope.withFilter = true;
    $scope.withMultipleFilters = $scope.filters.length > 1;
    $scope.currentFilter = $scope.filters[0];

    $scope.setCurrentFilter = function (filter) {
      if(!($scope.currentFilter.type === filter.type)) $scope.listOptions.search = '';
      $scope.currentQueryOperand = filter.queryOperands[0];
      $scope.currentFilter = filter;
      $scope.queryChange();
    };

    $scope.setcurrentQueryOperand = function (queryOperand) {
      $scope.currentQueryOperand = queryOperand;
      $scope.queryChange();
    };

    $scope.withSortBy = true;
    $scope.withDetails = true;
    $scope.withFollowers = true;
    $scope.withDetachedStudents = Permissions.isTeacher();
    $scope.withStudentExport = $stateParams.withStudentExport;

    $scope.list = list;
    $scope.itemTemplate = itemTemplate;

    $scope.showDetails = Preferences.showDetails;
    $scope.toggleShowDetails = Preferences.toggleShowDetails;

    $scope.showDetachedStudents = Preferences.showDetachedStudents;
    $scope.toggleShowDetachedStudents = () => {
      Preferences.toggleShowDetachedStudents();
      $scope.params.page = 1;
      $scope.params.with_detached = $scope.showDetachedStudents();
    };

    $scope.onlyFollowers = Preferences.onlyFollowers;
    $scope.toggleOnlyFollowers = () => {
      Preferences.toggleOnlyFollowers();
      $scope.params.page = 1;
      $scope.params.students = mapStudentsParam();
    }

    const mapOrderBy = () => $scope.options.isAscending ? 'asc' : 'desc';
    const mapStudentsParam = () => $scope.onlyFollowers() ? 'follow' : 'all';

    $scope.params = {
      q: '',
      page: $scope.actualPage,
      per_page: $scope.itemsPerPage,
      sort_by: $scope.options.sortingType,
      with_detached: $scope.showDetachedStudents(),
      students: mapStudentsParam(),
      order_by: mapOrderBy(),
      query_criteria: ''
    };

    $scope.selectPage = (n) => {
      $scope.params.page = n;
    };

    $scope.toggleIsAscending = () => {
      $scope.options.isAscending = !$scope.options.isAscending;
      $scope.params.order_by = mapOrderBy();
    };

    $scope.followUpsCount = () => Followers.count($scope.courseSlug());
    $scope.course = () => $stateParams.course;
    $scope.courseSlug = () => `${Domain.tenant()}/${$scope.course()}`;

    $scope.offset = () => $scope.itemsPerPage * ($scope.actualPage - 1);

    $scope.isFollowing = (uid) => Followers.isFollowing($scope.courseSlug(), uid);
    $scope.byFollowers = (item) => !$scope.onlyFollowers() || Followers.isFollowing($scope.courseSlug(), _.get(item, uidField));
    $scope.byDetachedStudents = (item) => !item.detached || ($scope.withDetachedStudents && $scope.showDetachedStudents());

    $scope.filteredList = () => filter(filter($scope.list, $scope.listOptions.search), (item) => {
      return $scope.byDetachedStudents(item) && $scope.byFollowers(item);
    });

    $scope.$watch('options.sortingType', (newValue) => {
      $scope.params.sort_by = newValue;
    });

    let delayQueryChange;
    $scope.queryChange = () => {
      $timeout.cancel(delayQueryChange);
      delayQueryChange = $timeout(() => {
        $scope.params.page = 1;
        $scope.params.q = $scope.listOptions.search;
        $scope.params.query_criteria = $scope.currentFilter.queryCriteria;
        $scope.params.query_operand = _.get($scope.currentQueryOperand, 'text');
      }, 750);
    };

    const camel = (string) => {
      return string.replace(/^(.)/g, (char) => char.toUpperCase());
    };

    let delayParamsChange;
    $scope.$watch('params', () => {
      $timeout.cancel(delayParamsChange);
      delayParamsChange = $timeout(() => {
        apiEndpoint = apiEndpoint ? apiEndpoint : `get${camel(responseField)}`;
        Api[apiEndpoint]($stateParams, $scope.params).then((response) => {
          $scope.list = response[responseField];
          $scope.actualPage = response.page;
          $scope.totalCount = response.total;
        });
      }, 50);
    }, true);

    Api
      .getFollowers($scope.course())
      .then((data) => Followers.setFollowUps(data))

  });
