angular.module('library', ['ngRoute'])

// .value('fbURL', 'https://ng-projects-list.firebaseio.com/')
// .service('fbRef', function(fbURL) {
//  return new Firebase(fbURL)
// })
// .service('fbAuth', function($q, $firebase, $firebaseAuth, fbRef) {
//  var auth;
//  return function () {
//      if (auth) return $q.when(auth);
//      var authObj = $firebaseAuth(fbRef);
//      if (authObj.$getAuth()) {
//        return $q.when(auth = authObj.$getAuth());
//      }
//      var deferred = $q.defer();
//      authObj.$authAnonymously().then(function(authData) {
//          auth = authData;
//          deferred.resolve(authData);
//      });
//      return deferred.promise;
//  }
// })

// .service('Projects', function($q, $firebase, fbRef, fbAuth, projectListValue) {
//  var self = this;
//  this.fetch = function () {
//    if (this.projects) return $q.when(this.projects);
//    return fbAuth().then(function(auth) {
//      var deferred = $q.defer();
//      var ref = fbRef.child('projects-fresh/' + auth.auth.uid);
//      var $projects = $firebase(ref);
//      ref.on('value', function(snapshot) {
//        if (snapshot.val() === null) {
//          $projects.$set(projectListValue);
//        }
//        self.projects = $projects.$asArray();
//        deferred.resolve(self.projects);
//      });

//      //Remove projects list when no longer needed.
//      ref.onDisconnect().remove();
//      return deferred.promise;
//    });
//  };
// })

.config(function($routeProvider, $locationProvider) {
//  var resolveProjects = {
//    projects: function (Projects) {
//      return Projects.fetch();
//    }
//  };

$locationProvider.hashPrefix('!');
var itemsList = [];
 $routeProvider
  .when('/', {
    controller:'LandingPageController as itemsList',
    templateUrl:'app/view/list.html',
    //resolve: resolveProjects
  })
  .when('/contact', {
    controller:'ContactController as contact',
    templateUrl:'app/view/contact.html'
  })
   .otherwise({
     redirectTo:'/'
   });
})

.controller('LandingPageController', 
  [ 
  function() {
  var itemsList = this;
  console.log('Landing page controller')
    itemsList.showIt = false;

  itemsList.toggleDiv = function() {
    itemsList.showIt = !itemsList.showIt;
  }
}])

.controller('ContactController', 
  [ 
  function() {
  var contact = this;
  console.log('contact controller')
}])


.service('ApiService', [
  function() {

  }
])

;