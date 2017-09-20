
angular
  .module('classroom')
  .provider('OrganizationMapper', function (CONFIG) {

    let location;

    this.current = () => {
      return this.organizationMappers[CONFIG.organizationMappingMode];
    }

    const tenantizedURL = (URL, tenant) => {
      const [protocol, host] = URL.split('://');
      return `${protocol}://${tenant}.${host}`;
    }

    const withOrigin = (callback_uri) => `?origin=${encodeURIComponent(callback_uri)}`

    const redirectURL = (tenant = '') => {
      const protocol = location.protocol();
      const host = location.host();
      const port = location.port();
      const portString = port ? `:${port}` : '';
      const path = _.isEmpty(tenant) ? '' : `/${tenant}`;
      return `${protocol}://${host}${portString}/#${path}/home`;
    }

    const invitationURL = (code) => `${CONFIG.laboratory.url}/join/${code}`

    this.organizationMappers = {

      subdomain: {

        tenant() {
          return location.host().split('.')[0];
        },

        laboratoryURL() {
          return tenantizedURL(CONFIG.laboratory.url, this.tenant());
        },

        classroomApiURL() {
          return tenantizedURL(CONFIG.classroom.url, this.tenant());
        },

        bibliothecaApiURL() {
          return CONFIG.bibliotheca.url;
        },

        loginURL() {
          return `${this.classroomApiURL()}/login${withOrigin(location.absUrl())}`
        },

        logoutURL() {
          return `${this.classroomApiURL()}/logout${withOrigin(redirectURL())}`
        },

        invitationURL(code) {
          return invitationURL(code);
        },

        stateUrl() {
          return '';
        }

      },

      path: {

        tenant() {
          return location.url().split('/')[1];
        },

        laboratoryURL() {
          return `${CONFIG.laboratory.url}/${this.tenant()}`;
        },

        classroomApiURL() {
          return `${CONFIG.classroom.url}/${this.tenant()}`;
        },

        bibliothecaApiURL() {
          return CONFIG.bibliotheca.url;
        },

        loginURL() {
          return `${CONFIG.classroom.url}/login${withOrigin(location.absUrl())}`
        },

        logoutURL() {
          return `${CONFIG.classroom.url}/logout${withOrigin(redirectURL(this.tenant()))}`
        },

        invitationURL(code) {
          return invitationURL(code);
        },

        stateUrl() {
          return '/:tenant';
        }

      }
    }

    this.$get = ($location) => {
      location = $location;
      return this.current();
    }

  });
