angular.module('ard').service('contactService', function($http) {

  this.sendForm = function(form) {
    return $http ({
      method: 'POST',
      url: '/contactus',
      data: form
    });
  }

});
