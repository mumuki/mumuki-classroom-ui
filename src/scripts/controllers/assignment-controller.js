
angular
  .module('classroom')
  .controller('AssignmentController', function ($scope, $state, $sce, $stateParams, $filter, $timeout, toastr, hotkeys, guide, guideProgress, assignments, containsHtml, Assignment, Auth, Api, Breadcrumb, Preferences, Humanizer, Domain, Student, Modal, Scroll, Notification, Organization) {

    Preferences($scope, 'options');


    const SPLIT = { type: 'side-by-side', name: 'split' };
    const UNIFIED = { type: 'line-by-line', name: 'unified' };

    const LAST_SOLUTION = { type: 'only-last', name: 'last_solution', showMarkdown: true };
    const MESSAGES = { type: 'messages', name: 'messages', showMessages: true };
    const DIFF = { type: 'diff', name: 'diff', showDiff: true };

    const isUnified = () => _.isEqual($scope.options.diffMode, UNIFIED);

    const viewModeIsDiff = () => $scope.getViewMode().showDiff;
    const viewModeIsMessages = () => $scope.getViewMode().showMessages;
    const viewModeIsLastSolution = () => $scope.getViewMode().showMarkdown;

    const notifications = _.chain(Notification.get())
                           .filter({
                              organization: Domain.tenant(),
                              course: `${Domain.tenant()}/${$stateParams.course}`,
                              assignment: {
                                guide: {slug: guide.slug },
                                student: {uid: $stateParams.student }
                              }
                           })
                           .groupBy('assignment.exercise.eid')
                           .value();

    $scope.raiseHandEnabled = Organization.raiseHandEnabled();

    $scope.notifications = (assignment) => {
      return _.get(notifications, assignment.exercise.eid, []);
    }

    const toAssignment = (exercise, index) => {
      const currentAssignment = _.find(assignments, (assignment) => assignment.exercise.eid === exercise.id);
      exercise = _.merge(exercise, {
        eid: (_.get(currentAssignment, 'exercise.eid') === exercise.id ? currentAssignment.exercise.eid : exercise.id),
        number: index + 1
      });
      const assignment = _.find(assignments, (assignment) => exercise.eid === assignment.exercise.eid);
      return Assignment.from({
        guide: _.omit(guide, 'exercises'),
        student: _.get(assignments[0], 'student', {}),
        exercise: exercise,
        submissions: _.get(assignment, 'submissions', [])
      });
    };

    let currentExercise;

    $scope.guide = guide;
    $scope.assignments = _.map(guide.exercises, toAssignment);
    $scope.Humanizer = Humanizer;
    const assignment = _.find($scope.assignments, (assignment) => assignment.exercise.eid === Number($stateParams.eid)) || $scope.assignments[0]
    const course = $stateParams.course;

    Breadcrumb.setCourse(course);
    Breadcrumb.setGuide(assignment.guide);
    Breadcrumb.setStudent(assignment.student);
    Breadcrumb.setStudents(_.map(guideProgress, (assignment) => Student.from(assignment.student)));

    const currentAssignmentIndex = () => {
      return _.findIndex($scope.assignments, (p) => p.exercise.eid === currentExercise.eid);
    };
    const scrollChatToBottom = () => {
      Scroll.bottom('.mu-chat');
    };

    $scope.lastSolutionMarkdown = {};
    $scope.$watch('lastSolutionMarkdown', () => {}, true);

    $scope.assignmentStatus = (assignment) => _.get(_.last(assignment.submissions), 'status', '');

    $scope.nextAssignment = () => {
      const assignmentsIndex = currentAssignmentIndex();
      return $scope.assignments[Math.min(assignmentsIndex + 1, $scope.assignments.length - 1)];
    };

    $scope.prevAssignment = () => {
      const assignmentsIndex = currentAssignmentIndex();
      return $scope.assignments[Math.max(assignmentsIndex - 1, 0)]
    };

    $scope.options = _.defaultsDeep($scope.options, { viewMode: LAST_SOLUTION, diffMode: UNIFIED });
    if($stateParams.tab === 'messages') {
      $scope.options.viewMode =  MESSAGES;
    }

    DIFF.isUnified = isUnified();

    $scope.$watch(() => DIFF.isUnified, (bool) => {
      DIFF.current = $scope.options.diffMode = bool ? UNIFIED : SPLIT;
    });

    $scope.selectAssignment = (assignment) => {

      Modal.close();

      $scope.allMessages = false;

      currentExercise = assignment.exercise;
      mumuki.exercise = currentExercise;

      $stateParams.eid = currentExercise.eid;
      Breadcrumb.setExercise(currentExercise);

      $scope.assignment = assignment;
      $scope.containsHtml = containsHtml;
      $scope.lastSubmissionDate = Humanizer.date(_.get($scope, 'lastSubmission.created_at'));

      $scope.trust = (html) => $sce.trustAsHtml(html);
      $scope.selectDiff = (diff) => assignment.diffs.selected = diff;
      $scope.assignmentSelected = (assignment) => assignment.exercise.eid === $scope.assignment.exercise.eid;

      $scope.time = (message) => moment(message.created_at).fromNow();
      $scope.isLastSolutionActivated = () => _.isEqual($scope.options.viewMode, LAST_SOLUTION);
      $scope.getViewMode = () => $scope.options.viewMode;

      $scope.selectDiffByPage = (pageNumber) => $scope.selectDiff($scope.assignment.diffs.get(pageNumber - 1))

      $scope.hasSubmissions = () => !_.isEmpty($scope.assignment.submissions)

      $scope.diff = () => {
        $scope.options.viewMode = DIFF;
      }
      $scope.lastSolution = () => {
        assignment.diffs.selectLast();
        $scope.options.viewMode = LAST_SOLUTION;
      };
      $scope.messages = () => {
        assignment.diffs.selectLast();
        $scope.options.viewMode = MESSAGES;
        scrollChatToBottom();
      }

      if (viewModeIsDiff()) $scope.diff();
      if (viewModeIsMessages()) $scope.messages();
      if (viewModeIsLastSolution()) $scope.lastSolution();

      $scope.submissionHasMessages = (submission) => {
        return !_.isEmpty(submission.messages);
      }
      $scope.hasMessages = (assignment) => {
        return _.some(assignment.submissions, (submission) => $scope.submissionHasMessages(submission));
      }
      $scope.showMessagesIcon = (assignment) => {
        return $scope.submissionHasMessages(assignment.lastSubmission());
      };
      $scope.showNewMessagesIcon = (assignment) => {
        return !$scope.showMessagesIcon(assignment) && $scope.hasMessages(assignment);
      };

      $scope.messageSenderClass = (message) => message.is_me ? 'self' : 'other';

      const getMessageToPost = (submission) => {
        return {
          uid: $stateParams.student,
          exercise_id: assignment.exercise.eid,
          guide_slug: assignment.guide.slug,
          submission_id: submission.sid,
          message: {
            content: submission.message,
            created_at: new Date()
          }
        }
      }

      const getLastSubmissionMarkdown = () => {
        return `\`\`\`${assignment.guide.language}\n${assignment.lastSubmission().content}\n\`\`\``;
      }

      $scope.newMessage = () => {
        Modal.newMessage(getMessageToPost(assignment.lastSubmission()), Breadcrumb.getStudent(), course, (message) => {
          assignment.lastSubmission().messages.push(_.defaults(message, {is_me: true}));
          $scope.allMessages = false;
          scrollChatToBottom();
          Notification.readAssignment(assignment);
        });
      };

      $scope.manualEvaluation = () => {
        Modal.manualEvaluation(({comment, status}) => {
          const lastSubmission = assignment.lastSubmission();
          const params = {
            sid: lastSubmission.sid,
            eid: assignment.exercise.eid,
            uid: assignment.student.uid,
            slug: assignment.guide.slug,
            course: $stateParams.course,
            status: status,
            comment: comment,
          }
          return Api.postManualEvaluation(params)
            .then(() => {
              lastSubmission.status = status;
              lastSubmission.manual_evaluation = comment;

              assignment.diffs.selected.right.status = status;
              assignment.diffs.selected.right.manual_evaluation = comment;
            });
        });
      };

      $scope.viewMessages = () => {
        $scope.spin = true;
        Api
          .getMessages(_.merge($stateParams, {exercise: Breadcrumb.getExercise()}))
          .then((html) => Scroll.holdContent('.mu-chat', () => {
            $scope.html = html;
            $scope.spin = false;
            $scope.allMessages = true;
          }));
      };

      $scope.renderCustomEditor = false;
      $scope.lastSolutionExtra = assignment.exercise.extra;
      $scope.lastSolutionContent = _.get(assignment.diffs.last(), 'right.content', '');
      $timeout(() => $scope.renderCustomEditor = true);

      if (!$scope.lastSolutionMarkdown[currentExercise.eid]) {
        Api
          .renderCode(guide.language, $scope.lastSolutionContent)
          .then((markdown) => $scope.lastSolutionMarkdown[currentExercise.eid] = markdown);
      }

      scrollChatToBottom();

    };

    $scope.selectAssignment(assignment);
    $scope.$on('$destroy', () => Modal.close());

    function loadInput(values, element) {
      element.val(values[element.attr('name')]);
    }

    function loadForm() {
      let json = $scope.assignment.submissions[0].content;
      if (!json) return;

      let solutions = JSON.parse(json);

      $('.mu-free-form-input').each(function () {
        loadInput(solutions, $(this));
      });
    }

    angular.element(document).ready(() => {
      if ($('.mu-free-form-input').length === 0) return;

      loadForm(event);
    });

    hotkeys
      .bindTo($scope)
      .add({
        combo: ['ctrl+left', 'shift+left'],
        description: $filter('translate')('next_exercise_description'),
        callback: () => $scope.selectAssignment($scope.prevAssignment()),
      })
      .add({
        combo: ['ctrl+right', 'shift+right'],
        description: $filter('translate')('prev_exercise_description'),
        callback: () => $scope.selectAssignment($scope.nextAssignment()),
      })
      .add({
        combo: ['left'],
        description: $filter('translate')('next_solution_description'),
        callback: () => {
          if (viewModeIsDiff()) {
            $scope.assignment.diffs.selectPrev();
          }
        }
      })
      .add({
        combo: ['right'],
        description: $filter('translate')('prev_solution_description'),
        callback: () => {
          if (viewModeIsDiff()) {
            $scope.assignment.diffs.selectNext();
          }
        },
      });

  });
