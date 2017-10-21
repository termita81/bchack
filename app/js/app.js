angular.module('library', ['ngRoute'])

	.config(function ($routeProvider, $locationProvider) {

		$locationProvider.hashPrefix('!');
		var itemsList = [];
		$routeProvider
			.when('/', {
				controller: 'HomeController as home',
				templateUrl: 'app/view/home.html',
				//resolve: resolveProjects
			})
			.when('/location', {
				controller: 'LocationController as location',
				templateUrl: 'app/view/location.html'
			})
			.when('/signin', {
				controller: 'SignInController as signin',
				templateUrl: 'app/view/signin.html'
			})
			.when('/signout', {
				controller: 'SignOutController as signout',
				template: '<p>Please wait</p>'
			})
			.when('/signup', {
				controller: 'SignUpController as signup',
				templateUrl: 'app/view/signup.html'
			})
			.when('/transaction', {
				controller: 'TransactionController as transaction',
				templateUrl: 'app/view/transaction.html'
			})
			.when('/user', {
				controller: 'UserController as user',
				templateUrl: 'app/view/user.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	})

	.controller('HomeController', ['ApiService', 'UserService', '$location',
		function (apiService, userService, $location) {
			var home = this;
			var locations = [];
			home.searchLocation = null;
			home.searchDimension = null;
			home.suburbs = ["Melbourne CBD", "South Melbourne"];
			home.user = userService.getUser();

			home.searchLocations = function () {
				apiService.searchLocations()
					.then(
						function (result) {
							if (result.data) {
								home.locations = result.data.filter(function (o) {
									return (!home.searchDimension || o.totalSize >= home.searchDimension) &&
										(!home.searchLocation || o.locale == home.searchLocation);
								})
							}
						})
			};

			home.totalSize = function (sizeText) {
				return parseInt(sizeText)
			}

			home.request = function (locationId) {
				if (!home.user) {
					$location.path('/signin')
				}
				apiService.requestLocation(locationId)
					.then(function (result) {

					}, function (error) {

					})
			}
			home.ownLocation = function (location) {
				return home.user && home.user.email === location.owner.substr(location.owner.search(/#.*$/) + 1);
			}

			home.searchLocations();
		}
	])

	.controller('LocationController', ['ApiService', 'UserService', '$location',
		function (apiService, userService, $location) {
			var location = this;
			if (!userService.getUser()) {
				$location.path('/signin')
			}
			var locations = [];
			location.currentItem = {};
			location.showEditor = false;
			location.suburbs = ["Melbourne CBD", "South Melbourne"];

			function load() {
				apiService.searchLocations()
					.then(
						function (result) {
							if (result.data) {
								var email = userService.getUser().email;
								location.locations = result.data.filter(function (o) {
									return o.owner.substr(o.owner.search(/#.*$/) + 1) == email;
								})
							}
						})
			}

			location.add = function () {
				location.showEditor = true;
			}
			location.cancelAdd = function () {
				location.showEditor = false;
			}

			function newId() {
				return userService.getUser().email + Date.now()
			}
			location.submitNew = function () {
				apiService.createLocation({
						"$class": "org.stashit.StorageLocation",
						"storageLocationId": newId(),
						"costPerPeriod": location.currentItem.costPerPeriod,
						"minLendingPeriod": location.currentItem.minLendingPeriod,
						"periodType": "WEEK",
						"totalSize": location.currentItem.totalSize,
						"streetAddress": location.currentItem.streetAddress,
						"locale": location.currentItem.suburb,
						"owner": "resource:org.stashit.User#" + userService.getUser().email
					})
					.then(function (result) {
						location.currentItem = {};
						location.showEditor = false;
						load();
					})
			}

			location.totalSize = function (sizeText) {
				return parseInt(sizeText)
			}

			load();

			location.remove = function (location) {
				console.log(location)
				return apiService.removeLocation(location)
			}
		}
	])

	.controller('HeaderController', ['$rootScope', 'UserService',
		function ($rootScope, userService) {
			var header = this;
			$rootScope.$on("$routeChangeSuccess", function () {
				var navbar = $('#navbar.in');
				if (navbar && navbar.length == 1) {
					navbar[0].classList.remove('in')
				}
				header.user = userService.getUser();
				if (header.user) {
					$("#signin").hide();
					$("#user").show();
					$("#username").text(header.user.firstName + " " + header.user.lastName);
				} else {
					$("#signin").show();
					$("#user").hide();
				}
			})
		}
	])

	.controller('SignInController', ['UserService', '$location',
		function (userService, $location) {
			var signin = this;
			signin.email = null;
			signin.error = null;
			signin.signIn = function () {
				if (userService.getUser()) {
					$location.path('/')
				}
				userService.signIn(signin.email)
					.then(function (result) {
						signin.error = null;
						$location.path('/')
					}, function (error) {
						signin.error = 'Error signing in';
						alert('Error signing in!')
					})
			}
		}
	])

	.controller('SignOutController', ['UserService', '$location',
		function (userService, $location) {
			userService.signOut()
		}
	])

	.controller('SignUpController', ['UserService', '$location',
		function (userService, $location) {
			var signup = this;
			signup.email = null;
			signup.firstName = null;
			signup.lastName = null;
			signup.funds = null;
			signup.signup = function () {
				if (userService.getUser()) {
					$location.path('/')
				}
				var obj = {
					"$class": "org.stashit.User",
					email: signup.email,
					firstName: signup.firstName,
					lastName: signup.lastName,
					fundsAvailable: signup.funds
				}
				userService.signUp(obj)
					.then(function (newLogin) {
						userService.signIn(newLogin.email)
							.then(function (result) {
								signin.error = null;
								$location.path('/')
							}, function (error) {
								alert('Error signing in with newly created account!')
							})
					}, function (error) {
						alert('Error signing up!')
					})
			}
		}
	])

	.controller('TransactionController', ['UserService', '$location',
		function (userService, $location) {
			var transaction = this;
			if (!userService.getUser()) {
				$location.path('/signin')
			}
			transaction.load = function () {
				transaction.transactions = [{

				}, ];
			}
			transaction.load();
		}
	])

	.service('ApiService', ['$http',
		function ($http) {
			var rootUrl = 'http://168.1.144.102:31090/api/';

			this.searchLocations = function () {
				var url = rootUrl + 'StorageLocation';
				return $http.get(url);
			}
			this.createLocation = function (obj) {
				var url = rootUrl + 'StorageLocation';
				return $http.post(url, obj);
			}
			this.requestLocation = function () {
				var url = rootUrl + 'StorageLocation';
				return $http.get(url);
			}
			this.signIn = function (email) {
				var url = rootUrl + 'User/' + email;
				return $http.get(url);
			}
			this.signUp = function (obj) {
				var url = rootUrl + 'User'
				return $http.post(url, obj);
			}
			// this.signOut = function() {
			//   console.log('signOut')
			// }
			this.removeLocation = function(obj) {
				var url = rootUrl + 'StorageLocation/' + obj.storageLocationId
				return $http.delete(url)
			}
		}
	])

	.service('UserService', [
		'ApiService', '$location',
		function (apiService, $location) {
			var user = null;

			this.signIn = function (email) {
				return apiService.signIn(email)
					.then(function (result) {
						window.localStorage.setItem('user', JSON.stringify(result.data))
						// document.cookie = JSON.stringify(result.data)
						return user = result.data;
					})
			}
			this.signUp = function (obj) {
				return apiService.signUp(obj)
					.then(function (result) {
						return user = result.data;
					})
			}
			this.signOut = function () {
				user = null;
				window.localStorage.setItem('user', '')
				// document.cookie = "";
				$location.path('/')
			}
			this.getUser = function () {
				if (window.localStorage.getItem('user') != '') {
					user = JSON.parse(window.localStorage.getItem('user'))
					console.log(user)
					// user = JSON.parse(document.cookie)
				}
				return user;
			}
		}
	]);