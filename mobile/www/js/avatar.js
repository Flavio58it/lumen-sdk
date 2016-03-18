/// <reference path="../typings/main.d.ts"/>
angular.module('starter.controllers')
    .controller('AvatarRemoteControlCtrl', function ($scope, $stateParams, $log, $window, Settings, LumenStomp) {
    var vm = this;
    var settings = Settings.getSettings();
    this.client = null;
    this.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    this.motionAllowed = settings.motionAllowed || false;
    this.joints = [
        // Head
        { id: 'HeadYaw' },
        { id: 'HeadPitch' },
        // RArm
        { id: 'RShoulderRoll' },
        { id: 'RShoulderPitch' },
        { id: 'RElbowYaw' },
        { id: 'RElbowRoll' },
        { id: 'RWristYaw' },
        { id: 'RHand' },
        // LArm
        { id: 'LShoulderRoll' },
        { id: 'LShoulderPitch' },
        { id: 'LElbowYaw' },
        { id: 'LElbowRoll' },
        { id: 'LWristYaw' },
        { id: 'LHand' },
        // RLeg
        { id: 'RHipPitch' },
        { id: 'RHipRoll' },
        { id: 'RKneePitch' },
        { id: 'RAnklePitch' },
        { id: 'RAnkleRoll' },
        // LLeg
        { id: 'LHipYawPitch' },
        { id: 'LHipPitch' },
        { id: 'LHipRoll' },
        { id: 'LKneePitch' },
        { id: 'LAnklePitch' },
        { id: 'LAnkleRoll' }
    ];
    this.leds = [
        { id: 'FaceLeds' },
        { id: 'AllLeds' },
    ];
    this.actingScripts = [
        { id: 'GOOD_BYE' },
        { id: 'PHOTO_POSE' },
        { id: 'DANCE_GANGNAM' },
        { id: 'SING_MANUK' },
        { id: 'SING_UPTOWN' },
    ];
    this.locales = [
        { id: 'en-US', name: 'English (US)' },
        { id: 'en-UK', name: 'English (UK)' },
        { id: 'en-AU', name: 'English (Australia)' },
        { id: 'id-ID', name: 'Indonesian' },
        { id: 'ar-SA', name: 'Arabic' }
    ];
    this.emotionKinds = [
        { id: 'NEUTRAL', name: 'Neutral' },
        { id: 'JOY', name: 'Joy' },
        { id: 'ANGER', name: 'Anger' },
        { id: 'SADNESS', name: 'Sadness' }
    ];
    this.form = {
        avatarId: 'nao1',
        audioVolume: 0.8,
        // Speech
        speech: {
            synthesis: {
                inLanguage: this.locales[0],
                emotionKind: this.emotionKinds[0],
                object: "Hello I am Arkan Lumen from Bandung Institute of Technology. What can I help you?"
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
            targetCcwDeg: 0,
            duration: 3
        },
        leds: {
            led: this.leds[0],
            color: '#ff0000',
            intensity: 1.0,
            duration: 3.0
        }
    };
    // Avatar
    this.switchAvatar = function () {
        LumenStomp.unsubscribeAll();
        // RecordAudio
        LumenStomp.subscribe('/topic/avatar.' + vm.form.avatarId + '.audio.in', function (exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
            document.getElementById('recorded').src = msg.contentUrl;
            vm.replayRecorded();
        });
        // Speech Recognition
        LumenStomp.subscribe('/topic/lumen.speech.recognition', function (exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received recognized speech", msg);
            vm.recognizedSpeech = msg;
        });
        // audio.out: AudioObject
        LumenStomp.subscribe('/topic/avatar.' + vm.form.avatarId + '.audio.out', function (exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
            document.getElementById('played').src = msg.contentUrl;
            vm.replayPlayed();
        });
        $log.info('Subscriptions:', LumenStomp.getSubscriptions());
    };
    $scope.$on('$ionicView.enter', function () {
        LumenStomp.connect(function () {
            vm.client = LumenStomp.getClient();
            vm.switchAvatar();
        });
    });
    $scope.$on('$ionicView.beforeLeave', function () {
        LumenStomp.disconnect();
    });
    // Speech Synthesis
    this.communicateSynthesis = function () {
        var msg = { '@type': 'CommunicateAction', avatarId: vm.form.avatarId,
            inLanguage: vm.form.speech.synthesis.inLanguage.id,
            emotionKind: vm.form.speech.synthesis.emotionKind.id,
            object: vm.form.speech.synthesis.object,
            usedForSynthesis: true };
        $log.info('Speech Synthesis', msg, JSON.stringify(msg));
        vm.client.send('/topic/lumen.speech.synthesis', { "reply-to": '/temp-queue/lumen.speech.synthesis' }, JSON.stringify(msg));
    };
    this.communicateChat = function () {
        var msg = { '@type': 'CommunicateAction', avatarId: vm.form.avatarId,
            inLanguage: vm.form.speech.synthesis.inLanguage.id,
            emotionKind: vm.form.speech.synthesis.emotionKind.id,
            object: vm.form.speech.synthesis.object,
            usedForSynthesis: true };
        $log.info('chat.outbox+synthesis', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.chat.outbox', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.chat.outbox' }, JSON.stringify(msg));
    };
    // Audio
    this.changeVolume = function () {
        var msg = { '@type': 'AudioVolume', volume: vm.form.audioVolume };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command' }, JSON.stringify(msg));
    };
    this.playAudio = function () {
        var msg = {
            '@type': 'AudioObject',
            contentUrl: vm.form.audio.contentUrl
        };
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio.out', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio.out' }, JSON.stringify(msg));
    };
    this.stopAudio = function () {
        var msg = {
            '@type': 'StopAudio'
        };
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio' }, JSON.stringify(msg));
    };
    this.playAudioData = function () {
        var audioFileEl = document.getElementById('audioFile');
        // {"webkitRelativePath":"","lastModified":1373040168000,"lastModifiedDate":"2013-07-05T16:02:48.000Z","name":"Sate Tegal Balibul3.jpg","type":"image/jpeg","size":42082}
        var audioFile = audioFileEl.files[0];
        $log.debug('Reading...', audioFileEl, audioFileEl.files, audioFile, JSON.stringify(audioFile));
        // ImageObject: name, contentType, contentUrl, contentSize, width, height, uploadDate, dateCreated, dateModified, datePublished
        var reader = new FileReader();
        reader.onloadend = function () {
            var msg = {
                '@type': 'AudioObject',
                name: audioFile.name,
                contentType: audioFile.type,
                contentSize: audioFile.size,
                dateModified: audioFile.lastModifiedDate,
                contentUrl: reader.result
            };
            $log.info('Playing audio', msg.name, '(', msg.contentSize, 'bytes)');
            vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio.out', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio.out' }, JSON.stringify(msg));
        };
        reader.readAsDataURL(audioFile);
    };
    this.recordAudioFromAvatar = function () {
        var msg = {
            '@type': 'RecordAudio',
            duration: vm.form.audio.recordDuration,
            inLanguage: vm.form.audio.inLanguage.id,
            usedForChat: vm.form.audio.usedForChat
        };
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio' }, JSON.stringify(msg));
    };
    this.sendRecordedMic = function () {
        var recordedFileEl = document.getElementById('recordedMic');
        var recordedFile = recordedFileEl.files[0];
        $log.debug('Reading...', recordedFileEl, recordedFileEl.files, recordedFile, JSON.stringify(recordedFile));
        var reader = new FileReader();
        reader.onloadend = function () {
            $scope.$apply(function () {
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
                vm.client.send('/topic/avatar.' + vm.form.avatarId + '.audio.in', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.audio.in' }, JSON.stringify(audioObject));
            });
        };
        reader.readAsDataURL(recordedFile);
    };
    this.replayRecorded = function () {
        var recordedEl = document.getElementById('recorded');
        $log.info('Playing recorded ', recordedEl, 'seconds ...');
        recordedEl.play();
    };
    this.replayPlayed = function () {
        var playedEl = document.getElementById('played');
        $log.info('Playing played ', playedEl, 'seconds ...');
        playedEl.play();
    };
    // Actor
    this.act = function () {
        var msg = {
            '@type': 'ActingPerformance',
            script: vm.form.actor.actingScript.id
        };
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.acting', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.acting' }, JSON.stringify(msg));
    };
    // Motion
    this.wakeUp = function () {
        var wakeMsg = { '@type': 'WakeUp' };
        $log.info('Remote Control', wakeMsg, JSON.stringify(wakeMsg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command' }, JSON.stringify(wakeMsg));
    };
    this.rest = function () {
        var restMsg = { '@type': 'Rest' };
        $log.info('Remote Control', restMsg, JSON.stringify(restMsg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command' }, JSON.stringify(restMsg));
    };
    this.changePosture = function (postureId) {
        var msg = { '@type': 'PostureChange', postureId: postureId, speed: vm.form.speed };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command' }, JSON.stringify(msg));
    };
    this.moveTo = function () {
        var msg = {
            '@type': "MoveTo",
            'backDistance': vm.form.moveTo.backDistance,
            'rightDistance': vm.form.moveTo.rightDistance,
            'turnCcwDeg': vm.form.moveTo.turnCcwDeg
        };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command' }, JSON.stringify(msg));
    };
    this.jointInterpolateAngle = function () {
        var msg = {
            '@type': "JointInterpolateAngle",
            jointId: vm.form.interpolateAngle.joint.id,
            targetCcwDeg: vm.form.interpolateAngle.targetCcwDeg,
            duration: vm.form.interpolateAngle.duration
        };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.command', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.command' }, JSON.stringify(msg));
    };
    // LEDs
    this.ledsOn = function () {
        var msg = {
            '@type': 'LedOperation',
            kind: 'ON',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds' }, JSON.stringify(msg));
    };
    this.ledsOff = function () {
        var msg = {
            '@type': 'LedOperation',
            kind: 'OFF',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds' }, JSON.stringify(msg));
    };
    this.ledsFade = function () {
        var msg = {
            '@type': 'LedOperation',
            kind: 'FADE',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds' }, JSON.stringify(msg));
    };
    this.ledsFadeRgb = function () {
        var msg = {
            '@type': 'LedOperation',
            kind: 'FADE_RGB',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds' }, JSON.stringify(msg));
    };
    this.ledsRandomEyes = function () {
        var msg = {
            '@type': 'LedOperation',
            kind: 'RANDOM_EYES',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds' }, JSON.stringify(msg));
    };
    this.ledsRasta = function () {
        var msg = {
            '@type': 'LedOperation',
            kind: 'RASTA',
            names: [vm.form.leds.led.id],
            duration: vm.form.leds.duration,
            intensity: vm.form.leds.intensity,
            color: vm.form.leds.color
        };
        $log.info('LED', msg, JSON.stringify(msg));
        vm.client.send('/topic/avatar.' + vm.form.avatarId + '.leds', { "reply-to": '/temp-queue/avatar.' + vm.form.avatarId + '.leds' }, JSON.stringify(msg));
    };
})
    .controller('AvatarInstrumentsCtrl', function ($scope, $stateParams, $log, LumenStomp, Settings) {
    var vm = this;
    this.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    this.form = {
        avatarId: 'nao1'
    };
    this.client = null;
    // Avatar
    this.switchAvatar = function () {
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
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.joint', function (exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
            //            this.messages.push(msg);
            exchange.body = msg;
            //            this.messages.push(exchange);
            this.joint = exchange;
        });
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.sonar', function (exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('sonar ', msg, JSON.stringify(msg));
            //            this.messages.push(msg);
            exchange.body = msg;
            //            this.messages.push(exchange);
            this.sonar = exchange;
        });
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.motion', function (exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('motion ', msg, JSON.stringify(msg));
            //            this.messages.push(msg);
            exchange.body = msg;
            //            this.messages.push(exchange);
            this.motion = exchange;
        });
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.robotpose', function (exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('robotpose ', msg, JSON.stringify(msg));
            //            this.messages.push(msg);
            exchange.body = msg;
            //            this.messages.push(exchange);
            this.robotpose = exchange;
        });
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.tactile', function (exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('tactile ', msg, JSON.stringify(msg));
            //            this.messages.push(msg);
            exchange.body = msg;
            //            this.messages.push(exchange);
            this.tactile = exchange;
        });
        LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.data.battery', function (exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('battery ', msg, JSON.stringify(msg));
            //            this.messages.push(msg);
            exchange.body = msg;
            //            this.messages.push(exchange);
            this.battery = exchange;
        });
    };
    $scope.$on('$ionicView.enter', function (ev) {
        LumenStomp.connect(function () {
            vm.client = LumenStomp.getClient();
            vm.switchAvatar();
        });
    });
    $scope.$on('$ionicView.beforeLeave', function () {
        LumenStomp.disconnect();
    });
});

