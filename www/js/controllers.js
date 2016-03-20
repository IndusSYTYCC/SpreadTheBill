angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope, $location) {
            $scope.eventNotif = function () {
                $location.path('/app/eventNotif');
            }
        })

        .controller('EventCtrl', function ($scope, $cordovaSQLite, $ionicPopup, $location, $cordovaCamera, $cordovaSQLite, $ionicPlatform) {
            $scope.data = {};
            $scope.connect = function () {
                var myPopup = $ionicPopup.show({
                    template: 'Entrez votre login <input type="text" ng-model="data.userLogin">   <br> Entrez votre mot de passe  <input type="password" ng-model="data.Password" > ',
                    title: 'Connexion : ',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'}, {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.userLogin) {
                                    e.preventDefault();
                                } else {
                                    return $scope.data;
                                }
                            }
                        }
                    ]
                });
                myPopup.then(function (res) {
                    if (res.userLogin == 'admin' && res.Password == 'admin') {
                        console.log('Password is ok');
                        $scope.data.userLogin = '';
                        $scope.data.Password = '';
                        $scope.ouvrirMenu();
                    } else {
                        console.log('Password erreur');
                        $scope.data.userLogin = '';
                        $scope.data.Password = '';
                    }
                })
            }
            //$scope.connect(); permet de run le mot de passe

            $scope.Event = {};
            $scope.events = [];
            $scope.friends = [
                {id: 1, lastname: 'Dupont', name: 'Thibaud'},
                {id: 2, lastname: 'Leclerc', name: 'Arnauld'}
            ];


            $scope.refrechFriends = function () {
                /*$ionicPlatform.ready(function () {*/
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM FRIENDS JOIN ACCOUNT WHERE FRIENDS.ACCOUNT_ID = 0 AND FRIENDS.FRIEND_ACCOUNT = ACCOUNT.ACCOUNT_ID', [], function (tx, results) {
                        var len = results.rows.length;
                        for (var i = 0; i < len; i++) {
                            $scope.friends.push({
                                id: results.rows.item(i).ACCOUNT_ID,
                                lastname: results.rows.item(i).LASTNAME,
                                name: results.rows.item(i).NAME,
                                balance: results.rows.item(i).BALANCE
                            });
                            $scope.$apply();
                        }
                    });
                })
                $scope.friends = [];
                /*})*/
            }
            $scope.refrechFriends();

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

            function GetIdentity(imageUri) {
                var params = {
                    subscriptionkey: '4cef9e19e86a4be4ac471bb58c1cf9ca',
                    analyzesAge: "true",
                    analyzesGender: "true",
                    analyzesSmile: "true"
                };

                var uploadURI = 'https://api.projectoxford.ai/face/v0/detections?' + $.param(params);
                var imageURI = imageUri; // the retrieved URI of the file on the file system, e.g. using navigator.camera.getPicture()     

                var options = new FileUploadOptions();
                options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                options.mimeType = "application/octet-stream";
                // options.headers = {}; // use this if you need additional headers

                var ft = new FileTransfer();
                ft.upload(imageURI, uploadURI, function(r) {
                    alert(JSON.stringify(r));
                }, function(error) {
                    alert("An error has occurred:" + JSON.stringify(error));
                }, options)
            }

        })


        .controller('FriendsCtrl', function ($scope, $cordovaSQLite, $http) {
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
            $scope.addFriend = function (account) {

                var query = "INSERT INTO ACCOUNT (NAME,LASTNAME,BALANCE)\n\
                    VALUES (?,?,?)";
                $cordovaSQLite.execute(db, query, [account.AccountId, account.AccountId, account.Balance]).then(function (res) {
                }, function (err) {
                    alert('erreur 1');
                });
                var query2 = "INSERT INTO FRIENDS (ACCOUNT_ID,FRIEND_ACCOUNT)\n\
                    VALUES (0,(SELECT MAX(ACCOUNT_ID) FROM ACCOUNT))";
                $cordovaSQLite.execute(db, query2, []).then(function (res) {
                }, function (err) {
                    alert('erreur 2');
                });
            }

        })

