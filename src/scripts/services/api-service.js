angular
  .module('classroom')
  .service('Api', function ($http, $q, Course, Guide, Student, Teacher, GuideProgress, Assignment, Exam, Domain) {

    const API = () => Domain.classroomApiURL();
    const BIBLIOTHECA = () => Domain.bibliothecaApiURL();
    const MASSIVE_BATCH_LIMIT = () => 100;
    const MASSIVE_API_PREFIX = (course) => `${API()}/api/courses/${course}/massive`

    this.subdomain = Domain.tenant;

    this.getCourses = () => {
      return $http
        .get(`${API()}/courses`)
        .then((res) => _.map(res.data.courses, Course.from))
    };

    this.getCourse = ({ course }) => {
      return $http
        .get(`${API()}/courses/${course}`)
        .then((res) => Course.from(res.data.course))
    };

    this.courseExport = (type) => (course) => {
      return $http
        .get(`${API()}/courses/${course}/${type}`)
        .then((res) => res.data)
    };

    this.getCourseReport = this.courseExport('report');
    this.getCourseProgress = this.courseExport('progress');

    this.getBibliothecaGuides = () => {
      return $http
        .get(`${BIBLIOTHECA()}/guides`)
        .then((res) => res.data.guides)
    };

    this.getBibliothecaGuide = ({ org, repo }) => {
      return $http
        .get(`${BIBLIOTHECA()}/guides/${org}/${repo}/markdown`)
        .then((res) => Guide.from(res.data))
    };

    this.getGuides = ({ course }) => {
      return $http
        .get(`${API()}/courses/${course}/guides`)
        .then((res) => res.data)
    };

    this.getGuideProgress = ({ org, course, repo }, params = {}) => {
      return $http
        .get(`${API()}/courses/${course}/guides/${org}/${repo}`, { params })
        .then((res) => ({
          page: res.data.page,
          total: res.data.total,
          guide: Guide.from(_.get(res.data, 'guide_students_progress[0].guide')),
          guideProgress: _.map(res.data.guide_students_progress, GuideProgress.from)
        }))
    };

    this.getAssignments = ({ org, course, repo, student }) => {
      return $http
        .get(`${API()}/courses/${course}/guides/${org}/${repo}/${student}`)
        .then((res) => _.map(res.data.exercise_student_progress, Assignment.from))
    };

    this.getExams = ({ course }) => {
      return $http
        .get(`${API()}/courses/${course}/exams`)
        .then((res) => _.map(res.data.exams, Exam.from))
    };

    this.getExam = ({ course, exam }) => {
      return $http
        .get(`${API()}/courses/${course}/exams/${exam}`)
        .then((res) => Exam.from(res.data))
    };

    this.getSuggestions = ({ guide_slug, exercise_id }) => {
      return $http
        .get(`${API()}/suggestions/${guide_slug}/${exercise_id}`);
    };

    this.createCourse = (course) => {
      return $http
        .post(`${API()}/courses`, course)
    };

    this.createExam = (course, exam) => {
      return $http
        .post(`${API()}/courses/${course}/exams`, exam)
    };

    this.isExamInUsage = (exam) => {
      return $http
        .get(`${API()}/guides/${exam.slug}`)
        .then(() => true, () => false)
    };

    this.createStudent = (course, student) => {
      return $http
        .post(`${API()}/courses/${course}/students`, student)
    };

    this.updateStudent = (course, student) => {
      return $http
        .put(`${API()}/courses/${course}/students/${student.uid}`, student)
    };

    this.getStudent = (course, uid) => {
      return $http
        .get(`${API()}/courses/${course}/student/${uid}`)
    };

    this.updateTeacher = (course, teacher) => {
      return $http
        .post(`${API()}/courses/${course}/teachers`, teacher);
    };

    this.updateExam = (course, exam) => {
      return $http
        .put(`${API()}/courses/${course}/exams/${exam.eid}`, exam);
    };

    this.addStudentToExam = (course, exam, student_uid) => {
      return $http
        .post(`${API()}/courses/${course}/exams/${exam.eid}/students/${student_uid}`, {});
    };

    this.removeStudentToExam = (course, exam, student_uid) => {
      return $http
        .delete(`${API()}/courses/${course}/exams/${exam.eid}/students/${student_uid}`);
    };

    this.addStudentsToExam = (course, exam, students_uids_batch) => {
      return this
        .massiveRequest(students_uids_batch, (students_uids) =>
          $http.post(`${MASSIVE_API_PREFIX(course)}/exams/${exam.eid}/students`, {uids: students_uids})
        );
    };

    this.getStudents = ({ course }, params = {}) => {
      return $http
        .get(`${API()}/courses/${course}/students`, { params })
        .then((res) => {
          res.data.students = _.map(res.data.students, Student.from);
          return res.data;
        })
    };

    this.getAllStudents = ({}, params = {}) => {
      return $http
        .get(`${API()}/students`, { params })
        .then((res) => {
          res.data.students = _.map(res.data.students, Student.from);
          return res.data;
        })
    };

    this.getTeachers = ({ course }) => {
      return $http
        .get(`${API()}/courses/${course}/teachers`)
        .then((res) => _.map(res.data.teachers, Teacher.from));
    };

    this.removeStudent = (uid, course) => {
      return $http
        .delete(`${API()}/courses/${course}/students/${uid}`)
    };

    this.detachStudent = (uid, course) => {
      return $http
        .post(`${API()}/courses/${course}/students/${uid}/detach`, {})
    };

    this.attachStudent = (uid, course) => {
      return $http
        .post(`${API()}/courses/${course}/students/${uid}/attach`, {})
    };

    this.transfer = (uid, course, destination) => {
      return $http
        .post(`${API()}/courses/${course}/students/${uid}/transfer`, { destination })
    };

    this.newMessage = (data, course) => {
      return $http
        .post(`${API()}/courses/${course}/messages`, data);
    };

    this.getMessages = ({ course, org, repo, student, exercise }) => {
      const eid = exercise.eid;
      const language = exercise.language;
      return $http
        .get(`${API()}/courses/${course}/guides/${org}/${repo}/${eid}/student/${student}/messages?language=${language}`)
        .then((res) => res.data)
    };

    this.follow = (uid, course) => {
      return $http
        .post(`${API()}/courses/${course}/followers`, { uid })
    };

    this.unfollow = (uid, course) => {
      return $http
        .delete(`${API()}/courses/${course}/followers/${uid}`)
    };

    this.getFollowers = (course) => {
      return $http
        .get(`${API()}/courses/${course}/followers`)
        .then((data) => {
          const groupedData = _.groupBy(data.data.followers, "course");
          return _.forEach(groupedData, (v, k) => groupedData[k] = _.head(groupedData[k]));
        });
    };

    this.addPermission = (slug, email) => {
      return $http
        .post(`${API()}/courses/${slug}/permissions`, { email })
    };

    this.getOrganization = () => {
      return $http
        .get(`${API()}/organization`)
    };

    this.getPermissions = () => {
      return $http
        .get(`${API()}/permissions`)
        .then((res) => res.data);
    };

    this.addStudent = (course, student) => {
      return $http
        .post(`${API()}/courses/${course}/students`, student)
    };

    this.addStudentsToCourse = (course, students_batch) => {
      return this.massiveRequest(students_batch, (students) =>
        $http.post(`${MASSIVE_API_PREFIX(course)}/students`, { students: students })
      )
    };

    this.addTeachersToCourse = (course, teachers_batch) => {
      return this.massiveRequest(teachers_batch, (teachers) =>
        $http.post(`${MASSIVE_API_PREFIX(course)}/teachers`, { teachers: teachers })
      )
    };

    this.getNotifications = () => {
      return $http
        .get(`${API()}/notifications/unread`, { ignoreLoadingBar: true })
        .then((res) => res.data.notifications)
        .catch(() => []);
    };

    this.getNotificationsPage = (page, perPage) => {
      return $http
        .get(`${API()}/notifications?page=${page}&per_page=${perPage}`)
        .then((res) => res.data)
        .catch(() => ({ total: 0, page: 1, notifications: [] }));
    };

    this.putNotification = (notificationId, action) => {
      return $http
        .put(`${API()}/notifications/${notificationId}/${action}`);
    };

    this.readNotification = (notificationId) => this.putNotification(notificationId, 'read');
    this.unreadNotification = (notificationId) => this.putNotification(notificationId, 'unread');

    this.getLoginUrl = () => Domain.loginURL();
    this.getLogoutUrl = () => Domain.logoutURL();

    this.renderCode = (language, code) => {
      return this.renderMarkdown(
        `\`\`\`${language}\n${code.trim()}\n\`\`\``
      );
    };

    this.renderMarkdown = (markdown) => {
      return $http
        .post(`${BIBLIOTHECA()}/markdown`, { markdown })
        .then((res) => _.get(res, 'data.markdown'));
    };

    this.postInvitation = (course, expiration) => {
      return $http
        .post(`${API()}/courses/${course}/invitation`, { expiration_date: expiration })
        .then((res) => _.get(res, 'data.invitation'));
    };

    this.postManualEvaluation = ({ course, slug, uid, eid, sid, comment, status }) => {
      return $http
        .post(`${API()}/courses/${course}/guides/${slug}/${eid}/student/${uid}/manual_evaluation`, {
          sid,
          comment,
          status
        })
    };

    this.getLanguages = () => {
      return $http
        .get(`${BIBLIOTHECA()}/languages`)
        .then((res) => res.data.languages);
    };

    this.generateGuideReport = ({ org, course, repo }, reportParams, queryParams) => {
      return $http
        .post(`${API()}/courses/${course}/guides/${org}/${repo}/report?${queryParams}`, reportParams)
        .then((res) => this.downloadCsv('guide_report.csv', res.data));
    };

    this.massiveRequest = (totalElements, request) => {
      const chunks = _.chunk(totalElements, MASSIVE_BATCH_LIMIT());
      const requests = chunks.map(request);
      return $q
        .all(requests)
        .then(results =>  _.reduce(results, (acc, res) => {
          acc.data = reduceMultipleResponse(acc.data, res.data);
          return acc;
        }))
        .then((res) => res.data);
    };

    this.multipleRequests = (requestsPromises) => {
      return $q
        .all(requestsPromises)
        .then((responses) => responses.reduce(reduceMultipleResponse))
    }

    this.downloadCsv = (filename, data) => {
      var link = document.createElement("a");
      link.download = filename;
      var uri = 'data:application/csv;charset=utf-8;,' + encodeURI(data);
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function reduceMultipleResponse(acc = {}, res = {}) {
      acc.processed = append('processed', acc, res);
      acc.unprocessed = append('unprocessed', acc, res);
      acc.errored_members = append('errored_members', acc, res);
      acc.processed_count = plus('processed_count', acc, res);
      acc.unprocessed_count = plus('unprocessed_count', acc, res);
      acc.errored_members_count = plus('errored_members_count', acc, res);
      return acc;
    }

    function plus(field, obj1, obj2) {
      return _.get(obj1, field, 0)  + _.get(obj2, field, 0);
    }

    function append(field, obj1, obj2) {
      return [... _.get(obj1, field, []), ... _.get(obj2, field, []) ];
    }
  });
