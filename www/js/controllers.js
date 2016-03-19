angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope) {

        })

        .controller('EventCtrl', function ($scope, $ionicPopup, $location, $cordovaCamera, $cordovaSQLite, $ionicPlatform) {
            $scope.Event = {};
            $scope.events = [];
            $scope.friends = [
                {id: 1, lastname: 'Dupont', name: 'Thibaud'},
                {id: 2, title: 'Leclerc', name: 'Arnauld'}
            ];

            $scope.addEvent = function () {
                $location.path('/app/addEvent');


            }
            $scope.confirmEvent = function () {
                $location.path('/app/confirmEvent');


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
            }


            $scope.refrechEvents = function () {
                /*$ionicPlatform.ready(function () {*/
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM EVENTS WHERE IS_DELETE = 0', [], function (tx, results) {
                        var len = results.rows.length;
                        for (var i = 0; i < len; i++) {

                            $scope.events.push({
                                id: results.rows.item(i).EVENT_ID,
                                title: results.rows.item(i).NAME,
                                description: results.rows.item(i).DESCRIPTION,
                                place: results.rows.item(i).PLACE,
                                owner: results.rows.item(i).OWNER
                            });
                            $scope.$apply();
                        }
                    });
                })
                $scope.events = [];
                /*})*/
            }
            $scope.refrechEvents();


            $scope.takePicture = function () {
                var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            }

        })


        .controller('FriendsCtrl', function ($scope, $http) {
            $scope.friends = [
                {id: 1, lastname: 'Dupont', name: 'Thibaud'},
                {id: 2, title: 'Leclerc', name: 'Arnauld'}
            ];
            $scope.donner = [];
            $http({method: 'GET', url: 'http://ingsytycc.azurewebsites.net/odata/Accounts'})
                    .success(function (data, status, headers, config) {
                        $scope.donner = data.value;
                console.log($scope.donner);
                    })
                    .error(function (data, status, headers, config) {
                        return {"status": false};
                    });
                    
            
        })

