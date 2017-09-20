
angular
  .module('classroom')
  .service('Domain', function ($window, OrganizationMapper) {

    const openAth = (mode, path='') => {
      $window.open(`${this.laboratoryURL()}${path}`, mode);
      return true;
    }

    this.openLaboratory = () => openAth('_self');
    this.openExamInLaboratory = (exam) => openAth('_blank', `/exams/${exam}`);

    this.tosURL = (locale) => `${this.laboratoryURL()}/static/tos/tos-${locale}.txt`

    this.guideURL = (slug) => `${this.laboratoryURL()}/guides/${slug}`

    this.exerciseURL = (exerciseId) => `${this.laboratoryURL()}/exercises/${exerciseId}`;
    this.exerciseURLByBibliotheca = (guideSlug, exerciseId) => `${this.laboratoryURL()}/exercises/${guideSlug}/${exerciseId}`;

    this.examURL = (exam) => `${this.laboratoryURL()}/exams/${exam}`;


    this.tenant = () => OrganizationMapper.tenant();
    this.laboratoryURL = () => OrganizationMapper.laboratoryURL();
    this.classroomApiURL = () => OrganizationMapper.classroomApiURL();
    this.bibliothecaApiURL = () => OrganizationMapper.bibliothecaApiURL();

    this.invitationURL = (invitationCode) => OrganizationMapper.invitationURL(invitationCode);

    this.loginURL = () => OrganizationMapper.loginURL();
    this.logoutURL = () => OrganizationMapper.logoutURL();

  });
