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

.controller('AvatarRemoteControlCtrl', function($scope, $stateParams, $log, ngstomp, $window, Settings) {
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);

        // RecordAudio
        $scope.client.subscribe('/topic/avatar.nao1.audio.in', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
            document.getElementById('recorded').src = msg.contentUrl;
            $scope.replayRecorded();
        });
        // Speech Recognition
        $scope.client.subscribe('/topic/lumen.speech.recognition', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received recognized speech", msg);
            $scope.recognizedSpeech = msg;
        });

    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');

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

    // Speech Synthesis
    $scope.communicateAction = function() {
        var msg = {'@type': 'CommunicateAction', avatarId: 'nao1',
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
        $scope.client.send('/topic/avatar.nao1.command',
            {"reply-to": '/temp-queue/avatar.nao1.command'}, JSON.stringify(msg));
    };
    $scope.playAudio = function() {
        var msg = {
            '@type': 'AudioObject',
            contentUrl: $scope.form.audio.contentUrl
        };
        $scope.client.send('/topic/avatar.nao1.audio.out',
            {"reply-to": '/temp-queue/avatar.nao1.audio.out'}, JSON.stringify(msg));
    };
    $scope.stopAudio = function() {
        var msg = {
            '@type': 'StopAudio',
        };
        $scope.client.send('/topic/avatar.nao1.audio',
            {"reply-to": '/temp-queue/avatar.nao1.audio'}, JSON.stringify(msg));
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
                $scope.client.send('/topic/avatar.nao1.audio.out',
                    {"reply-to": '/temp-queue/avatar.nao1.audio.out'}, JSON.stringify(msg));
            }
        };
        reader.readAsDataURL(audioFile);
    };
    $scope.recordAudio = function() {
        var msg = {
            '@type': 'RecordAudio',
            duration: $scope.form.audio.recordDuration,
        };
        $scope.client.send('/topic/avatar.nao1.audio',
            {"reply-to": '/temp-queue/avatar.nao1.audio'}, JSON.stringify(msg));
    };
    $scope.replayRecorded = function() {
        var recordedEl = document.getElementById('recorded');
        $log.info('Playing recorded ', recordedEl, 'seconds ...');
        recordedEl.play();
    };

    // Actor
    $scope.act = function() {
        var msg = {
            '@type': 'ActingPerformance',
            script: $scope.form.actor.actingScript.id
        };
        $scope.client.send('/topic/avatar.nao1.acting',
            {"reply-to": '/temp-queue/avatar.nao1.acting'}, JSON.stringify(msg));
    };

    // Motion
    $scope.wakeUp = function() {
        var wakeMsg = {'@type': 'WakeUp'};
        $log.info('Remote Control', wakeMsg, JSON.stringify(wakeMsg));
        $scope.client.send('/topic/avatar.nao1.command',
            {"reply-to": '/temp-queue/avatar.nao1.command'}, JSON.stringify(wakeMsg));
    };
    $scope.rest = function() {
        var restMsg = {'@type': 'Rest'};
        $log.info('Remote Control', restMsg, JSON.stringify(restMsg));
        $scope.client.send('/topic/avatar.nao1.command',
            {"reply-to": '/temp-queue/avatar.nao1.command'}, JSON.stringify(restMsg));
    };
    $scope.changePosture = function(postureId) {
        var msg = {'@type': 'PostureChange', postureId: postureId, speed: $scope.form.speed};
        $log.info('Remote Control', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.nao1.command',
            {"reply-to": '/temp-queue/avatar.nao1.command'}, JSON.stringify(msg));
    };

    $scope.moveTo = function() {
        var msg = {
            '@type': "MoveTo",
            'backDistance': $scope.form.moveTo.backDistance,
            'rightDistance': $scope.form.moveTo.rightDistance,
            'turnCcwDeg': $scope.form.moveTo.turnCcwDeg
        };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.nao1.command',
            {"reply-to": '/temp-queue/avatar.nao1.command'}, JSON.stringify(msg));
    };

    $scope.jointInterpolateAngle = function() {
        var msg = {
            '@type': "JointInterpolateAngle",
            jointId: $scope.form.interpolateAngle.joint.id,
            targetCcwDeg: $scope.form.interpolateAngle.targetCcwDeg,
            duration: $scope.form.interpolateAngle.duration
        };
        $log.info('Remote Control', msg, JSON.stringify(msg));
        $scope.client.send('/topic/avatar.nao1.command',
            {"reply-to": '/temp-queue/avatar.nao1.command'}, JSON.stringify(msg));
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
        $scope.client.send('/topic/avatar.nao1.leds',
            {"reply-to": '/temp-queue/avatar.nao1.leds'}, JSON.stringify(msg));
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
        $scope.client.send('/topic/avatar.nao1.leds',
            {"reply-to": '/temp-queue/avatar.nao1.leds'}, JSON.stringify(msg));
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
        $scope.client.send('/topic/avatar.nao1.leds',
            {"reply-to": '/temp-queue/avatar.nao1.leds'}, JSON.stringify(msg));
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
        $scope.client.send('/topic/avatar.nao1.leds',
            {"reply-to": '/temp-queue/avatar.nao1.leds'}, JSON.stringify(msg));
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
        $scope.client.send('/topic/avatar.nao1.leds',
            {"reply-to": '/temp-queue/avatar.nao1.leds'}, JSON.stringify(msg));
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
        $scope.client.send('/topic/avatar.nao1.leds',
            {"reply-to": '/temp-queue/avatar.nao1.leds'}, JSON.stringify(msg));
    };

})
.controller('AvatarInstrumentsCtrl', function($scope, $stateParams, $log, ngstomp, Settings) {
    $scope.messages = [];
//    var stompUri = 'http://167.205.66.130:15674/stomp';
//    var stompUri = 'http://169.254.26.17:15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.subscribe('/topic/avatar.nao1.camera.main', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.image = exchange;
        });
        $scope.client.subscribe('/topic/avatar.nao1.data.joint', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.joint = exchange;
        });
        $scope.client.subscribe('/topic/avatar.nao1.data.sonar', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('sonar ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.sonar = exchange;
        });
        $scope.client.subscribe('/topic/avatar.nao1.data.tactile', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('tactile ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.tactile = exchange;
        });
        $scope.client.subscribe('/topic/avatar.nao1.data.battery', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('battery ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.battery = exchange;
        });
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
})

