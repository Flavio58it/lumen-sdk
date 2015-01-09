angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('FaceRecognitionCtrl', function($scope, $stateParams, $log, ngstomp) {
    $scope.imageObject = null;

    var stompUri = 'http://localhost:15674/stomp';
    $log.info('Stomp connecting to', stompUri);
    $scope.client = ngstomp(stompUri);
    $scope.client.connect('guest', 'guest', function() {
        $log.info('Stomp connected to', stompUri);
    }, function(err) {
        $log.error('Stomp cannot connect:', err);
    }, '/');
    $scope.testStomp = function() {
        var imageObject = {
            '@type': 'ImageObject',
            name: 'wajah1.jpg',
            contentType: 'image/jpeg',
            contentSize: 3385,
            dateModified: "2015-01-09T07:33:07.000Z",
            contentUrl: "data:image/jpeg;base64,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"
        };
        $log.info('ImageObject', imageObject, JSON.stringify(imageObject));
        $scope.client.send('/topic/lumen.arkan.camera.stream', {}, JSON.stringify(imageObject));
    };
    $scope.loadImage = function() {
        var imageFileEl = document.getElementById('imageFile');
        // {"webkitRelativePath":"","lastModified":1373040168000,"lastModifiedDate":"2013-07-05T16:02:48.000Z","name":"Sate Tegal Balibul3.jpg","type":"image/jpeg","size":42082}
        var imageFile = imageFileEl.files[0];
        $log.debug('Reading...', imageFileEl, imageFileEl.files, imageFile, JSON.stringify(imageFile));
        // ImageObject: name, contentType, contentUrl, contentSize, width, height, uploadDate, dateCreated, dateModified, datePublished
        var reader = new FileReader();
        reader.onloadend = function() {
            $scope.$apply(function() {
                $scope.imageObject = {
                    '@type': 'ImageObject',
                    name: imageFile.name,
                    contentType: imageFile.type,
                    contentSize: imageFile.size,
                    dateModified: imageFile.lastModifiedDate,
                    contentUrl: reader.result
                };
                $log.info('ImageObject', $scope.imageObject);
            });
        };
        reader.readAsDataURL(imageFile);
    };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
