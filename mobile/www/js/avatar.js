angular.module('starter.controllers')

.controller('AvatarRemoteControlCtrl', function($scope, $stateParams, $log, $window, Settings,
        LumenStomp) {
    var settings = Settings.getSettings();

    $scope.client = null;
    $scope.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    $scope.motionAllowed = settings.motionAllowed || false;
    $scope.joints = [
        // Head
        {id: 'HeadYaw'},
        {id: 'HeadPitch'},
        // RArm
        {id: 'RShoulderRoll'},
        {id: 'RShoulderPitch'},
        {id: 'RElbowYaw'},
        {id: 'RElbowRoll'},
        {id: 'RWristYaw'},
        {id: 'RHand'},
        // LArm
        {id: 'LShoulderRoll'},
        {id: 'LShoulderPitch'},
        {id: 'LElbowYaw'},
        {id: 'LElbowRoll'},
        {id: 'LWristYaw'},
        {id: 'LHand'},
        // RLeg
        {id: 'RHipPitch'},
        {id: 'RHipRoll'},
        {id: 'RKneePitch'},
        {id: 'RAnklePitch'},
        {id: 'RAnkleRoll'},
        // LLeg
        {id: 'LHipYawPitch'},
        {id: 'LHipPitch'},
        {id: 'LHipRoll'},
        {id: 'LKneePitch'},
        {id: 'LAnklePitch'},
        {id: 'LAnkleRoll'}
    ];
    $scope.leds = [
        {id: 'FaceLeds'},
        {id: 'AllLeds'},
    ];
    $scope.actingScripts = [
        {id: 'GOOD_BYE'},
        {id: 'PHOTO_POSE'},
        {id: 'DANCE_GANGNAM'},
        {id: 'SING_MANUK'},
        {id: 'SING_UPTOWN'},
    ];
    $scope.locales = [
        {id: 'en-US', name: 'English (US)'},
        {id: 'en-UK', name: 'English (UK)'},
        {id: 'en-AU', name: 'English (Australia)'},
        {id: 'id-ID', name: 'Indonesian'},
        {id: 'ar-SA', name: 'Arabic'}
    ];
    $scope.emotionKinds = [
        {id: 'NEUTRAL', name: 'Neutral'},
        {id: 'JOY', name: 'Joy'},
        {id: 'ANGER', name: 'Anger'},
        {id: 'SADNESS', name: 'Sadness'}
    ];
    $scope.form = {
        avatarId: 'nao1',
        audioVolume: 0.8,
        // Speech
        speech: {
            synthesis: {
                inLanguage: $scope.locales[0],
                emotionKind: $scope.emotionKinds[0],
                object: "Hello I am Arkan Lumen from Bandung Institute of Technology. What can I help you?",
            }
        },
        // Audio
        audio: {
            contentUrl: 'file:///home/nao/gangnam.mp3',
            recordDuration: 5.0,
        },
        // Actor
        actor: {
            actingScript: $scope.actingScripts[2]
        },
        // Motion
        speed: 0.7,
        moveTo: {
            backDistance: -0.1,
            rightDistance: 0,
            turnCcwDeg: 0
        },
        interpolateAngle: {
            joint: $scope.joints[0],
            targetCcwDeg: 0, // HeadYaw Range: -85 (right)..85 (left) degrees
            duration: 3, // seconds
        },
        leds: {
            led: $scope.leds[0],
            color: '#ff0000',
            intensity: 1.0,
            duration: 3.0, // seconds
        }
    };

    // Avatar
    $scope.switchAvatar = function() {
        LumenStomp.unsubscribeAll();
        // RecordAudio
        LumenStomp.subscribe('/topic/avatar.' + $scope.form.avatarId + '.audio.in', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
            document.getElementById('recorded').src = msg.contentUrl;
            $scope.replayRecorded();
        });
        // Speech Recognition
        LumenStomp.subscribe('/topic/lumen.speech.recognition', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received recognized speech", msg);
            $scope.recognizedSpeech = msg;
        });
        // audio.out: AudioObject
        $scope.client.subscribe('/topic/avatar.' + $scope.form.avatarId + '.audio.out', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
            document.getElementById('played').src = msg.contentUrl;
            $scope.replayPlayed();
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

    // Speech Synthesis
    $scope.communicateAction = function() {
        var msg = {'@type': 'CommunicateAction', avatarId: $scope.form.avatarId,
            inLanguage: $scope.form.speech.synthesis.inLanguage.id,
            emotionKind: $scope.form.speech.synthesis.emotionKind.id,
            object: $scope.form.speech.synthesis.object};
        $log.info('Speech Synthesis', msg, JSON.stringify(msg));
        $scope.client.send('/topic/lumen.speech.synthesis',
            {"reply-to": '/temp-queue/lumen.speech.synthesis'}, JSON.stringify(msg));
    };

    // Audio
    $scope.changeVolume = function() {
        var msg = {'@type': 'AudioVolume', volume: $scope.form.audioVolume};
        $log.info('Remote Control', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.command'}, JSON.stringify(msg));
    };
    $scope.playAudio = function() {
        var msg = {
            '@type': 'AudioObject',
            contentUrl: $scope.form.audio.contentUrl
        };
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.audio.out',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.audio.out'}, JSON.stringify(msg));
    };
    $scope.stopAudio = function() {
        var msg = {
            '@type': 'StopAudio',
        };
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.audio',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.audio'}, JSON.stringify(msg));
    };
    $scope.playAudioData = function() {
        var audioFileEl = document.getElementById('audioFile');
        // {"webkitRelativePath":"","lastModified":1373040168000,"lastModifiedDate":"2013-07-05T16:02:48.000Z","name":"Sate Tegal Balibul3.jpg","type":"image/jpeg","size":42082}
        var audioFile = audioFileEl.files[0];
        $log.debug('Reading...', audioFileEl, audioFileEl.files, audioFile, JSON.stringify(audioFile));
        // ImageObject: name, contentType, contentUrl, contentSize, width, height, uploadDate, dateCreated, dateModified, datePublished
        var reader = new FileReader();
        reader.onloadend = function() {
            if (audioFile.size > 128 * 1024) {
                $window.alert('Audio file too large! Must be < 128 KB for JavaScript');
            } else {
                var msg = {
                    '@type': 'AudioObject',
                    name: audioFile.name,
                    contentType: audioFile.type,
                    contentSize: audioFile.size,
                    dateModified: audioFile.lastModifiedDate,
                    contentUrl: reader.result
                };
                $log.info('Playing audio', msg.name, '(', msg.contentSize, 'bytes)');
                $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.audio.out',
                    {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.audio.out'}, JSON.stringify(msg));
            }
        };
        reader.readAsDataURL(audioFile);
    };
    $scope.recordAudio = function() {
        var msg = {
            '@type': 'RecordAudio',
            duration: $scope.form.audio.recordDuration,
        };
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.audio',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.audio'}, JSON.stringify(msg));
    };
    $scope.replayRecorded = function() {
        var recordedEl = document.getElementById('recorded');
        $log.info('Playing recorded ', recordedEl, 'seconds ...');
        recordedEl.play();
    };
    $scope.replayPlayed = function() {
        var playedEl = document.getElementById('played');
        $log.info('Playing played ', playedEl, 'seconds ...');
        playedEl.play();
    };

    // Actor
    $scope.act = function() {
        var msg = {
            '@type': 'ActingPerformance',
            script: $scope.form.actor.actingScript.id
        };
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.acting',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.acting'}, JSON.stringify(msg));
    };

    // Motion
    $scope.wakeUp = function() {
        var wakeMsg = {'@type': 'WakeUp'};
        $log.info('Remote Control', wakeMsg, JSON.stringify(wakeMsg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.command'}, JSON.stringify(wakeMsg));
    };
    $scope.rest = function() {
        var restMsg = {'@type': 'Rest'};
        $log.info('Remote Control', restMsg, JSON.stringify(restMsg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.command'}, JSON.stringify(restMsg));
    };
    $scope.changePosture = function(postureId) {
        var msg = {'@type': 'PostureChange', postureId: postureId, speed: $scope.form.speed};
        $log.info('Remote Control', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.command'}, JSON.stringify(msg));
    };

    $scope.moveTo = function() {
        var msg = {
            '@type': "MoveTo",
            'backDistance': $scope.form.moveTo.backDistance,
            'rightDistance': $scope.form.moveTo.rightDistance,
            'turnCcwDeg': $scope.form.moveTo.turnCcwDeg
        };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.command'}, JSON.stringify(msg));
    };

    $scope.jointInterpolateAngle = function() {
        var msg = {
            '@type': "JointInterpolateAngle",
            jointId: $scope.form.interpolateAngle.joint.id,
            targetCcwDeg: $scope.form.interpolateAngle.targetCcwDeg,
            duration: $scope.form.interpolateAngle.duration
        };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.command'}, JSON.stringify(msg));
    };

    // LEDs
    $scope.ledsOn = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'ON',
            names: [$scope.form.leds.led.id],
            duration: $scope.form.leds.duration,
            intensity: $scope.form.leds.intensity,
            color: $scope.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    $scope.ledsOff = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'OFF',
            names: [$scope.form.leds.led.id],
            duration: $scope.form.leds.duration,
            intensity: $scope.form.leds.intensity,
            color: $scope.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    $scope.ledsFade = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'FADE',
            names: [$scope.form.leds.led.id],
            duration: $scope.form.leds.duration,
            intensity: $scope.form.leds.intensity,
            color: $scope.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    $scope.ledsFadeRgb = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'FADE_RGB',
            names: [$scope.form.leds.led.id],
            duration: $scope.form.leds.duration,
            intensity: $scope.form.leds.intensity,
            color: $scope.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    $scope.ledsRandomEyes = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'RANDOM_EYES',
            names: [$scope.form.leds.led.id],
            duration: $scope.form.leds.duration,
            intensity: $scope.form.leds.intensity,
            color: $scope.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    $scope.ledsRasta = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'RASTA',
            names: [$scope.form.leds.led.id],
            duration: $scope.form.leds.duration,
            intensity: $scope.form.leds.intensity,
            color: $scope.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.' + $scope.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + $scope.form.avatarId + '.leds'}, JSON.stringify(msg));
    };

})
.controller('AvatarInstrumentsCtrl', function($scope, $stateParams, $log, LumenStomp, Settings) {
    $scope.messages = [];
    $scope.form = {
        avatarId: 'nao1'
    };
    $scope.client = null;

    // Avatar
    $scope.switchAvatar = function() {
        LumenStomp.unsubscribeAll();

        /*$scope.client.subscribe('/topic/avatar.' + $scope.form.avatarId + '.camera.main', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.image = exchange;
        });*/
        $scope.client.subscribe('/topic/avatar.' + $scope.form.avatarId + '.data.joint', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.joint = exchange;
        });
        $scope.client.subscribe('/topic/avatar.' + $scope.form.avatarId + '.data.sonar', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('sonar ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.sonar = exchange;
        });
        $scope.client.subscribe('/topic/avatar.' + $scope.form.avatarId + '.data.tactile', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('tactile ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.tactile = exchange;
        });
        $scope.client.subscribe('/topic/avatar.' + $scope.form.avatarId + '.data.battery', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('battery ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.battery = exchange;
        });
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

});