//# sourceMappingURL=data:application/json;base64,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QUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsbURBQW1EO1lBQy9ELHNDQUFzQztZQUMxQixRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNoQywyQ0FBMkM7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQWUsRUFBRSxVQUFTLFFBQVE7WUFDM0YsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsbURBQW1EO1lBQy9ELHNDQUFzQztZQUMxQixRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNoQywyQ0FBMkM7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUM7SUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFVBQVMsRUFBRTtRQUN0QyxVQUFVLENBQUMsT0FBTyxDQUFDO1lBQ2YsRUFBRSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFO1FBQ2pDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImF2YXRhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL21haW4uZC50c1wiLz5cclxuYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnKVxyXG5cclxuLmNvbnRyb2xsZXIoJ0F2YXRhclJlbW90ZUNvbnRyb2xDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRsb2csICR3aW5kb3csIFNldHRpbmdzLFxyXG4gICAgICAgIEx1bWVuU3RvbXApIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2YXIgc2V0dGluZ3MgPSBTZXR0aW5ncy5nZXRTZXR0aW5ncygpO1xyXG5cclxuICAgIHRoaXMuY2xpZW50ID0gbnVsbDtcclxuICAgIHRoaXMuYXZhdGFySWRzID0gWyduYW8xJywgJ25hbzInLFxyXG4gICAgICAgICdhbmltZTEnLCAnYW5pbWUyJywgJ2FuaW1lMycsICdhbmltZTQnLCAnYW5pbWU1JywgJ2FuaW1lNicsICdhbmltZTcnLCAnYW5pbWU4JywgJ2FuaW1lOScsICdhbmltZTEwJ107XHJcbiAgICB0aGlzLm1vdGlvbkFsbG93ZWQgPSBzZXR0aW5ncy5tb3Rpb25BbGxvd2VkIHx8IGZhbHNlO1xyXG4gICAgdGhpcy5qb2ludHMgPSBbXHJcbiAgICAgICAgLy8gSGVhZFxyXG4gICAgICAgIHtpZDogJ0hlYWRZYXcnfSxcclxuICAgICAgICB7aWQ6ICdIZWFkUGl0Y2gnfSxcclxuICAgICAgICAvLyBSQXJtXHJcbiAgICAgICAge2lkOiAnUlNob3VsZGVyUm9sbCd9LFxyXG4gICAgICAgIHtpZDogJ1JTaG91bGRlclBpdGNoJ30sXHJcbiAgICAgICAge2lkOiAnUkVsYm93WWF3J30sXHJcbiAgICAgICAge2lkOiAnUkVsYm93Um9sbCd9LFxyXG4gICAgICAgIHtpZDogJ1JXcmlzdFlhdyd9LFxyXG4gICAgICAgIHtpZDogJ1JIYW5kJ30sXHJcbiAgICAgICAgLy8gTEFybVxyXG4gICAgICAgIHtpZDogJ0xTaG91bGRlclJvbGwnfSxcclxuICAgICAgICB7aWQ6ICdMU2hvdWxkZXJQaXRjaCd9LFxyXG4gICAgICAgIHtpZDogJ0xFbGJvd1lhdyd9LFxyXG4gICAgICAgIHtpZDogJ0xFbGJvd1JvbGwnfSxcclxuICAgICAgICB7aWQ6ICdMV3Jpc3RZYXcnfSxcclxuICAgICAgICB7aWQ6ICdMSGFuZCd9LFxyXG4gICAgICAgIC8vIFJMZWdcclxuICAgICAgICB7aWQ6ICdSSGlwUGl0Y2gnfSxcclxuICAgICAgICB7aWQ6ICdSSGlwUm9sbCd9LFxyXG4gICAgICAgIHtpZDogJ1JLbmVlUGl0Y2gnfSxcclxuICAgICAgICB7aWQ6ICdSQW5rbGVQaXRjaCd9LFxyXG4gICAgICAgIHtpZDogJ1JBbmtsZVJvbGwnfSxcclxuICAgICAgICAvLyBMTGVnXHJcbiAgICAgICAge2lkOiAnTEhpcFlhd1BpdGNoJ30sXHJcbiAgICAgICAge2lkOiAnTEhpcFBpdGNoJ30sXHJcbiAgICAgICAge2lkOiAnTEhpcFJvbGwnfSxcclxuICAgICAgICB7aWQ6ICdMS25lZVBpdGNoJ30sXHJcbiAgICAgICAge2lkOiAnTEFua2xlUGl0Y2gnfSxcclxuICAgICAgICB7aWQ6ICdMQW5rbGVSb2xsJ31cclxuICAgIF07XHJcbiAgICB0aGlzLmxlZHMgPSBbXHJcbiAgICAgICAge2lkOiAnRmFjZUxlZHMnfSxcclxuICAgICAgICB7aWQ6ICdBbGxMZWRzJ30sXHJcbiAgICBdO1xyXG4gICAgdGhpcy5hY3RpbmdTY3JpcHRzID0gW1xyXG4gICAgICAgIHtpZDogJ0dPT0RfQllFJ30sXHJcbiAgICAgICAge2lkOiAnUEhPVE9fUE9TRSd9LFxyXG4gICAgICAgIHtpZDogJ0RBTkNFX0dBTkdOQU0nfSxcclxuICAgICAgICB7aWQ6ICdTSU5HX01BTlVLJ30sXHJcbiAgICAgICAge2lkOiAnU0lOR19VUFRPV04nfSxcclxuICAgIF07XHJcbiAgICB0aGlzLmxvY2FsZXMgPSBbXHJcbiAgICAgICAge2lkOiAnZW4tVVMnLCBuYW1lOiAnRW5nbGlzaCAoVVMpJ30sXHJcbiAgICAgICAge2lkOiAnZW4tVUsnLCBuYW1lOiAnRW5nbGlzaCAoVUspJ30sXHJcbiAgICAgICAge2lkOiAnZW4tQVUnLCBuYW1lOiAnRW5nbGlzaCAoQXVzdHJhbGlhKSd9LFxyXG4gICAgICAgIHtpZDogJ2lkLUlEJywgbmFtZTogJ0luZG9uZXNpYW4nfSxcclxuICAgICAgICB7aWQ6ICdhci1TQScsIG5hbWU6ICdBcmFiaWMnfVxyXG4gICAgXTtcclxuICAgIHRoaXMuZW1vdGlvbktpbmRzID0gW1xyXG4gICAgICAgIHtpZDogJ05FVVRSQUwnLCBuYW1lOiAnTmV1dHJhbCd9LFxyXG4gICAgICAgIHtpZDogJ0pPWScsIG5hbWU6ICdKb3knfSxcclxuICAgICAgICB7aWQ6ICdBTkdFUicsIG5hbWU6ICdBbmdlcid9LFxyXG4gICAgICAgIHtpZDogJ1NBRE5FU1MnLCBuYW1lOiAnU2FkbmVzcyd9XHJcbiAgICBdO1xyXG4gICAgdGhpcy5mb3JtID0ge1xyXG4gICAgICAgIGF2YXRhcklkOiAnbmFvMScsXHJcbiAgICAgICAgYXVkaW9Wb2x1bWU6IDAuOCxcclxuICAgICAgICAvLyBTcGVlY2hcclxuICAgICAgICBzcGVlY2g6IHtcclxuICAgICAgICAgICAgc3ludGhlc2lzOiB7XHJcbiAgICAgICAgICAgICAgICBpbkxhbmd1YWdlOiB0aGlzLmxvY2FsZXNbMF0sXHJcbiAgICAgICAgICAgICAgICBlbW90aW9uS2luZDogdGhpcy5lbW90aW9uS2luZHNbMF0sXHJcbiAgICAgICAgICAgICAgICBvYmplY3Q6IFwiSGVsbG8gSSBhbSBBcmthbiBMdW1lbiBmcm9tIEJhbmR1bmcgSW5zdGl0dXRlIG9mIFRlY2hub2xvZ3kuIFdoYXQgY2FuIEkgaGVscCB5b3U/XCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEF1ZGlvXHJcbiAgICAgICAgYXVkaW86IHtcclxuICAgICAgICAgICAgaW5MYW5ndWFnZTogdGhpcy5sb2NhbGVzWzNdLFxyXG4gICAgICAgICAgICBjb250ZW50VXJsOiAnZmlsZTovLy9ob21lL25hby9nYW5nbmFtLm1wMycsXHJcbiAgICAgICAgICAgIHJlY29yZER1cmF0aW9uOiA1LjAsXHJcbiAgICAgICAgICAgIHVzZWRGb3JDaGF0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBBY3RvclxyXG4gICAgICAgIGFjdG9yOiB7XHJcbiAgICAgICAgICAgIGFjdGluZ1NjcmlwdDogdGhpcy5hY3RpbmdTY3JpcHRzWzJdXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBNb3Rpb25cclxuICAgICAgICBzcGVlZDogMC43LFxyXG4gICAgICAgIG1vdmVUbzoge1xyXG4gICAgICAgICAgICBiYWNrRGlzdGFuY2U6IC0wLjEsXHJcbiAgICAgICAgICAgIHJpZ2h0RGlzdGFuY2U6IDAsXHJcbiAgICAgICAgICAgIHR1cm5DY3dEZWc6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGludGVycG9sYXRlQW5nbGU6IHtcclxuICAgICAgICAgICAgam9pbnQ6IHRoaXMuam9pbnRzWzBdLFxyXG4gICAgICAgICAgICB0YXJnZXRDY3dEZWc6IDAsIC8vIEhlYWRZYXcgUmFuZ2U6IC04NSAocmlnaHQpLi44NSAobGVmdCkgZGVncmVlc1xyXG4gICAgICAgICAgICBkdXJhdGlvbjogMywgLy8gc2Vjb25kc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGVkczoge1xyXG4gICAgICAgICAgICBsZWQ6IHRoaXMubGVkc1swXSxcclxuICAgICAgICAgICAgY29sb3I6ICcjZmYwMDAwJyxcclxuICAgICAgICAgICAgaW50ZW5zaXR5OiAxLjAsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzLjAsIC8vIHNlY29uZHNcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEF2YXRhclxyXG4gICAgdGhpcy5zd2l0Y2hBdmF0YXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBMdW1lblN0b21wLnVuc3Vic2NyaWJlQWxsKCk7XHJcbiAgICAgICAgLy8gUmVjb3JkQXVkaW9cclxuICAgICAgICBMdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuYXVkaW8uaW4nLCBmdW5jdGlvbihleGNoYW5nZSkge1xyXG4gICAgICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShleGNoYW5nZS5ib2R5KTtcclxuICAgICAgICAgICAgJGxvZy5pbmZvKFwiUmVjZWl2ZWQgYXVkaW9cIiwgbXNnLm5hbWUsIG1zZy5jb250ZW50VHlwZSwgbXNnLmNvbnRlbnRTaXplLCAnYnl0ZXMnKTtcclxuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWNvcmRlZCcpIGFzIEhUTUxNZWRpYUVsZW1lbnQpLnNyYyA9IG1zZy5jb250ZW50VXJsO1xyXG4gICAgICAgICAgICB2bS5yZXBsYXlSZWNvcmRlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFNwZWVjaCBSZWNvZ25pdGlvblxyXG4gICAgICAgIEx1bWVuU3RvbXAuc3Vic2NyaWJlKCcvdG9waWMvbHVtZW4uc3BlZWNoLnJlY29nbml0aW9uJywgZnVuY3Rpb24oZXhjaGFuZ2UpIHtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IEpTT04ucGFyc2UoZXhjaGFuZ2UuYm9keSk7XHJcbiAgICAgICAgICAgICRsb2cuaW5mbyhcIlJlY2VpdmVkIHJlY29nbml6ZWQgc3BlZWNoXCIsIG1zZyk7XHJcbiAgICAgICAgICAgIHZtLnJlY29nbml6ZWRTcGVlY2ggPSBtc2c7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gYXVkaW8ub3V0OiBBdWRpb09iamVjdFxyXG4gICAgICAgIEx1bWVuU3RvbXAuc3Vic2NyaWJlKCcvdG9waWMvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5hdWRpby5vdXQnLCBmdW5jdGlvbihleGNoYW5nZSkge1xyXG4gICAgICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShleGNoYW5nZS5ib2R5KTtcclxuICAgICAgICAgICAgJGxvZy5pbmZvKFwiUmVjZWl2ZWQgYXVkaW9cIiwgbXNnLm5hbWUsIG1zZy5jb250ZW50VHlwZSwgbXNnLmNvbnRlbnRTaXplLCAnYnl0ZXMnKTtcclxuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZWQnKSBhcyBIVE1MTWVkaWFFbGVtZW50KS5zcmMgPSBtc2cuY29udGVudFVybDtcclxuICAgICAgICAgICAgdm0ucmVwbGF5UGxheWVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGxvZy5pbmZvKCdTdWJzY3JpcHRpb25zOicsIEx1bWVuU3RvbXAuZ2V0U3Vic2NyaXB0aW9ucygpKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAuY29ubmVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdm0uY2xpZW50ID0gTHVtZW5TdG9tcC5nZXRDbGllbnQoKTtcclxuICAgICAgICAgICAgdm0uc3dpdGNoQXZhdGFyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgICRzY29wZS4kb24oJyRpb25pY1ZpZXcuYmVmb3JlTGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBMdW1lblN0b21wLmRpc2Nvbm5lY3QoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNwZWVjaCBTeW50aGVzaXNcclxuICAgIHRoaXMuY29tbXVuaWNhdGVTeW50aGVzaXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbXNnID0geydAdHlwZSc6ICdDb21tdW5pY2F0ZUFjdGlvbicsIGF2YXRhcklkOiB2bS5mb3JtLmF2YXRhcklkLFxyXG4gICAgICAgICAgICBpbkxhbmd1YWdlOiB2bS5mb3JtLnNwZWVjaC5zeW50aGVzaXMuaW5MYW5ndWFnZS5pZCxcclxuICAgICAgICAgICAgZW1vdGlvbktpbmQ6IHZtLmZvcm0uc3BlZWNoLnN5bnRoZXNpcy5lbW90aW9uS2luZC5pZCxcclxuICAgICAgICAgICAgb2JqZWN0OiB2bS5mb3JtLnNwZWVjaC5zeW50aGVzaXMub2JqZWN0LFxyXG4gICAgICAgICAgICB1c2VkRm9yU3ludGhlc2lzOiB0cnVlfTtcclxuICAgICAgICAkbG9nLmluZm8oJ1NwZWVjaCBTeW50aGVzaXMnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgICAgIHZtLmNsaWVudC5zZW5kKCcvdG9waWMvbHVtZW4uc3BlZWNoLnN5bnRoZXNpcycsXHJcbiAgICAgICAgICAgIHtcInJlcGx5LXRvXCI6ICcvdGVtcC1xdWV1ZS9sdW1lbi5zcGVlY2guc3ludGhlc2lzJ30sIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuY29tbXVuaWNhdGVDaGF0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1zZyA9IHsnQHR5cGUnOiAnQ29tbXVuaWNhdGVBY3Rpb24nLCBhdmF0YXJJZDogdm0uZm9ybS5hdmF0YXJJZCxcclxuICAgICAgICAgICAgaW5MYW5ndWFnZTogdm0uZm9ybS5zcGVlY2guc3ludGhlc2lzLmluTGFuZ3VhZ2UuaWQsXHJcbiAgICAgICAgICAgIGVtb3Rpb25LaW5kOiB2bS5mb3JtLnNwZWVjaC5zeW50aGVzaXMuZW1vdGlvbktpbmQuaWQsXHJcbiAgICAgICAgICAgIG9iamVjdDogdm0uZm9ybS5zcGVlY2guc3ludGhlc2lzLm9iamVjdCxcclxuICAgICAgICAgICAgdXNlZEZvclN5bnRoZXNpczogdHJ1ZX07XHJcbiAgICAgICAgJGxvZy5pbmZvKCdjaGF0Lm91dGJveCtzeW50aGVzaXMnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgICAgIHZtLmNsaWVudC5zZW5kKCcvdG9waWMvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5jaGF0Lm91dGJveCcsXHJcbiAgICAgICAgICAgIHtcInJlcGx5LXRvXCI6ICcvdGVtcC1xdWV1ZS9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmNoYXQub3V0Ym94J30sXHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBBdWRpb1xyXG4gICAgdGhpcy5jaGFuZ2VWb2x1bWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbXNnID0geydAdHlwZSc6ICdBdWRpb1ZvbHVtZScsIHZvbHVtZTogdm0uZm9ybS5hdWRpb1ZvbHVtZX07XHJcbiAgICAgICAgJGxvZy5pbmZvKCdSZW1vdGUgQ29udHJvbCcsIG1zZywgSlNPTi5zdHJpbmdpZnkobXNnKSk7XHJcbiAgICAgICAgdm0uY2xpZW50LnNlbmQoJy90b3BpYy9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmNvbW1hbmQnLFxyXG4gICAgICAgICAgICB7XCJyZXBseS10b1wiOiAnL3RlbXAtcXVldWUvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5jb21tYW5kJ30sIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfTtcclxuICAgIHRoaXMucGxheUF1ZGlvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1zZyA9IHtcclxuICAgICAgICAgICAgJ0B0eXBlJzogJ0F1ZGlvT2JqZWN0JyxcclxuICAgICAgICAgICAgY29udGVudFVybDogdm0uZm9ybS5hdWRpby5jb250ZW50VXJsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2bS5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuYXVkaW8ub3V0JyxcclxuICAgICAgICAgICAge1wicmVwbHktdG9cIjogJy90ZW1wLXF1ZXVlL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuYXVkaW8ub3V0J30sIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuc3RvcEF1ZGlvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1zZyA9IHtcclxuICAgICAgICAgICAgJ0B0eXBlJzogJ1N0b3BBdWRpbycsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2bS5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuYXVkaW8nLFxyXG4gICAgICAgICAgICB7XCJyZXBseS10b1wiOiAnL3RlbXAtcXVldWUvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5hdWRpbyd9LCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnBsYXlBdWRpb0RhdGEgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYXVkaW9GaWxlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW9GaWxlJykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAvLyB7XCJ3ZWJraXRSZWxhdGl2ZVBhdGhcIjpcIlwiLFwibGFzdE1vZGlmaWVkXCI6MTM3MzA0MDE2ODAwMCxcImxhc3RNb2RpZmllZERhdGVcIjpcIjIwMTMtMDctMDVUMTY6MDI6NDguMDAwWlwiLFwibmFtZVwiOlwiU2F0ZSBUZWdhbCBCYWxpYnVsMy5qcGdcIixcInR5cGVcIjpcImltYWdlL2pwZWdcIixcInNpemVcIjo0MjA4Mn1cclxuICAgICAgICB2YXIgYXVkaW9GaWxlID0gYXVkaW9GaWxlRWwuZmlsZXNbMF07XHJcbiAgICAgICAgJGxvZy5kZWJ1ZygnUmVhZGluZy4uLicsIGF1ZGlvRmlsZUVsLCBhdWRpb0ZpbGVFbC5maWxlcywgYXVkaW9GaWxlLCBKU09OLnN0cmluZ2lmeShhdWRpb0ZpbGUpKTtcclxuICAgICAgICAvLyBJbWFnZU9iamVjdDogbmFtZSwgY29udGVudFR5cGUsIGNvbnRlbnRVcmwsIGNvbnRlbnRTaXplLCB3aWR0aCwgaGVpZ2h0LCB1cGxvYWREYXRlLCBkYXRlQ3JlYXRlZCwgZGF0ZU1vZGlmaWVkLCBkYXRlUHVibGlzaGVkXHJcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbXNnID0ge1xyXG4gICAgICAgICAgICAgICAgJ0B0eXBlJzogJ0F1ZGlvT2JqZWN0JyxcclxuICAgICAgICAgICAgICAgIG5hbWU6IGF1ZGlvRmlsZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGF1ZGlvRmlsZS50eXBlLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IGF1ZGlvRmlsZS5zaXplLFxyXG4gICAgICAgICAgICAgICAgZGF0ZU1vZGlmaWVkOiBhdWRpb0ZpbGUubGFzdE1vZGlmaWVkRGF0ZSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRVcmw6IHJlYWRlci5yZXN1bHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJGxvZy5pbmZvKCdQbGF5aW5nIGF1ZGlvJywgbXNnLm5hbWUsICcoJywgbXNnLmNvbnRlbnRTaXplLCAnYnl0ZXMpJyk7XHJcbiAgICAgICAgICAgIHZtLmNsaWVudC5zZW5kKCcvdG9waWMvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5hdWRpby5vdXQnLFxyXG4gICAgICAgICAgICAgICAge1wicmVwbHktdG9cIjogJy90ZW1wLXF1ZXVlL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuYXVkaW8ub3V0J30sIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoYXVkaW9GaWxlKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnJlY29yZEF1ZGlvRnJvbUF2YXRhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtc2cgPSB7XHJcbiAgICAgICAgICAgICdAdHlwZSc6ICdSZWNvcmRBdWRpbycsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiB2bS5mb3JtLmF1ZGlvLnJlY29yZER1cmF0aW9uLFxyXG4gICAgICAgICAgICBpbkxhbmd1YWdlOiB2bS5mb3JtLmF1ZGlvLmluTGFuZ3VhZ2UuaWQsXHJcbiAgICAgICAgICAgIHVzZWRGb3JDaGF0OiB2bS5mb3JtLmF1ZGlvLnVzZWRGb3JDaGF0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2bS5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuYXVkaW8nLFxyXG4gICAgICAgICAgICB7XCJyZXBseS10b1wiOiAnL3RlbXAtcXVldWUvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5hdWRpbyd9LCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnNlbmRSZWNvcmRlZE1pYyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByZWNvcmRlZEZpbGVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWNvcmRlZE1pYycpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgdmFyIHJlY29yZGVkRmlsZSA9IHJlY29yZGVkRmlsZUVsLmZpbGVzWzBdO1xyXG4gICAgICAgICRsb2cuZGVidWcoJ1JlYWRpbmcuLi4nLCByZWNvcmRlZEZpbGVFbCwgcmVjb3JkZWRGaWxlRWwuZmlsZXMsIHJlY29yZGVkRmlsZSwgSlNPTi5zdHJpbmdpZnkocmVjb3JkZWRGaWxlKSk7XHJcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF1ZGlvT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICdAdHlwZSc6ICdBdWRpb09iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5MYW5ndWFnZTogdm0uZm9ybS5hdWRpby5pbkxhbmd1YWdlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHJlY29yZGVkRmlsZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiByZWNvcmRlZEZpbGUudHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogcmVjb3JkZWRGaWxlLnNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU1vZGlmaWVkOiByZWNvcmRlZEZpbGUubGFzdE1vZGlmaWVkRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VXJsOiByZWFkZXIucmVzdWx0LFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZWRGb3JDaGF0OiB2bS5mb3JtLmF1ZGlvLnVzZWRGb3JDaGF0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgJGxvZy5pbmZvKCdBdWRpb09iamVjdCcsIGF1ZGlvT2JqZWN0LCBKU09OLnN0cmluZ2lmeShhdWRpb09iamVjdCkpO1xyXG4gICAgICAgICAgICAgICAgdm0uY2xpZW50LnNlbmQoJy90b3BpYy9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmF1ZGlvLmluJyxcclxuICAgICAgICAgICAgICAgICAgICB7XCJyZXBseS10b1wiOiAnL3RlbXAtcXVldWUvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5hdWRpby5pbid9LFxyXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGF1ZGlvT2JqZWN0KSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwocmVjb3JkZWRGaWxlKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnJlcGxheVJlY29yZGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlY29yZGVkRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVjb3JkZWQnKSBhcyBIVE1MTWVkaWFFbGVtZW50O1xyXG4gICAgICAgICRsb2cuaW5mbygnUGxheWluZyByZWNvcmRlZCAnLCByZWNvcmRlZEVsLCAnc2Vjb25kcyAuLi4nKTtcclxuICAgICAgICByZWNvcmRlZEVsLnBsYXkoKTtcclxuICAgIH07XHJcbiAgICB0aGlzLnJlcGxheVBsYXllZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBwbGF5ZWRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZWQnKSBhcyBIVE1MTWVkaWFFbGVtZW50O1xyXG4gICAgICAgICRsb2cuaW5mbygnUGxheWluZyBwbGF5ZWQgJywgcGxheWVkRWwsICdzZWNvbmRzIC4uLicpO1xyXG4gICAgICAgIHBsYXllZEVsLnBsYXkoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQWN0b3JcclxuICAgIHRoaXMuYWN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1zZyA9IHtcclxuICAgICAgICAgICAgJ0B0eXBlJzogJ0FjdGluZ1BlcmZvcm1hbmNlJyxcclxuICAgICAgICAgICAgc2NyaXB0OiB2bS5mb3JtLmFjdG9yLmFjdGluZ1NjcmlwdC5pZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdm0uY2xpZW50LnNlbmQoJy90b3BpYy9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmFjdGluZycsXHJcbiAgICAgICAgICAgIHtcInJlcGx5LXRvXCI6ICcvdGVtcC1xdWV1ZS9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmFjdGluZyd9LCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gTW90aW9uXHJcbiAgICB0aGlzLndha2VVcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB3YWtlTXNnID0geydAdHlwZSc6ICdXYWtlVXAnfTtcclxuICAgICAgICAkbG9nLmluZm8oJ1JlbW90ZSBDb250cm9sJywgd2FrZU1zZywgSlNPTi5zdHJpbmdpZnkod2FrZU1zZykpO1xyXG4gICAgICAgIHZtLmNsaWVudC5zZW5kKCcvdG9waWMvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5jb21tYW5kJyxcclxuICAgICAgICAgICAge1wicmVwbHktdG9cIjogJy90ZW1wLXF1ZXVlL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuY29tbWFuZCd9LCBKU09OLnN0cmluZ2lmeSh3YWtlTXNnKSk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5yZXN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlc3RNc2cgPSB7J0B0eXBlJzogJ1Jlc3QnfTtcclxuICAgICAgICAkbG9nLmluZm8oJ1JlbW90ZSBDb250cm9sJywgcmVzdE1zZywgSlNPTi5zdHJpbmdpZnkocmVzdE1zZykpO1xyXG4gICAgICAgIHZtLmNsaWVudC5zZW5kKCcvdG9waWMvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5jb21tYW5kJyxcclxuICAgICAgICAgICAge1wicmVwbHktdG9cIjogJy90ZW1wLXF1ZXVlL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuY29tbWFuZCd9LCBKU09OLnN0cmluZ2lmeShyZXN0TXNnKSk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5jaGFuZ2VQb3N0dXJlID0gZnVuY3Rpb24ocG9zdHVyZUlkKSB7XHJcbiAgICAgICAgdmFyIG1zZyA9IHsnQHR5cGUnOiAnUG9zdHVyZUNoYW5nZScsIHBvc3R1cmVJZDogcG9zdHVyZUlkLCBzcGVlZDogdm0uZm9ybS5zcGVlZH07XHJcbiAgICAgICAgJGxvZy5pbmZvKCdSZW1vdGUgQ29udHJvbCcsIG1zZywgSlNPTi5zdHJpbmdpZnkobXNnKSk7XHJcbiAgICAgICAgdm0uY2xpZW50LnNlbmQoJy90b3BpYy9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmNvbW1hbmQnLFxyXG4gICAgICAgICAgICB7XCJyZXBseS10b1wiOiAnL3RlbXAtcXVldWUvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5jb21tYW5kJ30sIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm1vdmVUbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtc2cgPSB7XHJcbiAgICAgICAgICAgICdAdHlwZSc6IFwiTW92ZVRvXCIsXHJcbiAgICAgICAgICAgICdiYWNrRGlzdGFuY2UnOiB2bS5mb3JtLm1vdmVUby5iYWNrRGlzdGFuY2UsXHJcbiAgICAgICAgICAgICdyaWdodERpc3RhbmNlJzogdm0uZm9ybS5tb3ZlVG8ucmlnaHREaXN0YW5jZSxcclxuICAgICAgICAgICAgJ3R1cm5DY3dEZWcnOiB2bS5mb3JtLm1vdmVUby50dXJuQ2N3RGVnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkbG9nLmluZm8oJ1JlbW90ZSBDb250cm9sJywgbXNnLCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgICAgICB2bS5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuY29tbWFuZCcsXHJcbiAgICAgICAgICAgIHtcInJlcGx5LXRvXCI6ICcvdGVtcC1xdWV1ZS9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmNvbW1hbmQnfSwgSlNPTi5zdHJpbmdpZnkobXNnKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuam9pbnRJbnRlcnBvbGF0ZUFuZ2xlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1zZyA9IHtcclxuICAgICAgICAgICAgJ0B0eXBlJzogXCJKb2ludEludGVycG9sYXRlQW5nbGVcIixcclxuICAgICAgICAgICAgam9pbnRJZDogdm0uZm9ybS5pbnRlcnBvbGF0ZUFuZ2xlLmpvaW50LmlkLFxyXG4gICAgICAgICAgICB0YXJnZXRDY3dEZWc6IHZtLmZvcm0uaW50ZXJwb2xhdGVBbmdsZS50YXJnZXRDY3dEZWcsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiB2bS5mb3JtLmludGVycG9sYXRlQW5nbGUuZHVyYXRpb25cclxuICAgICAgICB9O1xyXG4gICAgICAgICRsb2cuaW5mbygnUmVtb3RlIENvbnRyb2wnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgICAgIHZtLmNsaWVudC5zZW5kKCcvdG9waWMvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5jb21tYW5kJyxcclxuICAgICAgICAgICAge1wicmVwbHktdG9cIjogJy90ZW1wLXF1ZXVlL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuY29tbWFuZCd9LCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gTEVEc1xyXG4gICAgdGhpcy5sZWRzT24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbXNnID0ge1xyXG4gICAgICAgICAgICAnQHR5cGUnOiAnTGVkT3BlcmF0aW9uJyxcclxuICAgICAgICAgICAga2luZDogJ09OJyxcclxuICAgICAgICAgICAgbmFtZXM6IFt2bS5mb3JtLmxlZHMubGVkLmlkXSxcclxuICAgICAgICAgICAgZHVyYXRpb246IHZtLmZvcm0ubGVkcy5kdXJhdGlvbixcclxuICAgICAgICAgICAgaW50ZW5zaXR5OiB2bS5mb3JtLmxlZHMuaW50ZW5zaXR5LFxyXG4gICAgICAgICAgICBjb2xvcjogdm0uZm9ybS5sZWRzLmNvbG9yLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJGxvZy5pbmZvKCdMRUQnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgICAgIHZtLmNsaWVudC5zZW5kKCcvdG9waWMvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5sZWRzJyxcclxuICAgICAgICAgICAge1wicmVwbHktdG9cIjogJy90ZW1wLXF1ZXVlL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcubGVkcyd9LCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmxlZHNPZmYgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbXNnID0ge1xyXG4gICAgICAgICAgICAnQHR5cGUnOiAnTGVkT3BlcmF0aW9uJyxcclxuICAgICAgICAgICAga2luZDogJ09GRicsXHJcbiAgICAgICAgICAgIG5hbWVzOiBbdm0uZm9ybS5sZWRzLmxlZC5pZF0sXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiB2bS5mb3JtLmxlZHMuZHVyYXRpb24sXHJcbiAgICAgICAgICAgIGludGVuc2l0eTogdm0uZm9ybS5sZWRzLmludGVuc2l0eSxcclxuICAgICAgICAgICAgY29sb3I6IHZtLmZvcm0ubGVkcy5jb2xvcixcclxuICAgICAgICB9O1xyXG4gICAgICAgICRsb2cuaW5mbygnTEVEJywgbXNnLCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgICAgICB2bS5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcubGVkcycsXHJcbiAgICAgICAgICAgIHtcInJlcGx5LXRvXCI6ICcvdGVtcC1xdWV1ZS9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmxlZHMnfSwgSlNPTi5zdHJpbmdpZnkobXNnKSk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5sZWRzRmFkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtc2cgPSB7XHJcbiAgICAgICAgICAgICdAdHlwZSc6ICdMZWRPcGVyYXRpb24nLFxyXG4gICAgICAgICAgICBraW5kOiAnRkFERScsXHJcbiAgICAgICAgICAgIG5hbWVzOiBbdm0uZm9ybS5sZWRzLmxlZC5pZF0sXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiB2bS5mb3JtLmxlZHMuZHVyYXRpb24sXHJcbiAgICAgICAgICAgIGludGVuc2l0eTogdm0uZm9ybS5sZWRzLmludGVuc2l0eSxcclxuICAgICAgICAgICAgY29sb3I6IHZtLmZvcm0ubGVkcy5jb2xvcixcclxuICAgICAgICB9O1xyXG4gICAgICAgICRsb2cuaW5mbygnTEVEJywgbXNnLCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgICAgICB2bS5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcubGVkcycsXHJcbiAgICAgICAgICAgIHtcInJlcGx5LXRvXCI6ICcvdGVtcC1xdWV1ZS9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmxlZHMnfSwgSlNPTi5zdHJpbmdpZnkobXNnKSk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5sZWRzRmFkZVJnYiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtc2cgPSB7XHJcbiAgICAgICAgICAgICdAdHlwZSc6ICdMZWRPcGVyYXRpb24nLFxyXG4gICAgICAgICAgICBraW5kOiAnRkFERV9SR0InLFxyXG4gICAgICAgICAgICBuYW1lczogW3ZtLmZvcm0ubGVkcy5sZWQuaWRdLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogdm0uZm9ybS5sZWRzLmR1cmF0aW9uLFxyXG4gICAgICAgICAgICBpbnRlbnNpdHk6IHZtLmZvcm0ubGVkcy5pbnRlbnNpdHksXHJcbiAgICAgICAgICAgIGNvbG9yOiB2bS5mb3JtLmxlZHMuY29sb3IsXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkbG9nLmluZm8oJ0xFRCcsIG1zZywgSlNPTi5zdHJpbmdpZnkobXNnKSk7XHJcbiAgICAgICAgdm0uY2xpZW50LnNlbmQoJy90b3BpYy9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmxlZHMnLFxyXG4gICAgICAgICAgICB7XCJyZXBseS10b1wiOiAnL3RlbXAtcXVldWUvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5sZWRzJ30sIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfTtcclxuICAgIHRoaXMubGVkc1JhbmRvbUV5ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbXNnID0ge1xyXG4gICAgICAgICAgICAnQHR5cGUnOiAnTGVkT3BlcmF0aW9uJyxcclxuICAgICAgICAgICAga2luZDogJ1JBTkRPTV9FWUVTJyxcclxuICAgICAgICAgICAgbmFtZXM6IFt2bS5mb3JtLmxlZHMubGVkLmlkXSxcclxuICAgICAgICAgICAgZHVyYXRpb246IHZtLmZvcm0ubGVkcy5kdXJhdGlvbixcclxuICAgICAgICAgICAgaW50ZW5zaXR5OiB2bS5mb3JtLmxlZHMuaW50ZW5zaXR5LFxyXG4gICAgICAgICAgICBjb2xvcjogdm0uZm9ybS5sZWRzLmNvbG9yLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJGxvZy5pbmZvKCdMRUQnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgICAgIHZtLmNsaWVudC5zZW5kKCcvdG9waWMvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5sZWRzJyxcclxuICAgICAgICAgICAge1wicmVwbHktdG9cIjogJy90ZW1wLXF1ZXVlL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcubGVkcyd9LCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmxlZHNSYXN0YSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtc2cgPSB7XHJcbiAgICAgICAgICAgICdAdHlwZSc6ICdMZWRPcGVyYXRpb24nLFxyXG4gICAgICAgICAgICBraW5kOiAnUkFTVEEnLFxyXG4gICAgICAgICAgICBuYW1lczogW3ZtLmZvcm0ubGVkcy5sZWQuaWRdLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogdm0uZm9ybS5sZWRzLmR1cmF0aW9uLFxyXG4gICAgICAgICAgICBpbnRlbnNpdHk6IHZtLmZvcm0ubGVkcy5pbnRlbnNpdHksXHJcbiAgICAgICAgICAgIGNvbG9yOiB2bS5mb3JtLmxlZHMuY29sb3IsXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkbG9nLmluZm8oJ0xFRCcsIG1zZywgSlNPTi5zdHJpbmdpZnkobXNnKSk7XHJcbiAgICAgICAgdm0uY2xpZW50LnNlbmQoJy90b3BpYy9hdmF0YXIuJyArIHZtLmZvcm0uYXZhdGFySWQgKyAnLmxlZHMnLFxyXG4gICAgICAgICAgICB7XCJyZXBseS10b1wiOiAnL3RlbXAtcXVldWUvYXZhdGFyLicgKyB2bS5mb3JtLmF2YXRhcklkICsgJy5sZWRzJ30sIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfTtcclxuXHJcbn0pXHJcbi5jb250cm9sbGVyKCdBdmF0YXJJbnN0cnVtZW50c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGxvZywgTHVtZW5TdG9tcCwgU2V0dGluZ3MpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB0aGlzLmF2YXRhcklkcyA9IFsnbmFvMScsICduYW8yJyxcclxuICAgICAgICAnYW5pbWUxJywgJ2FuaW1lMicsICdhbmltZTMnLCAnYW5pbWU0JywgJ2FuaW1lNScsICdhbmltZTYnLCAnYW5pbWU3JywgJ2FuaW1lOCcsICdhbmltZTknLCAnYW5pbWUxMCddO1xyXG4gICAgdGhpcy5mb3JtID0ge1xyXG4gICAgICAgIGF2YXRhcklkOiAnbmFvMSdcclxuICAgIH07XHJcbiAgICB0aGlzLmNsaWVudCA9IG51bGw7XHJcblxyXG4gICAgLy8gQXZhdGFyXHJcbiAgICB0aGlzLnN3aXRjaEF2YXRhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAudW5zdWJzY3JpYmVBbGwoKTtcclxuICAgICAgICAvLyByZXNldCBhbGwgcHJldmlvdXMgdmFsdWVzXHJcbiAgICAgICAgdGhpcy5qb2ludCA9IHt9O1xyXG4gICAgICAgIHRoaXMuc29uYXIgPSB7fTtcclxuICAgICAgICB0aGlzLm1vdGlvbiA9IHt9O1xyXG4gICAgICAgIHRoaXMucm9ib3Rwb3NlID0ge307XHJcbiAgICAgICAgdGhpcy50YWN0aWxlID0ge307XHJcbiAgICAgICAgdGhpcy5iYXR0ZXJ5ID0ge307XHJcblxyXG4gICAgICAgIC8qTHVtZW5TdG9tcC5zdWJzY3JpYmUoJy90b3BpYy9hdmF0YXIuJyArIHRoaXMuZm9ybS5hdmF0YXJJZCArICcuY2FtZXJhLm1haW4nLCBmdW5jdGlvbihleGNoYW5nZSkge1xyXG4gICAgICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShleGNoYW5nZS5ib2R5KTtcclxuICAgICAgICAgICAgLy8kbG9nLmRlYnVnKCdqb2ludCAnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4vLyAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChtc2cpO1xyXG4gICAgICAgICAgICBleGNoYW5nZS5ib2R5ID0gbXNnO1xyXG4vLyAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChleGNoYW5nZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBleGNoYW5nZTtcclxuICAgICAgICB9KTsqL1xyXG4gICAgICAgIEx1bWVuU3RvbXAuc3Vic2NyaWJlKCcvdG9waWMvYXZhdGFyLicgKyB0aGlzLmZvcm0uYXZhdGFySWQgKyAnLmRhdGEuam9pbnQnLCBmdW5jdGlvbihleGNoYW5nZSkge1xyXG4gICAgICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShleGNoYW5nZS5ib2R5KTtcclxuICAgICAgICAgICAgLy8kbG9nLmRlYnVnKCdqb2ludCAnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4vLyAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChtc2cpO1xyXG4gICAgICAgICAgICBleGNoYW5nZS5ib2R5ID0gbXNnO1xyXG4vLyAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChleGNoYW5nZSk7XHJcbiAgICAgICAgICAgIHRoaXMuam9pbnQgPSBleGNoYW5nZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBMdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2F2YXRhci4nICsgdGhpcy5mb3JtLmF2YXRhcklkICsgJy5kYXRhLnNvbmFyJywgZnVuY3Rpb24oZXhjaGFuZ2UpIHtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IEpTT04ucGFyc2UoZXhjaGFuZ2UuYm9keSk7XHJcbiAgICAgICAgICAgIC8vJGxvZy5kZWJ1Zygnc29uYXIgJywgbXNnLCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuLy8gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2gobXNnKTtcclxuICAgICAgICAgICAgZXhjaGFuZ2UuYm9keSA9IG1zZztcclxuLy8gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goZXhjaGFuZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLnNvbmFyID0gZXhjaGFuZ2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIEx1bWVuU3RvbXAuc3Vic2NyaWJlKCcvdG9waWMvYXZhdGFyLicgKyB0aGlzLmZvcm0uYXZhdGFySWQgKyAnLmRhdGEubW90aW9uJywgZnVuY3Rpb24oZXhjaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShleGNoYW5nZS5ib2R5KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRsb2cuZGVidWcoJ21vdGlvbiAnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKG1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhjaGFuZ2UuYm9keSA9IG1zZztcclxuICAgICAgICAvLyAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChleGNoYW5nZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3Rpb24gPSBleGNoYW5nZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBMdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2F2YXRhci4nICsgdGhpcy5mb3JtLmF2YXRhcklkICsgJy5kYXRhLnJvYm90cG9zZScsIGZ1bmN0aW9uKGV4Y2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IEpTT04ucGFyc2UoZXhjaGFuZ2UuYm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kbG9nLmRlYnVnKCdyb2JvdHBvc2UgJywgbXNnLCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICAgICAgICAvLyAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4Y2hhbmdlLmJvZHkgPSBtc2c7XHJcbiAgICAgICAgLy8gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goZXhjaGFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9ib3Rwb3NlID0gZXhjaGFuZ2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgTHVtZW5TdG9tcC5zdWJzY3JpYmUoJy90b3BpYy9hdmF0YXIuJyArIHRoaXMuZm9ybS5hdmF0YXJJZCArICcuZGF0YS50YWN0aWxlJywgZnVuY3Rpb24oZXhjaGFuZ2UpIHtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IEpTT04ucGFyc2UoZXhjaGFuZ2UuYm9keSk7XHJcbiAgICAgICAgICAgIC8vJGxvZy5kZWJ1ZygndGFjdGlsZSAnLCBtc2csIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4vLyAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChtc2cpO1xyXG4gICAgICAgICAgICBleGNoYW5nZS5ib2R5ID0gbXNnO1xyXG4vLyAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChleGNoYW5nZSk7XHJcbiAgICAgICAgICAgIHRoaXMudGFjdGlsZSA9IGV4Y2hhbmdlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIEx1bWVuU3RvbXAuc3Vic2NyaWJlKCcvdG9waWMvYXZhdGFyLicgKyB0aGlzLmZvcm0uYXZhdGFySWQgKyAnLmRhdGEuYmF0dGVyeScsIGZ1bmN0aW9uKGV4Y2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBKU09OLnBhcnNlKGV4Y2hhbmdlLmJvZHkpO1xyXG4gICAgICAgICAgICAvLyRsb2cuZGVidWcoJ2JhdHRlcnkgJywgbXNnLCBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuLy8gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2gobXNnKTtcclxuICAgICAgICAgICAgZXhjaGFuZ2UuYm9keSA9IG1zZztcclxuLy8gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goZXhjaGFuZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmJhdHRlcnkgPSBleGNoYW5nZTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICAgICAgTHVtZW5TdG9tcC5jb25uZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2bS5jbGllbnQgPSBMdW1lblN0b21wLmdldENsaWVudCgpO1xyXG4gICAgICAgICAgICB2bS5zd2l0Y2hBdmF0YXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVMZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAuZGlzY29ubmVjdCgpO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
