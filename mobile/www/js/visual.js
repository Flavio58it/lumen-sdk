angular.module('starter.controllers')

.controller('VisualCameraCtrl', function($scope, $stateParams, $log, ngstomp, Settings) {
    $scope.imageObject = null;
    $scope.bottomImageObject = null;
    $scope.recognizeds = [];

//    var stompUri = 'http://167.205.66.130:15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.subscribe('/topic/avatar.nao1.camera.main', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.imageObject = imageObject;
            $log.debug('Got main ImageObject', imageObject);
        });
        $scope.client.subscribe('/topic/avatar.nao1.camera.bottom', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.bottomImageObject = imageObject;
            $log.debug('Got bottom ImageObject', imageObject);
        });
        $scope.client.subscribe('/topic/lumen.arkan.face.recognition', function(msg) {
            var recognized = JSON.parse(msg.body);
            if (recognized.index == 0) {
                $scope.recognizeds = [];
            }
            recognized.cssStyle = {
                left: recognized.minPoint.x + 'px',
                top: recognized.minPoint.y + 'px'
            };
            $scope.recognizeds.push(recognized);
        });
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
})

.controller('ObjectRecognitionCtrl', function($scope, $stateParams, $log, ngstomp, Settings) {
    $scope.imageObject = null;
    $scope.bottomImageObject = null;
    $scope.recognizeds = [];

//    var stompUri = 'http://167.205.66.130:15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        /*$scope.client.subscribe('/topic/avatar.nao1.camera.main', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.imageObject = imageObject;
            $log.debug('Got main ImageObject', imageObject);
        });
        $scope.client.subscribe('/topic/avatar.nao1.camera.bottom', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.bottomImageObject = imageObject;
            $log.debug('Got bottom ImageObject', imageObject);
        });*/
        $scope.client.subscribe('/topic/lumen.visual.hogobj.recognition', function(msg) {
            var recognized = JSON.parse(msg.body);
            $scope.recognized = recognized;
        });
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
});
