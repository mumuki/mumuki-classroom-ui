
angular
  .module('classroom')
  .service('Auth', function ($state, $location, auth, store, jwtHelper) {

    const subdomain = $location.host().split('classroom')[0].replace(/[.]$/, '');

    const adminRegex = new RegExp(`^(\\\*|\\\*\\\/\\\*|${subdomain}\\\/\\\*)$`);
    const teacherRegex = new RegExp(`^(\\\*|${subdomain})$`);

    this.profile = () => {
      return store.get('profile');
    }

    this.token = () => {
      return store.get('token');
    }

    this.isAdmin = () => {
      const permissions = this.profile().classroom.permissions.split(':');
      return _.some(permissions, (permission) => adminRegex.test(permission));
    }

    this.isTeacher = () => {
      const permissions = this.profile().classroom.permissions.split(':');
      return _.some(permissions, (permission) => teacherRegex.test(permission.split('/')[0]));
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
