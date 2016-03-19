angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});

            // Form data for the login modal
            $scope.loginData = {};

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function () {
                $scope.modal.hide();
            };

            // Open the login modal
            $scope.login = function () {
                $scope.modal.show();
            };

            // Perform the login action when the user submits the login form
            $scope.doLogin = function () {
                console.log('Doing login', $scope.loginData);

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function () {
                    $scope.closeLogin();
                }, 1000);
            };
        })

        .controller('EventCtrl', function ($scope,$ionicPopup, $location, $cordovaSQLite) {
            $scope.Event = {};
            $scope.events = [];

            $scope.friends = [
                {id: 1, lastname: 'Dupont', name: 'Thibaud'},
                {id: 2, title: 'Leclerc', name: 'Arnauld'}
            ];

            $scope.addEvent = function () {
                $location.path('/app/addEvent');
            }

            $scope.insertEvent = function () {
                var query = "INSERT INTO EVENTS (NAME,DESCRIPTION,PLACE,OWNER,FRIENDS,SOLDE)\n\
                    VALUES (?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query, [$scope.Event.name, $scope.Event.description, $scope.Event.place, 0, 0, $scope.Event.solde]).then(function (res) {
                }, function (err) {
                });
                $location.path('/app/Event');
                $scope.refrechEvents();
            }
            
             $scope.deleteEvent = function (id) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete event',
                    template: 'Do you want to delete ?'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        db.transaction(function (tx) {
                            tx.executeSql('UPDATE EVENTS SET IS_DELETE = 1 WHERE EVENT_ID = ?', [id]);
                        });
                        $scope.refrechEvents();
                    } else {
                    }
                });

            };

            $scope.refrechEvents = function () {
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM EVENTS WHERE IS_DELETE = 0', [], function (tx, results) {
                        var len = results.rows.length;
                        for (var i = 0; i < len; i++) {

                            $scope.events.push({
                                id: results.rows.item(i).EVENT_ID,
                                title: results.rows.item(i).NAME,
                                description: results.rows.item(i).DESCRIPTION,
                                place:results.rows.item(i).PLACE,
                                owner:results.rows.item(i).OWNER
                            });
                            $scope.$apply();
                        }
                    });
                })
                $scope.events = [];
            };
            $scope.refrechEvents();



        })

        .controller('FriendsCtrl', function ($scope,$http) {
            $scope.friends = [
                {id: 1, lastname: 'Dupont', name: 'Thibaud'},
                {id: 2, title: 'Leclerc', name: 'Arnauld'}
            ];
          
        })
