angular.module("ard").service("signupService", function($http) {

this.sendForm = function (user) {
  return $http.post("/submitForm", user).then(function(response){
    return response
  })
}


});