// Visual

// ---------------------------------- Audio ----------------------------------
.controller('AudioMonitorCtrl', function($scope, $stateParams, $log, ngstomp, $window, Settings) {
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);

        // audio.out: AudioObject
        $scope.client.subscribe('/topic/avatar.*.audio.out', function(exchange) {
            var msg = JSON.parse(exchange.body);
            $log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes');
            document.getElementById('played').src = msg.contentUrl;
            $scope.replayPlayed();
        });

    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');

    $scope.form = {
    };

    // Audio
    $scope.replayPlayed = function() {
        var playedEl = document.getElementById('played');
        $log.info('Playing played ', playedEl, 'seconds ...');
        playedEl.play();
    };

})

.controller('AvatarInstrumentsCtrl', function($scope, $stateParams, $log, ngstomp, Settings) {
    $scope.messages = [];
//    var stompUri = 'http://167.205.66.130:15674/stomp';
//    var stompUri = 'http://169.254.26.17:15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.subscribe('/topic/avatar.nao1.camera.main', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.image = exchange;
        });
        $scope.client.subscribe('/topic/avatar.nao1.data.joint', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('joint ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.joint = exchange;
        });
        $scope.client.subscribe('/topic/avatar.nao1.data.sonar', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('sonar ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.sonar = exchange;
        });
        $scope.client.subscribe('/topic/avatar.nao1.data.tactile', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('tactile ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.tactile = exchange;
        });
        $scope.client.subscribe('/topic/avatar.nao1.data.battery', function(exchange) {
            var msg = JSON.parse(exchange.body);
            //$log.debug('battery ', msg, JSON.stringify(msg));
//            $scope.messages.push(msg);
            exchange.body = msg;
//            $scope.messages.push(exchange);
            $scope.battery = exchange;
        });
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
})

