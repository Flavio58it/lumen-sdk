angular.module('starter.controllers')

.controller('AvatarRemoteControlCtrl', function($scope, $stateParams, $log, $window, Settings,
        LumenStomp) {
    var vm = this;
    var settings = Settings.getSettings();

    this.client = null;
    this.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    this.motionAllowed = settings.motionAllowed || false;
    this.joints = [
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
    this.leds = [
        {id: 'FaceLeds'},
        {id: 'AllLeds'},
    ];
    this.actingScripts = [
        {id: 'GOOD_BYE'},
        {id: 'PHOTO_POSE'},
        {id: 'DANCE_GANGNAM'},
        {id: 'SING_MANUK'},
        {id: 'SING_UPTOWN'},
    ];
    this.locales = [
        {id: 'en-US', name: 'English (US)'},
        {id: 'en-UK', name: 'English (UK)'},
        {id: 'en-AU', name: 'English (Australia)'},
        {id: 'id-ID', name: 'Indonesian'},
        {id: 'ar-SA', name: 'Arabic'}
    ];
    this.emotionKinds = [
        {id: 'NEUTRAL', name: 'Neutral'},
        {id: 'JOY', name: 'Joy'},
        {id: 'ANGER', name: 'Anger'},
        {id: 'SADNESS', name: 'Sadness'}
    ];
    this.form = {
        avatarId: 'nao1',
        audioVolume: 0.8,
        // Speech
        speech: {
            synthesis: {
                inLanguage: this.locales[0],
                emotionKind: this.emotionKinds[0],
                object: "Hello I am Arkan Lumen from Bandung Institute of Technology. What can I help you?",
            }
        },
        // Audio
        audio: {
            inLanguage: this.locales[3],
            contentUrl: 'file:///home/nao/gangnam.mp3',
            recordDuration: 5.0,
            usedForChat: true
        },
        // Actor
        actor: {
            actingScript: this.actingScripts[2]
        },
        // Motion
        speed: 0.7,
        moveTo: {
            backDistance: -0.1,
            rightDistance: 0,
            turnCcwDeg: 0
        },
        interpolateAngle: {
            joint: this.joints[0],
            targetCcwDeg: 0, // HeadYaw Range: -85 (right)..85 (left) degrees
            duration: 3, // seconds
        },
        leds: {
            led: this.leds[0],
            color: '#ff0000',
            intensity: 1.0,
            duration: 3.0, // seconds
        }
    };

    // Avatar
    this.switchAvatar = function() {
        LumenStomp.unsubscribeAll();
        // RecordAudio
        LumenStomp.subscribe('/topic/avatar.' + vm.form.avatarId + '.audio.in', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
            document.getElementById('recorded').src = msg.contentUrl;
            vm.replayRecorded();
        });
        // Speech Recognition
        LumenStomp.subscribe('/topic/lumen.speech.recognition', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received recognized speech", msg);
            vm.recognizedSpeech = msg;
        });
        // audio.out: AudioObject
        LumenStomp.subscribe('/topic/avatar.' + vm.form.avatarId + '.audio.out', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
            document.getElementById('played').src = msg.contentUrl;
            vm.replayPlayed();
        });
        $log.info('Subscriptions:', LumenStomp.getSubscriptions());
    };

    $scope.$on('$ionicView.enter', function() {
        LumenStomp.connect(function() {
            vm.client = LumenStomp.getClient();
            vm.switchAvatar();
        });
    });
    $scope.$on('$ionicView.leave', function() {
        LumenStomp.disconnect();
    });

    // Speech Synthesis
    this.communicateSynthesis = function() {
        var msg = {'@type': 'CommunicateAction', avatarId: vm.form.avatarId,
            inLanguage: vm.form.speech.synthesis.inLanguage.id,
            emotionKind: vm.form.speech.synthesis.emotionKind.id,
            object: vm.form.speech.synthesis.object,
            usedForSynthesis: true};
        $log.info('Speech Synthesis', msg, JSON.stringify(msg));
        vm.client.send('/topic/lumen.speech.synthesis',
            {"reply-to": '/temp-queue/lumen.speech.synthesis'}, JSON.stringify(msg));
    };
    this.communicateChat = function() {
        var msg = {'@type': 'CommunicateAction', avatarId: vm.form.avatarId,
            inLanguage: vm.form.speech.synthesis.inLanguage.id,
            emotionKind: vm.form.speech.synthesis.emotionKind.id,
            object: vm.form.speech.synthesis.object,
            usedForSynthesis: true};
        $log.info('chat.outbox+synthesis', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.chat.outbox',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.chat.outbox'},
            JSON.stringify(msg));
    };

    // Audio
    this.changeVolume = function() {
        var msg = {'@type': 'AudioVolume', volume: vm.form.audioVolume};
        $log.info('Remote Control', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command'}, JSON.stringify(msg));
    };
    this.playAudio = function() {
        var msg = {
            '@type': 'AudioObject',
            contentUrl: vm.form.audio.contentUrl
        };
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio.out',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio.out'}, JSON.stringify(msg));
    };
    this.stopAudio = function() {
        var msg = {
            '@type': 'StopAudio',
        };
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio'}, JSON.stringify(msg));
    };
    this.playAudioData = function() {
        var audioFileEl = document.getElementById('audioFile');
        // {"webkitRelativePath":"","lastModified":1373040168000,"lastModifiedDate":"2013-07-05T16:02:48.000Z","name":"Sate Tegal Balibul3.jpg","type":"image/jpeg","size":42082}
        var audioFile = audioFileEl.files[0];
        $log.debug('Reading...', audioFileEl, audioFileEl.files, audioFile, JSON.stringify(audioFile));
        // ImageObject: name, contentType, contentUrl, contentSize, width, height, uploadDate, dateCreated, dateModified, datePublished
        var reader = new FileReader();
        reader.onloadend = function() {
            var msg = {
                '@type': 'AudioObject',
                name: audioFile.name,
                contentType: audioFile.type,
                contentSize: audioFile.size,
                dateModified: audioFile.lastModifiedDate,
                contentUrl: reader.result
            };
            $log.info('Playing audio', msg.name, '(', msg.contentSize, 'bytes)');
            vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio.out',
                {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio.out'}, JSON.stringify(msg));
        };
        reader.readAsDataURL(audioFile);
    };
    this.recordAudioFromAvatar = function() {
        var msg = {
            '@type': 'RecordAudio',
            duration: vm.form.audio.recordDuration,
            inLanguage: vm.form.audio.inLanguage.id,
            usedForChat: vm.form.audio.usedForChat
        };
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio'}, JSON.stringify(msg));
    };
    this.sendRecordedMic = function() {
        var recordedFileEl = document.getElementById('recordedMic');
        var recordedFile = recordedFileEl.files[0];
        $log.debug('Reading...', recordedFileEl, recordedFileEl.files, recordedFile, JSON.stringify(recordedFile));
        var reader = new FileReader();
        reader.onloadend = function() {
            $scope.$apply(function() {
                var audioObject = {
                    '@type': 'AudioObject',
                    inLanguage: vm.form.audio.inLanguage.id,
                    name: recordedFile.name,
                    contentType: recordedFile.type,
                    contentSize: recordedFile.size,
                    dateModified: recordedFile.lastModifiedDate,
                    contentUrl: reader.result,
                    usedForChat: vm.form.audio.usedForChat
                };
                $log.info('AudioObject', audioObject, JSON.stringify(audioObject));
                vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio.in',
                    {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio.in'},
                    JSON.stringify(audioObject));
            });
        };
        reader.readAsDataURL(recordedFile);
    };
    this.replayRecorded = function() {
        var recordedEl = document.getElementById('recorded');
        $log.info('Playing recorded ', recordedEl, 'seconds ...');
        recordedEl.play();
    };
    this.replayPlayed = function() {
        var playedEl = document.getElementById('played');
        $log.info('Playing played ', playedEl, 'seconds ...');
        playedEl.play();
    };

    // Actor
    this.act = function() {
        var msg = {
            '@type': 'ActingPerformance',
            script: vm.form.actor.actingScript.id
        };
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.acting',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.acting'}, JSON.stringify(msg));
    };

    // Motion
    this.wakeUp = function() {
        var wakeMsg = {'@type': 'WakeUp'};
        $log.info('Remote Control', wakeMsg, JSON.stringify(wakeMsg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command'}, JSON.stringify(wakeMsg));
    };
    this.rest = function() {
        var restMsg = {'@type': 'Rest'};
        $log.info('Remote Control', restMsg, JSON.stringify(restMsg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command'}, JSON.stringify(restMsg));
    };
    this.changePosture = function(postureId) {
        var msg = {'@type': 'PostureChange', postureId: postureId, speed: vm.form.speed};
        $log.info('Remote Control', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command'}, JSON.stringify(msg));
    };

    this.moveTo = function() {
        var msg = {
            '@type': "MoveTo",
            'backDistance': vm.form.moveTo.backDistance,
            'rightDistance': vm.form.moveTo.rightDistance,
            'turnCcwDeg': vm.form.moveTo.turnCcwDeg
        };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command'}, JSON.stringify(msg));
    };

    this.jointInterpolateAngle = function() {
        var msg = {
            '@type': "JointInterpolateAngle",
            jointId: vm.form.interpolateAngle.joint.id,
            targetCcwDeg: vm.form.interpolateAngle.targetCcwDeg,
            duration: vm.form.interpolateAngle.duration
        };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command'}, JSON.stringify(msg));
    };

    // LEDs
    this.ledsOn = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'ON',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    this.ledsOff = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'OFF',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    this.ledsFade = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'FADE',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    this.ledsFadeRgb = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'FADE_RGB',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    this.ledsRandomEyes = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'RANDOM_EYES',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds'}, JSON.stringify(msg));
    };
    this.ledsRasta = function() {
        var msg = {
            '@type': 'LedOperation',
            kind: 'RASTA',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color,
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds',
            {"reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds'}, JSON.stringify(msg));
    };

})
.controller('AvatarInstrumentsCtrl', function($scope, $stateParams, $log, LumenStomp, Settings) {
    var vm = this;
    this.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    this.form = {
        avatarId: 'nao1'
    };
    this.client = null;

    // Avatar
    this.switchAvatar = function() {
        LumenStomp.unsubscribeAll();
        // reset all previous values
        this.joint = {};
        this.sonar = {};
        this.motion = {};
        this.robotpose = {};
        this.tactile = {};
        this.battery = {};

        /*LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.camera.main', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
//            this.messages.push(msg);
            exchange.body = msg;
//            this.messages.push(exchange);
            this.image = exchange;
        });*/
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.joint', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
//            this.messages.push(msg);
            exchange.body = msg;
//            this.messages.push(exchange);
            this.joint = exchange;
        });
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.sonar', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('sonar ', msg, JSON.stringify(msg));
//            this.messages.push(msg);
            exchange.body = msg;
//            this.messages.push(exchange);
            this.sonar = exchange;
        });

        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.motion', function(exchange) {
                    var msg = JSON.parse(exchange.body);
                    //$log.debug('motion ', msg, JSON.stringify(msg));
        //            this.messages.push(msg);
                    exchange.body = msg;
        //            this.messages.push(exchange);
                    this.motion = exchange;
                });

        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.robotpose', function(exchange) {
                    var msg = JSON.parse(exchange.body);
                    //$log.debug('robotpose ', msg, JSON.stringify(msg));
        //            this.messages.push(msg);
                    exchange.body = msg;
        //            this.messages.push(exchange);
                    this.robotpose = exchange;
                });

        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.tactile', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('tactile ', msg, JSON.stringify(msg));
//            this.messages.push(msg);
            exchange.body = msg;
//            this.messages.push(exchange);
            this.tactile = exchange;
        });
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.battery', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('battery ', msg, JSON.stringify(msg));
//            this.messages.push(msg);
            exchange.body = msg;
//            this.messages.push(exchange);
            this.battery = exchange;
        });
    };

    $scope.$on('$ionicView.enter', function(ev) {
        LumenStomp.connect(function() {
            vm.client = LumenStomp.getClient();
            vm.switchAvatar();
        });
    });
    $scope.$on('$ionicView.leave', function() {
        LumenStomp.disconnect();
    });

});
