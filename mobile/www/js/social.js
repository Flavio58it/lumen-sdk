angular.module('starter.controllers')

.controller('SocialMonitorCtrl', function($scope, $stateParams, $log, $ionicScrollDelegate, ngstomp, Settings) {
    $scope.posts = [];

//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.subscribe('/topic/lumen.*.social.perception', function(msg) {
            var post = JSON.parse(msg.body);
            $scope.posts.push(post);
            $ionicScrollDelegate.scrollBottom(true);
        });
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
})

.controller('SocialExpressCtrl', function($scope, $stateParams, $log, LumenStomp, Settings) {
    $scope.agentIds = ['arkan'];
    $scope.form = {
        agentId: 'arkan'
    };

    $scope.posts = [];
    $scope.networks = [
        {'id': 'facebook', 'name': 'Facebook'},
        {'id': 'twitter', 'name': 'Twitter'}
    ];
    $scope.post = {network: $scope.networks[0]};

    // Agent
    $scope.switchAgent = function() {
        LumenStomp.unsubscribeAll();
    };

    $scope.$on('$ionicView.enter', function() {
        LumenStomp.connect(function() {
            $scope.client = LumenStomp.getClient();
            $scope.switchAgent();
        });
    });
    $scope.$on('$ionicView.beforeLeave', function() {
        LumenStomp.disconnect();
    });

    $scope.submit = function() {
        $scope.communicateAction = {
            '@type': 'CommunicateAction',
            object: $scope.post.message,
        };
        var topic = 'lumen.arkan.' + $scope.post.network.id + '.timeline.out';
        $log.info('Posting to', topic, ':', JSON.stringify($scope.communicateAction));
        $scope.client.send('/topic/' + topic, {}, JSON.stringify($scope.communicateAction));
    };
});