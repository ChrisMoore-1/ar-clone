angular.module("ard", ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");


    $stateProvider
        .state("home", {
            url: "/",
            controller: "homeCtrl",
            templateUrl: "./html/home.html"
        })

        .state("team", {
        url: "/team",
        controller: "teamCtrl",
        templateUrl: "./html/team.html"

    })

      .state("clinic",{
        url: "/clinic",
        controller: "clinicCtrl",
        templateUrl: "./html/clinic.html"
    })

    .state("contact",{
      url: "/contactus",
      controller: "contactCtrl",
      templateUrl: "./html/contact.html"
  })

    .state("scheduling",{
      url: "/scheduling",
      controller: "schedulingCtrl",
      templateUrl: "./html/scheduling.html"
    })

    .state("signup",{
      url: "/signup",
      controller: "signupCtrl",
      templateUrl: "./html/signup.html"
    })
});