// Persistence
.controller('PersistenceQueryFindAllCtrl', function($scope, $stateParams, $log, ngstomp, Settings) {
    $scope.query = {
        '@type': 'FindAllQuery',
        classRef: null,
        itemsPerPage: 25
    };
    $scope.resources = {content: []};
    $scope.classes = [
        {label: "person", ref: 'yago:wordnet_person_100007846'},
        {label: "country", ref: 'yago:wordnet_country_108544813'},
        {label: "area", ref: 'yago:wordnet_area_108497294'},
        {label: "organization", ref: 'yago:wordnet_organization_108008335'},
        {label: "alumnus", ref: 'yago:wordnet_alumnus_109786338'},
        {label: "university", ref: 'yago:wordnet_university_108286569'},
        {label: "mountain", ref: 'yago:wordnet_mountain_109359803'},
        {label: "lake", ref: 'yago:wordnet_lake_109328904'},
        {label: "building", ref: 'yago:wordnet_building_102913152'},
        {label: "island", ref: 'yago:wordnet_island_109316454'},
        {label: "continent", ref: 'yago:wordnet_continent_109254614'},
        {label: "planet", ref: 'yago:wordnet_planet_109394007'},
        {label: "galaxy", ref: 'yago:wordnet_galaxy_108270938'}
    ];
    $scope.form = {class: $scope.classes[0]};
    
//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.stompClient.subscriptions['/temp-queue/persistence.fact'] = function(msg) {
            $log.debug('Received /temp-queue/persistence.fact:', msg.body);
            $scope.$apply(function() {
                var json = JSON.parse(msg.body);
                if (json['@type'] == 'Resources') {
                    $scope.resources = json;
                } else {
                    $log.error(json.exceptionClass + ': ' + json.message);
                    $log.error(json.stackTrace);
                    $window.alert(json.exceptionClass + ': ' + json.message + '\n' + json.stackTrace);
                }
            });
        };
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
    $scope.submit = function() {
        $scope.query.classRef = $scope.form.class.ref;
        $log.info('FindAllQuery', $scope.query, JSON.stringify($scope.query));
        $scope.resources = {content: []};
        $scope.client.send('/topic/lumen.arkan.persistence.fact',
            {"reply-to": '/temp-queue/persistence.fact'}, JSON.stringify($scope.query));
    };
})
.controller('PersistenceQueryCypherCtrl', function($scope, $stateParams, $log, $window, ngstomp, Settings) {
    $scope.resources = {content: []};
    $scope.form = {
        '@type': 'CypherQuery',
        query: 'MATCH (n:Resource {href: \'lumen:Budhi_Yulianto\'}) -[r]-> (x)\n' +
            'RETURN r, x;'
    };

    var tempQueue = '/temp-queue/persistence.fact.cypher';
//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.stompClient.subscriptions[tempQueue] = function(msg) {
            $log.debug('Received ', tempQueue, ':', msg.body);
            $scope.$apply(function() {
                var json = JSON.parse(msg.body);
                if (json['@type'] == 'Resources') {
                    $scope.resources = json;
                } else {
                    $log.error(json.exceptionClass + ': ' + json.message);
                    $log.error(json.stackTrace);
                    $window.alert(json.exceptionClass + ': ' + json.message + '\n' + json.stackTrace);
                }
            });
        };
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
    $scope.submit = function() {
        $log.info('CypherQuery', $scope.form, JSON.stringify($scope.form));
        $scope.resources = {content: []};
        $scope.client.send('/topic/lumen.arkan.persistence.fact',
            {"reply-to": tempQueue}, JSON.stringify($scope.form));
    };
})
.controller('PersistenceJournalImageCtrl', function($scope, $stateParams, $log, $window, ngstomp, Settings) {
    $scope.resources = {content: []};
    $scope.form = {
        '@type': 'JournalImageQuery',
        maxDateCreated: '2015-02-26T16:11',
        itemsPerPage: 25
    };

    var tempQueue = '/temp-queue/persistence.journal.image';
//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.stompClient.subscriptions[tempQueue] = function(msg) {
            $log.debug('Received ', tempQueue, ':', msg.body);
            $scope.$apply(function() {
                var json = JSON.parse(msg.body);
                if (json['@type'] == 'Resources') {
                    $scope.resources = json;
                } else {
                    $log.error(json.exceptionClass + ': ' + json.message);
                    $log.error(json.stackTrace);
                    $window.alert(json.exceptionClass + ': ' + json.message + '\n' + json.stackTrace);
                }
            });
        };
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
    $scope.submit = function() {
        $log.info('JournalImageQuery', $scope.form, JSON.stringify($scope.form));
        $scope.resources = {content: []};
        $scope.client.send('/topic/lumen.arkan.persistence.journal',
            {"reply-to": tempQueue}, JSON.stringify($scope.form));
    };
})
.controller('PersistenceJournalJointCtrl', function($scope, $stateParams, $log, $window, ngstomp, Settings) {
    $scope.resources = {content: []};
    $scope.form = {
        '@type': 'JournalJointQuery',
        maxDateCreated: '2015-02-17T16:11',
        itemsPerPage: 25
    };

    var tempQueue = '/temp-queue/persistence.journal.joint';
//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.stompClient.subscriptions[tempQueue] = function(msg) {
            $log.debug('Received ', tempQueue, ':', msg.body);
            $scope.$apply(function() {
                var json = JSON.parse(msg.body);
                if (json['@type'] == 'Resources') {
                    $scope.resources = json;
                } else {
                    $log.error(json.exceptionClass + ': ' + json.message);
                    $log.error(json.stackTrace);
                    $window.alert(json.exceptionClass + ': ' + json.message + '\n' + json.stackTrace);
                }
            });
        };
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
    $scope.submit = function() {
        $log.info('JournalJointQuery', $scope.form, JSON.stringify($scope.form));
        $scope.resources = {content: []};
        $scope.client.send('/topic/lumen.arkan.persistence.journal',
            {"reply-to": tempQueue}, JSON.stringify($scope.form));
    };
})
.controller('PersistenceJournalSonarCtrl', function($scope, $stateParams, $log, $window, ngstomp, Settings) {
    $scope.resources = {content: []};
    $scope.form = {
        '@type': 'JournalSonarQuery',
        maxDateCreated: '2015-02-17T16:11',
        itemsPerPage: 25
    };

    var tempQueue = '/temp-queue/persistence.journal.sonar';
//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.stompClient.subscriptions[tempQueue] = function(msg) {
            $log.debug('Received ', tempQueue, ':', msg.body);
            $scope.$apply(function() {
                var json = JSON.parse(msg.body);
                if (json['@type'] == 'Resources') {
                    $scope.resources = json;
                } else {
                    $log.error(json.exceptionClass + ': ' + json.message);
                    $log.error(json.stackTrace);
                    $window.alert(json.exceptionClass + ': ' + json.message + '\n' + json.stackTrace);
                }
            });
        };
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
    $scope.submit = function() {
        $log.info('JournalSonarQuery', $scope.form, JSON.stringify($scope.form));
        $scope.resources = {content: []};
        $scope.client.send('/topic/lumen.arkan.persistence.journal',
            {"reply-to": tempQueue}, JSON.stringify($scope.form));
    };
})
.controller('PersistenceJournalTactileCtrl', function($scope, $stateParams, $log, $window, ngstomp, Settings) {
    $scope.resources = {content: []};
    $scope.form = {
        '@type': 'JournalTactileQuery',
        maxDateCreated: '2015-02-17T16:11',
        itemsPerPage: 25
    };

    var tempQueue = '/temp-queue/persistence.journal.tactile';
//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.stompClient.subscriptions[tempQueue] = function(msg) {
            $log.debug('Received ', tempQueue, ':', msg.body);
            $scope.$apply(function() {
                var json = JSON.parse(msg.body);
                if (json['@type'] == 'Resources') {
                    $scope.resources = json;
                } else {
                    $log.error(json.exceptionClass + ': ' + json.message);
                    $log.error(json.stackTrace);
                    $window.alert(json.exceptionClass + ': ' + json.message + '\n' + json.stackTrace);
                }
            });
        };
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
    $scope.submit = function() {
        $log.info('JournalTactileQuery', $scope.form, JSON.stringify($scope.form));
        $scope.resources = {content: []};
        $scope.client.send('/topic/lumen.arkan.persistence.journal',
            {"reply-to": tempQueue}, JSON.stringify($scope.form));
    };
})
.controller('PersistenceJournalBatteryCtrl', function($scope, $stateParams, $log, $window, ngstomp, Settings) {
    $scope.resources = {content: []};
    $scope.form = {
        '@type': 'JournalBatteryQuery',
        maxDateCreated: '2015-02-17T16:11',
        itemsPerPage: 25
    };

    var tempQueue = '/temp-queue/persistence.journal.battery';
//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.stompClient.subscriptions[tempQueue] = function(msg) {
            $log.debug('Received ', tempQueue, ':', msg.body);
            $scope.$apply(function() {
                var json = JSON.parse(msg.body);
                if (json['@type'] == 'Resources') {
                    $scope.resources = json;
                } else {
                    $log.error(json.exceptionClass + ': ' + json.message);
                    $log.error(json.stackTrace);
                    $window.alert(json.exceptionClass + ': ' + json.message + '\n' + json.stackTrace);
                }
            });
        };
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');
    $scope.submit = function() {
        $log.info('JournalBatteryQuery', $scope.form, JSON.stringify($scope.form));
        $scope.resources = {content: []};
        $scope.client.send('/topic/lumen.arkan.persistence.journal',
            {"reply-to": tempQueue}, JSON.stringify($scope.form));
    };
})



