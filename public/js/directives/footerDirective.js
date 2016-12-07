angular.module("ard").directive("footerDirective", function() {
    return {
        restrict: "EA",
        templateUrl: "./html/footer.html",
        scope: {
        navigation: "="
        }
}
});
