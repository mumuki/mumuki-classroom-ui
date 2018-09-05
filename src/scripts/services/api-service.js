
angular
  .module('classroom')
  .service('Api', function ($http, $location, Course, Guide, Student, Teacher, GuideProgress, Assignment, Exam, Auth, Domain, Organization, CONFIG) {

    const API = () => Domain.classroomApiURL();
    const BIBLIOTHECA = () => Domain.bibliothecaApiURL();

    const authenticated = (requestOptions = {}) => _.defaultsDeep(requestOptions, {
      headers: { Authorization: `Bearer ${Auth.token()}` }
    });

    this.subdomain = Domain.tenant;

    this.getCourses = () => {
      return $http
        .get(`${API()}/courses`)
        .then((res) => _.map(res.data.courses, Course.from))
    };

    this.getCourse = ({course}) => {
      return $http
        .get(`${API()}/courses/${course}`)
        .then((res) => Course.from(res.data.course))
    };

    this.courseExport = (type) => (course) => {
      return $http
        .get(`${API()}/courses/${course}/${type}`)
        .then((res) => res.data)
    }

    this.getCourseReport = this.courseExport('report');
    this.getCourseProgress = this.courseExport('progress');

    this.getBibliothecaGuides = () => {
      return $http
        .get(`${BIBLIOTHECA()}/guides`)
        .then((res) => res.data.guides)
    }

    this.getBibliothecaGuide = ({org, repo}) => {
      return $http
        .get(`${BIBLIOTHECA()}/guides/${org}/${repo}/markdown`)
        .then((res) => Guide.from(res.data))
    };

    this.getGuides = ({ course }) => {
      return $http
        .get(`${API()}/courses/${course}/guides`)
        .then((res) => _.map(res.data.guides, Guide.from))
    };

    this.getGuideProgress = ({ org, course, repo }, params = {}) => {
      return $http
        .get(`${API()}/courses/${course}/guides/${org}/${repo}`, {params})
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
    }

    this.createExam = (course, exam) => {
      return $http
        .post(`${API()}/courses/${course}/exams`, exam)
    }

    this.isExamInUsage = (exam) => {
      return $http
        .get(`${API()}/guides/${exam.slug}`)
        .then(() => true, () => false)
    }

    this.createStudent = (course, student) => {
      return $http
        .post(`${API()}/courses/${course}/students`, student)
    }

    this.updateStudent = (course, student) => {
      return $http
        .put(`${API()}/courses/${course}/students/${student.uid}`, student)
    }

    this.getStudent = (course, uid) => {
      return $http
        .get(`${API()}/courses/${course}/student/${uid}`)
      }

    this.updateTeacher = (course, teacher) => {
      return $http
        .post(`${API()}/courses/${course}/teachers`, teacher)
    }

    this.updateExam = (course, exam) => {
      return $http
        .put(`${API()}/courses/${course}/exams/${exam.eid}`, exam)
    }

    this.addStudentToExam = (course, exam, student) => {
      return $http
        .post(`${API()}/courses/${course}/exams/${exam.eid}/students/${student.uid}`, {});
    }

    this.removeStudentToExam = (course, exam, student) => {
      return $http
        .delete(`${API()}/courses/${course}/exams/${exam.eid}/students/${student.uid}`);
    }

    this.getStudents = ({ course }, params = {}) => {
      return $http
        .get(`${API()}/courses/${course}/students`, { params })
        .then((res) => {
          res.data.students = _.map(res.data.students, Student.from);
          return res.data;
        })
    }

    this.getTeachers = ({ course }) => {
      return $http
        .get(`${API()}/courses/${course}/teachers`)
        .then((res) => _.map(res.data.teachers, Teacher.from));
    }

    this.removeStudent = (uid, course) => {
      return $http
        .delete(`${API()}/courses/${course}/students/${uid}`)
    }

    this.detachStudent = (uid, course) => {
      return $http
        .post(`${API()}/courses/${course}/students/${uid}/detach`, {})
    }

    this.attachStudent = (uid, course) => {
      return $http
        .post(`${API()}/courses/${course}/students/${uid}/attach`, {})
    }

    this.transfer = (uid, course, destination) => {
      return $http
        .post(`${API()}/courses/${course}/students/${uid}/transfer`, { destination })
    }

    this.newMessage = (data, course) => {
      return $http
        .post(`${API()}/courses/${course}/messages`, data);
    }

    this.getMessages = ({course, org, repo, student, exercise}) => {
      const eid = exercise.eid;
      const language = exercise.language;
      return $http
        .get(`${API()}/courses/${course}/guides/${org}/${repo}/${eid}/student/${student}/messages?language=#{language}`)
        .then((res) => res.data)
    }

    this.follow = (uid, course) => {
      return $http
        .post(`${API()}/courses/${course}/followers`, { uid })
    }

    this.unfollow = (uid, course) => {
      return $http
        .delete(`${API()}/courses/${course}/followers/${uid}`)
    }

    this.getFollowers = (course) => {
      return $http
        .get(`${API()}/courses/${course}/followers`)
        .then((data) => {
          const groupedData = _.groupBy(data.data.followers, "course");
          return _.forEach(groupedData, (v, k) => groupedData[k] = _.head(groupedData[k]));
        });
    }

    this.addPermission = (slug, email) => {
      return $http
        .post(`${API()}/courses/${slug}/permissions`, { email })
    }

    this.getOrganization = () => {
      return $http
        .get(`${API()}/organization`)
    }

    this.getPermissions = () => {
      return $http
        .get(`${API()}/permissions`)
        .then((res) => res.data);
    }

    this.addStudent = (course, student) => {
      return $http
        .post(`${API()}/courses/${course}/students`, student)
    }

    this.getNotifications = () => {
      return $http
        .get(`${API()}/notifications/unread`)
        .then((res) => res.data)
        .catch(() => []);
    };

    this.getNotificationsPage = (page, perPage) => {
      return $http
        .get(`${API()}/notifications?page=${page}&per_page=${perPage}`)
        .then((res) => res.data)
        .catch(() => ({total: 0, page: 1, notifications: []}));
    }

    this.putNotification = (notificationId, action) => {
      return $http
        .put(`${API()}/notifications/${notificationId}/${action}`);
    };

    this.readNotification = (notificationId) => this.putNotification(notificationId, 'read');
    this.unreadNotification = (notificationId) => this.putNotification(notificationId, 'unread');

    this.getLoginUrl = () => Domain.loginURL();
    this.getLogoutUrl = () => Domain.logoutURL();

    this.renderMarkdown = (markdown) => {
      return $http
        .post(`${BIBLIOTHECA()}/markdown`, { markdown })
        .then((res) => _.get(res, 'data.markdown'));
    };

    this.postInvitation = (course, expiration) => {
      return $http
        .post(`${API()}/courses/${course}/invitation`, {expiration_date: expiration})
        .then((res) => _.get(res, 'data.invitation'));
    };

    this.postManualEvaluation = ({course, slug, uid, eid, sid, comment, status}) => {
      return $http
        .post(`${API()}/courses/${course}/guides/${slug}/${eid}/student/${uid}/manual_evaluation`, {sid, comment, status})
    }

    this.getLanguages = () => {
      return $http
        .get(`${BIBLIOTHECA()}/languages`)
        .then((res) => res.data.languages);
    };

  });
