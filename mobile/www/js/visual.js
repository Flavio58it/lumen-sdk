angular.module('starter.controllers')

.controller('VisualCameraCtrl', function($scope, $stateParams, $log, ngstomp, Settings, LumenStomp) {
    $scope.imageObject = null;
    $scope.bottomImageObject = null;
    $scope.recognizeds = [];
    $scope.client = null;
    $scope.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    $scope.form = {
        avatarId: 'nao1'
    };

    // Avatar
    $scope.switchAvatar = function() {
        LumenStomp.unsubscribeAll();
        LumenStomp.subscribe('/topic/avatar.' + avatarId + '.camera.main', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.imageObject = imageObject;
            $log.debug('Got main ImageObject', imageObject);
        });
        LumenStomp.subscribe('/topic/avatar.' + avatarId + '.camera.bottom', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.bottomImageObject = imageObject;
            $log.debug('Got bottom ImageObject', imageObject);
        });
        LumenStomp.subscribe('/topic/lumen.arkan.face.recognition', function(msg) {
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
        $log.info('Subscriptions:', LumenStomp.getSubscriptions());
    };

    $scope.$on('$ionicView.enter', function() {
        LumenStomp.connect(function() {
            $scope.client = LumenStomp.getClient();
            $scope.switchAvatar();
        });
    });
    $scope.$on('$ionicView.leave', function() {
        LumenStomp.disconnect();
    });
})

.controller('ObjectRecognitionCtrl', function($scope, $stateParams, $log, ngstomp, Settings, LumenStomp) {
    $scope.imageObject = null;
    $scope.bottomImageObject = null;
    $scope.recognizeds = [];
    $scope.client = null;
    $scope.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    $scope.form = {
        avatarId: 'nao1'
    };

    // Avatar
    $scope.switchAvatar = function() {
        LumenStomp.unsubscribeAll();
        /*LumenStomp.subscribe('/topic/avatar.' + avatarId + '.camera.main', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.imageObject = imageObject;
            $log.debug('Got main ImageObject', imageObject);
        });
        LumenStomp.subscribe('/topic/avatar.' + avatarId + '.camera.bottom', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.bottomImageObject = imageObject;
            $log.debug('Got bottom ImageObject', imageObject);
        });*/
        $scope.client.subscribe('/topic/lumen.visual.hogobj.recognition', function(msg) {
            var recognizeds = JSON.parse(msg.body);
			$log.debug('Received RecognizedObjects', recognizeds);
            $scope.recognizeds = recognizeds;
        });
        $log.info('Subscriptions:', LumenStomp.getSubscriptions());
    };

    $scope.$on('$ionicView.enter', function() {
        LumenStomp.connect(function() {
            $scope.client = LumenStomp.getClient();
            $scope.switchAvatar();
        });
    });
    $scope.$on('$ionicView.leave', function() {
        LumenStomp.disconnect();
    });

	$scope.sendMockRecognizedObjects = function() {
		var recognizedObjects = {
			"@type": "RecognizedObjects",
			"hasPosition": true,
			"hasDistance": false,
			"hasYaw": false,
			"trashes": [
				{
					"@type": "RecognizedObject",
					"topPosition": {"@type": "Vector2", "x": 45, "y": 70},
					"bottomPosition": null
				},
				{
					"@type": "RecognizedObject",
					"topPosition": null,
					"bottomPosition": {"@type": "Vector2", "x": 98, "y": 120}
				}
			],
			"trashCans": [
				{
					"@type": "RecognizedObject",
					"topPosition": null,
					"bottomPosition": {"@type": "Vector2", "x": 118, "y": 20}
				}
			]
		};
		$log.debug('Sending RecognizedObjects', recognizedObjects);
		$scope.client.send('/topic/lumen.visual.hogobj.recognition',
			{}, JSON.stringify(recognizedObjects));
	};
});
