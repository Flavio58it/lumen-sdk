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

.controller('FaceRecognitionCtrl', function($scope, $stateParams, $log) {
    $scope.imageObject = null;
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
