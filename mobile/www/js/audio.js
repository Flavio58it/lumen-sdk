angular.module('starter.controllers')

.controller('AudioMonitorCtrl', function($scope, $stateParams, $log, $window, Settings, LumenStomp) {
    $scope.form = {
    };

    $scope.client = null;
    $scope.$on('$ionicView.enter', function() {
        LumenStomp.connect(function() {
            $scope.client = LumenStomp.getClient();
            // audio.out: AudioObject
            LumenStomp.subscribe('/topic/avatar.*.audio.out', function(exchange) {
                var msg = JSON.parse(exchange.body);
                $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
                document.getElementById('played').src = msg.contentUrl;
                $scope.replayPlayed();
            });
        });
    });
    $scope.$on('$ionicView.leave', function() {
        LumenStomp.disconnect();
    });

    // Audio
    $scope.replayPlayed = function() {
        var playedEl = document.getElementById('played');
        $log.info('Playing played ', playedEl, 'seconds ...');
        playedEl.play();
    };

});
