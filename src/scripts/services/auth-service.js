
angular
  .module('classroom')
  .service('Auth', function ($state, $location, auth, store, jwtHelper, Domain) {

    const subdomain = Domain.tenant.replace(/[.]$/, '');

    const adminRegex = new RegExp(`^(\\\*|\\\*\\\/\\\*|${subdomain}\\\/\\\*)$`);
    const teacherRegex = new RegExp(`^(\\\*|${subdomain})$`);

    this.permissions = () => {
      return _.get(this.profile(), 'classroom.permissions', '').split(':');
    }

    this.profile = () => {
      return store.get('profile');
    }

    this.token = () => {
      return store.get('token');
    }

    this.isAdmin = () => {
      return _.some(this.permissions(), (p) => adminRegex.test(p));
    }

    this.isTeacher = () => {
      return _.some(this.permissions(), (p) => teacherRegex.test(p.split('/')[0]));
    }

    this.signin = () => {
      auth.signin({ authParams: { scope: 'openid app_metadata' } }, (profile, token) => {
        store.set('profile', profile);
        store.set('token', token);
      });
    };

    this.signout = () => {
      auth.signout();
      store.remove('token');
      store.remove('profile');
      $state.go('classroom.home');
    };

    this.isLoggedIn = () => {
      return auth.isAuthenticated;
    };

    this.isTokenExpired = () => {
      return _.isEmpty(this.token()) || jwtHelper.isTokenExpired(this.token());
    };

    this.authenticate = () => {
      auth.authenticate(this.profile(), this.token());
    };

    this.authenticateIfPossible = () => {
      if(!this.isTokenExpired() && !this.isLoggedIn()) {
        this.authenticate();
      }
    }

  });
