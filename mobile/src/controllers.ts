/// <reference path="../typings/main.d.ts"/>
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  var ctrl = this;
  // Form data for the login modal
  this.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    ctrl.modal = modal;
  });

  // Triggered in the login modal to close it
  this.closeLogin = function() {
    ctrl.modal.hide();
  };

  // Open the login modal
  this.login = function() {
    ctrl.modal.show();
  };

  // Perform the login action when the user submits the login form
  this.doLogin = function() {
    console.log('Doing login', ctrl.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      ctrl.closeLogin();
    }, 1000);
  };
})

.controller('SettingsCtrl', function($scope, $log, $window, Settings) {
    $scope.settings = Settings.getSettings();
    $scope.save = function() {
        Settings.setSettings($scope.settings);
        $window.alert('Settings saved.');
    };
    $scope.reset = function() {
        $scope.settings = Settings.getDefault();
    };
    $scope.resetLocal = function() {
        $scope.settings = {
            stompUri: 'ws://localhost:15674/ws',
            stompUser: 'guest',
            stompPassword: 'guest'
        };
    };
    $scope.resetWindow = function() {
        $scope.settings = {
            stompUri: 'ws://' + $window.location.hostname + ':15674/ws',
            stompUser: 'lumen',
            stompPassword: 'lumen'
        };
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
