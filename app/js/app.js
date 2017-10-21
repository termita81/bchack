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
    controller:'HomeController as home',
    templateUrl:'app/view/home.html',
    //resolve: resolveProjects
  })
  .when('/location', {
    controller:'LocationController as location',
    templateUrl:'app/view/location.html'
  })
  .when('/auth', {
    controller:'AuthController as auth',
    templateUrl:'app/view/auth.html'
  })
  .when('/transaction', {
    controller:'TransactionController as transaction',
    templateUrl:'app/view/transaction.html'
  })
  .when('/user', {
    controller:'UserController as user',
    templateUrl:'app/view/user.html'
  })
   .otherwise({
     redirectTo:'/'
   });
})

.controller('HomeController', 
  [ 'ApiService',
  function(apiService) {
  var home = this;
  var locations = [];
  home.searchLocation = null;
  home.searchDimension = null;

  home.searchLocations = function() {
    apiService.searchLocations()
    .then(
      function(result) { 
        if (result.data) {
          console.log(result.data)
          home.locations = result.data.filter(function(o) {
            return (!home.searchDimension || o.totalSize >= home.searchDimension)
            && (!home.searchLocation || o.locale == home.searchLocation);
          })
        }})
      };

  home.totalSize = function(sizeText) {
    return parseInt(sizeText)
  }

  home.searchLocations();
}])

.controller('LocationController', 
[ 'ApiService',
function(apiService) {
  var location = this;
  var locations = [];
  var currentItem = {};
  var showEditor = false;
  apiService.searchLocations()
  .then(
    function(result) { 
      if (result.data) {
        location.locations = result.data.filter(function(o) {
          return o.owner.substr(o.owner.search(/#.*$/) + 1) == 'provider@test.com';
        })
      }})
}])

.controller('AuthController', 
[ 'ApiService',
function(apiService) {
  var auth = this;
  console.log('auth')
}])

.controller('TransactionController', 
[ 'ApiService',
function(apiService) {
  var transaction = this;
  console.log('transaction')
}])

.controller('UserController', 
[ 'ApiService',
function(apiService) {
  var user = this;
  console.log('user')
}])


.service('ApiService', [ '$http',
  function($http) {
    var rootUrl = 'http://168.1.144.102:31090/api/';

    this.searchLocations = function() {
      var url = rootUrl + 'StorageLocation';
      return $http.get(url);
    }
    this.signIn = function() {
      console.log('signIn')
    }
    this.signIn = function() {
      console.log('signIn')
    }
    this.signIn = function() {
      console.log('signIn')
    }
    this.signIn = function() {
      console.log('signIn')
    }
    this.signIn = function() {
      console.log('signIn')
    }
    this.signIn = function() {
      console.log('signIn')
    }
  }
])

;
