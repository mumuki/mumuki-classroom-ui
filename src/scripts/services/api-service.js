
angular
  .module('classroom')
  .service('Api', function ($http, $location, Course, Guide, GuideProgress, ExerciseProgress, Auth, CONFIG) {

    const subdomain = $location.host().split('classroom')[0];
    const API = `http://${subdomain}${CONFIG.classroom.url}/api`;

    const authenticated = (requestOptions = {}) => _.defaultsDeep(requestOptions, {
      headers: { Authorization: `Bearer ${Auth.token()}` }
    })

    this.getCourses = () => {
      return $http
        .get(`${API}/courses`, authenticated())
        .then((res) => _.map(res.data.courses, Course.from))
    };

    this.getGuides = ({ org, course }) => {
      return $http
        .get(`${API}/courses/${org}/${course}`, authenticated())
        .then((res) => _.map(res.data.course_guides, Guide.from))
    };

    this.getGuideProgress = ({ org, course, repo }) => {
      return $http
        .get(`${API}/guide_progress/${org}/${repo}`, authenticated())
        .then((res) => _.map(res.data.guides_progress, GuideProgress.from))
    };

    this.getExerciseProgress = ({ org, course, repo, student, exercise }) => {
      return $http
        .get(`${API}/guide_progress/${org}/${repo}/${student}/${exercise}`, authenticated())
        .then((res) => ExerciseProgress.from(res.data.exercise_progress))
    };

  });