.controller('FaceRecognitionImgCtrl', function($scope, $stateParams, $log, ngstomp, Settings) {
    $scope.imageObject = null;
    $scope.recognizeds = [];

//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.subscribe('/topic/lumen.arkan.face.recognition', function(msg) {
            var recognized = JSON.parse(msg.body);
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
    $scope.testStomp = function() {
        var imageObject = {
            '@type': 'ImageObject',
            name: 'wajah1_240p.jpg',
            contentType: 'image/jpeg',
            contentSize: 4880,
            dateModified: "2015-01-09T08:05:37.000Z",
            contentUrl: "data:image/jpeg;base64,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Jx2Gee3rHw5kjl8G2csUiSI/mEMjBgf3jdxQBuUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAcl8dIrmf4W6nDaPseRoFZuPlQzx7zk8D5N3Jr588QaLaaJ4Fh0/T4/LtUdAhdyXnx/HjqRkn5m4ORjGa+ofE2mjV9Dn04yLH52352jEgXDBs7Twenfj69K4TxJ8Jv7W017IeIWto2kWQFLQszMpGC5MmW4zxwBnjHSgD5wgfyi0LHjqKZcBJJEkdfw9a9uvP2ehOc/wDCW7Txg/2b/wDbag/4ZzcqVbxrkf8AYK/+20AeLX2qLzHGGCjsDwPYVzHiK81eVRFZRTXB3cRqS2K+l4f2drZRiTxOHGQcDTsc/wDf2tiw+ClvZxlYNbjUsACwsOf/AEZQB8Xzv48gjMk2g3KRsCQSCTjpznn86xVi1C7uDNd28i7TzubpX3LqPwUmuoyq+KY489/7Myf/AEbXMal+zCl40jP4zVWk6kaR/wDbqAPljTxEIuADjpnvWhpMc1zcQQJBJI0kqxhYl3Eljj+hr6Hj/ZNij+746H46P/8Abq29H/ZuTTo4RB4xYPBcxXKSDTPm3qCDz5vQjt2PPNAHm+pbbLzry3kVRaK0dqy/8smb5A4HYiOLzPYsP71UvhfNMYbhYrdg0rj7NAMN+9k4jbnAISMKB6FvevbH+BMD2t1bnxH+7uN+xRYf6vcmzH+s5G3j8TRonwJTTb4Tx+JgY9jI8S6dtDAxhMf6zjkA/higDyPxsq6ZpyxwNJJGreTCY+WkQENNJ6ZkcbRnsOOrV9G/AaYXHwn0mYCAbhLlYBhFImcFR64xjPfGe9cnrXwSOpac9vN4mAlZhtl/s/7iBfugeZ/e+brznHvXoXw/0EeGPB1joQuEuPsaFfNSARK5LFs7ATjr60AbNFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//9k="
        };
        $log.info('ImageObject', imageObject, JSON.stringify(imageObject));
        $scope.client.send('/topic/avatar.nao1.camera.main', {}, JSON.stringify(imageObject));
    };
    $scope.loadImage = function() {
        $scope.recognizeds = [];
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
                $log.info('ImageObject', $scope.imageObject, JSON.stringify($scope.imageObject));
            });
        };
        reader.readAsDataURL(imageFile);
    };
    $scope.recognize = function() {
        $log.info('Recognizing...', $scope.imageObject, JSON.stringify($scope.imageObject));
        $scope.client.send('/topic/avatar.nao1.camera.main', {}, JSON.stringify($scope.imageObject));
    };
})
.controller('FaceRecognitionCamCtrl', function($scope, $stateParams, $log, $interval, ngstomp, Settings) {
    'use strict';

    $scope.imageObject = null;
    $scope.recognizeds = [];
    $scope.humanPos = {x: null, y: null, z: null};
    $scope.markers = {};
//    {
//        position: {imageU: 10, imageV: 100, imageVH: 50},
//        cssStyle: {left: '0px', top: '0px', height: '0px'}}];

//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
        $scope.client.subscribe('/topic/lumen.arkan.face.recognition', function(msg) {
            var recognized = JSON.parse(msg.body);
            recognized.cssStyle = {
                left: recognized.minPoint.x + 'px',
                top: recognized.minPoint.y + 'px'
            };
            $scope.recognizeds.push(recognized);
        });
        $scope.client.subscribe('/topic/lumen.arkan.human.detection', function(msg) {
            var humanChanges = JSON.parse(msg.body);
            var humanThings = humanChanges.humanDetecteds.concat(humanChanges.humanMovings);
            _.each(humanThings, function(e) {
                $log.debug('human', e.humanId, 'pos', e.position);
                $scope.humanPos = e.position;
                $scope.markers[e.humanId] = e;
                e.cssStyle = {
                    left: (e.imageU-2) + 'px',
                    top: (e.imageV - e.imageVH) + 'px',
                    width: '5px',
                    height: e.imageVH + 'px'
                };
            });
        });
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');

    var imageContentType = 'image/jpeg'; // stomp.js can't handle big messages yet :(
    var _video = null,
        patData = null,
        dataUri = null;
    $scope.patOpts = {x: 0, y: 0, w: 320, h: 240};
    $scope.streamingInterval = 1000;
    $scope.streamer = null;

    $scope.onStream = function(stream) {
        // You could do something manually with the stream.
        _video = document.querySelector('.webcam-live');
        $log.debug('onStream', stream, _video);
    };
    $scope.onAccessDenied = function(err) {
        $log.error('Webcam error:', err);
    };
    $scope.onStreaming = function() {
        _video = document.querySelector('.webcam-live');
        $log.debug('onStreaming', _video);
        // The video element contains the captured camera data
//        $scope.$apply(function() {
//            $scope.patOpts.w = _video.width;
//            $scope.patOpts.h = _video.height;
//        });
    };

/* no longer used
    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = $scope.patOpts.w;
        hiddenCanvas.height = $scope.patOpts.h;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, $scope.patOpts.w, $scope.patOpts.h);
        return ctx.getImageData(x, y, w, h);
    };
    */

    /**
     * This function could be used to send the image data
     * to a backend server that expects base64 encoded images.
     *
     * In this example, we simply store it in the scope for display.
     */
    var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
        $scope.snapshotData = imgBase64;
    };

    /**
     * Make a snapshot of the camera data and show it in another canvas.
     */
    $scope.makeSnapshot = function makeSnapshot() {
        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;

            patCanvas.width = $scope.patOpts.w;
            patCanvas.height = $scope.patOpts.h;
            var ctxPat = patCanvas.getContext('2d');

//            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
//            ctxPat.putImageData(idata, 0, 0);
            ctxPat.drawImage(_video, 0, 0, $scope.patOpts.w, $scope.patOpts.h);
            $log.info($scope.markers.length, 'markers', $scope.markers);
            _.each($scope.markers, function(e, k) {
                ctxPat.beginPath();
                ctxPat.lineWidth = 8;
                ctxPat.strokeStyle = '#00ff00';
                ctxPat.moveTo(e.imageU, e.imageV);
                ctxPat.lineTo(e.imageU, e.imageV - e.imageVH);
                ctxPat.stroke();
            });
            var idata = ctxPat.getImageData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);

            sendSnapshotToServer(patCanvas.toDataURL(imageContentType));

            patData = idata;
        }
    };
    $scope.recognize = function() {
        if (!$scope.snapshotData) {
            alert('No $scope.snapshotData!');
            return;
        }

        $scope.imageObject = {
            '@type': 'ImageObject',
            name: 'camera.jpg',
            contentType: imageContentType,
            // TODO: contentSize: imageFile.size,
            // TODO: dateModified: imageFile.lastModifiedDate,
            contentUrl: $scope.snapshotData
        };
        $log.info('Recognizing...', $scope.imageObject, JSON.stringify($scope.imageObject));
        $scope.client.send('/topic/avatar.nao1.camera.main', {}, JSON.stringify($scope.imageObject));
//        window.alert('Sent: ' + JSON.stringify($scope.imageObject).substr(0, 300));
    };
    $scope.makeSnapshotAndRecognize = function() {
        $scope.makeSnapshot();
        $scope.recognize();
    };

    /**
     * Redirect the browser to the URL given.
     * Used to download the image by passing a dataURL string
     */
    $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
        window.location.href = dataURL;
    };

    $scope.startStreaming = function() {
        $scope.streamer = $interval(function() {
            $scope.makeSnapshotAndRecognize();
        }, $scope.streamingInterval);
    };
    $scope.stopStreaming = function() {
        $log.info('Canceling streamer');
        $interval.cancel($scope.streamer);
        $scope.streamer = null;
    };
})

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

