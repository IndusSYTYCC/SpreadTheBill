
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

        .run(function ($ionicPlatform, $cordovaSQLite) {

            $ionicPlatform.ready(function () {

                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                if (window.cordova) {
                    db = $cordovaSQLite.openDB({name: "ING.db"}); //device
                } else {
                    db = window.openDatabase("ING.db", '1', 'ING', 1024 * 1024 * 100); // browser
                }

                $cordovaSQLite.execute(db, eventsQuery);
                $cordovaSQLite.execute(db, accountQuery);
                $cordovaSQLite.execute(db, friendsQuery);


            });
        })


        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })

                    .state('app.About', {
                        url: '/About',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/About.html'
                            }
                        }
                    })
                    .state('app.confirmEvent', {
                        url: '/templates/confirmEvent.html',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/confirmEvent.html',
                                controllers: 'EventCtrl'
                            }
                        }
                    })
                    .state('app.Account', {
                        url: '/Account',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/Account.html'
                            }
                        }
                    })
                    .state('app.Event', {
                        url: '/Event',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/Event.html',
                                controllers: 'EventCtrl'
                            }
                        }
                    })

                    .state('app.addEvent', {
                        url: '/addEvent',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/addEvent.html',
                                controllers: 'EventCtrl'
                            }
                        }
                    })
                    .state('app.Friends', {
                        url: '/Friends',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/Friends.html',
                                controllers: 'FriendsCtrl'
                            }
                        }
                    })

                    .state('app.Settings', {
                        url: '/Settings',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/Settings.html'
                            }
                        }
                    });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/Event');
        });
