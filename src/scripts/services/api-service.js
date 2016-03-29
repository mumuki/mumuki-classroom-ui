
angular
  .module('classroom')
  .service('Api', function ($http, $location, Course, Guide, GuideProgress, ExerciseProgress, Auth, Domain, CONFIG) {

    const subdomain = Domain.tenant;
    const API = `http://${subdomain}${CONFIG.classroom.url}`;

    const authenticated = (requestOptions = {}) => _.defaultsDeep(requestOptions, {
      headers: { Authorization: `Bearer ${Auth.token()}` }
    })

    this.subdomain = subdomain;

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
        .get(`${API}/guide_progress/${org}/${course}/${repo}`, authenticated())
        .then((res) => ({guide: res.data.guide, guideProgress: _.map(res.data.progress, GuideProgress.from)}))
    };

    this.getExerciseProgress = ({ org, course, repo, student, exercise }) => {
      return $http
        .get(`${API}/guide_progress/${org}/${course}/${repo}/${student}/${exercise}`, authenticated())
        .then((res) => ExerciseProgress.from(res.data.exercise_progress))
    };

    this.createCourse = ({ name, description }) => {
      return $http
        .post(`${API}/courses`, { name: name.toLowerCase(), description: description }, authenticated())
    }

    this.updateStudent = (course, { first_name, last_name }) => {
      return $http
        .post(`${API}/courses/${course}/students`, { first_name, last_name }, authenticated())
    }

  });
