angular.module('starter.controllers', ['chart.js'])

        .controller('AppCtrl', function ($scope, $location) {
            $scope.eventNotif = function () {
                $location.path('/app/eventNotif');
            }
        })

        .controller('EventDetCtrl', function ($http, $scope, $cordovaSQLite, $ionicPopup, $location, $cordovaCamera, $cordovaSQLite, $ionicPlatform) {
            $scope.transaction = [];
            $http({method: 'GET', url: "https://ingsytycc.azurewebsites.net/odata/AccountTransactions?$filter=PartyId eq '56f39c0d889d4f701e04221fc3c0ee9625e2cbac1ff574f712df8fe2957f7859'"})
                    .success(function (data, status, headers, config) {
                        $scope.transaction = data.value;
                        console.log($scope.transaction);
                    })
                    .error(function (data, status, headers, config) {
                        return {"status": false};
                    });
        })

        .controller('EventCtrl', function ($http, $scope, $cordovaSQLite, $ionicPopup, $location, $cordovaCamera, $cordovaSQLite, $ionicPlatform) {
            $scope.showConfirm = function (smile) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Event Confirmation',
                    template: smile
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        console.log('You are sure');
                    } else {
                        console.log('You are not sure');
                    }
                });
            };

            $scope.confirmPhoto = function (path) {
                //pour utilisée avec telephone, il faut changer l'url par (path)
                $http({
                    'url': "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,smile",
                    'dataType': "json",
                    'host': "api.projectoxford.ai",
                    'method': "POST",
                    'data': {
                        "url": path
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": "aa56d1ab6487475b84dee752531f44b2",
                    }

                }).success(function (response) {
                    $scope.response = response;

                    var tauxDeSatisfaction = $scope.response[0].faceAttributes.smile * 100;
                    console.log(tauxDeSatisfaction);
                    if (tauxDeSatisfaction > 30) {
                        $scope.showConfirm('You smile');
                    } else {
                        $scope.showConfirm('You are sad');
                    }


                }).error(function (error) {
                    $scope.error = error;
                });
            }

            $scope.data = {};
            $scope.labels = ["6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
            $scope.data = [
                [200, 180, 130, 100, 50, 20]
            ];
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
            $scope.friends = [];

            $scope.eventDetails = function () {
                $location.path('/app/eventDetails');
            }

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
            $scope.MaxEvent = function () {
                /*$ionicPlatform.ready(function () {*/
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM EVENTS WHERE EVENT_ID = (SELECT MAX(EVENT_ID) FROM EVENTS)', [], function (tx, results) {
                        var len = results.rows.length;
                        for (var i = 0; i < len; i++) {
                            $scope.varA = results.rows.item(i).NAME;
                            $scope.varB = results.rows.item(i).PLACE;
                            $scope.varC = results.rows.item(i).DESCRIPTION;
                            $scope.varD = results.rows.item(i).SOLDE;
                            $scope.$apply();
                        }
                    });
                })
            }
            $scope.sendEvent = function () {
                $location.path('/app/Event');

            }
            $scope.MaxEvent();

            $scope.confirmEvent = function () {
                $scope.insertEvent();
                $location.path('/app/confirmEvent');
            }


            $scope.insertEvent = function () {
                var query = "INSERT INTO EVENTS (NAME,DESCRIPTION,PLACE,OWNER,FRIENDS,SOLDE)\n\
            VALUES (?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query, [$scope.Event.name, $scope.Event.description, $scope.Event.place, 0, 0, $scope.Event.solde]).then(function (res) {
                }, function (err) {
                });
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


            $scope.idPhoto = 0;
            $scope.urls = [{id: 0, url: "http://imagesmtv-a.akamaihd.net/uri/mgid:ao:image:mtv.com:27361?quality=0.8&format=jpg&width=300&height=300&matte=true&matteColor=0xd9d9d9"},
                {id: 1, url: "http://img2.rnkr-static.com/list_img/18858/298858/C300/bill-clinton-isms-bill-clinton-gaffes-and-funny-quotes.jpg"}];

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


                $scope.idPhoto = ($scope.idPhoto + 1) % 2;

                $cordovaCamera.getPicture(options).then(function (imageData) {
                    //$scope.imgURI = "data:image/jpeg;base64," + imageData;
                    $scope.imgURI = $scope.urls[$scope.idPhoto].url;
                    $scope.confirmPhoto($scope.imgURI);
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            }


        })


        .controller('FriendsCtrl', function ($scope, $cordovaSQLite, $http) {
            $scope.friends = [
                {id: 1, lastname: 'Dupont', name: 'Thibaud'},
                {id: 2, title: 'Leclerc', name: 'Arnauld'}
            ];
            $scope.donner = [];



            $http({method: 'GET', url: "http://ingsytycc.azurewebsites.net/odata/Accounts?$filter=PartyId ne '56f39c0d889d4f701e04221fc3c0ee9625e2cbac1ff574f712df8fe2957f7859' "})
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

        .controller('SettingsCtrl', function ($scope, $ionicPopup, $cordovaSQLite, $http) {
            $scope.changePass = function () {
                var myPopup = $ionicPopup.show({
                    template: 'Entrer your password <input type="password">   <br> Enter new password  <input type="password"  <br> Confirm new password  <input type="password" > ',
                    title: 'Change password : ',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'}, {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                return false;
                            }
                        }
                    ]
                });
            }
        })