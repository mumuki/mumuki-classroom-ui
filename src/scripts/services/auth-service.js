
angular
  .module('classroom')
  .service('Auth', function ($state, auth, store, jwtHelper) {

    const PERMISSION_REGEXP = /^(\*|.*\/\*)$/;

    this.profile = () => {
      return store.get('profile');
    }

    this.token = () => {
      return store.get('token');
    }

    this.isAdmin = () => {
      const permissions = this.profile().classroom.permissions;
      return _.some(permissions, (permission) => PERMISSION_REGEXP.test(permission));
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