.controller('SocialExpressCtrl', function($scope, $stateParams, $log, ngstomp, Settings) {
    $scope.posts = [];
    $scope.networks = [
        {'id': 'facebook', 'name': 'Facebook'},
        {'id': 'twitter', 'name': 'Twitter'}
    ];
    $scope.post = {network: $scope.networks[0]};

//    var stompUri = 'http://' + window.location.hostname + ':15674/stomp';
    var settings = Settings.getSettings();
    $log.info('Stomp connecting to', settings.stompUri);
    $scope.client = ngstomp(settings.stompUri);
    $scope.client.connect(settings.stompUser, settings.stompPassword, function() {
        $log.info('Stomp connected to', settings.stompUri);
//        $scope.client.subscribe('/topic/lumen.arkan.social.perception', function(msg) {
//            var post = JSON.parse(msg.body);
//            $scope.posts.push(post);
//            $ionicScrollDelegate.scrollBottom(true);
//        });
    }, function(err) {
        $log.error('Stomp error:', err);
        $scope.client = null;
    }, '/');

    $scope.submit = function() {
        $scope.statusUpdate = {
            '@type': 'StatusUpdate',
            message: $scope.post.message,
            channel: $scope.post.network
        };
        $log.info('Posting...', JSON.stringify($scope.statusUpdate));
        $scope.client.send('/topic/lumen.arkan.social.expression', {}, JSON.stringify($scope.statusUpdate));
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
            stompUri: 'http://localhost:15674/stomp',
            stompUser: 'guest',
            stompPassword: 'guest'
        };
    };
    $scope.resetWindow = function() {
        $scope.settings = {
            stompUri: 'http://' + $window.location.hostname + ':15674/stomp',
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
