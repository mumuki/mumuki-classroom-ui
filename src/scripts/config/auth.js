
angular
  .module('classroom')
  .run((auth) => auth.hookEvents())
  .config((authProvider) => {
    authProvider.init({
      domain: 'mumuki.auth0.com',

      // Production
      // clientID: 'A9wTU8c04tdkFktmWjCXZxnnnNFC3J0S',

      // Local
      clientID: 'WNmivh61DufjPRhuNZpa10J3LcxbbJmN'
    });
  });
