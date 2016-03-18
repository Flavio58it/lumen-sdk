angular.module('starter.controllers')

.controller('PersistenceFactCtrl', function($scope, $stateParams, $log, LumenStomp, Settings, $window) {
    $scope.locales = [
        {id: 'id-ID', name: 'Indonesian'},
        {id: 'en-US', name: 'English (United States)'}
    ];
    $scope.form = {
        matchRequest: {
            inLanguage: $scope.locales[0]
        }
    };

    $scope.switchAvatar = function() {
        LumenStomp.unsubscribeAll();
        LumenStomp.subscribe('/topic/lumen.persistence.fact.reply', function(inMsg) {
            var json = JSON.parse(inMsg.body);
            $log.info("Received response", json);
            $window.alert('Received response: ' + inMsg);
        });
    };

    $scope.$on('$ionicView.enter', function() {
        LumenStomp.connect(function() {
            $scope.client = LumenStomp.getClient();
            $scope.switchAvatar();
        });
    });
    $scope.$on('$ionicView.beforeLeave', function() {
        LumenStomp.disconnect();
    });

    $scope.matchBtn = function() {
        var factRequest = {
            '@type': 'FactRequest',
            'operation': 'match',
            upLabel: $scope.form.matchRequest.upLabel,
            inLanguage: $scope.form.matchRequest.inLanguage.id,
        };
        $log.info('match', factRequest, JSON.stringify(factRequest));
        $scope.client.send('/topic/lumen.persistence.fact',
//            {"reply-to": '/temp-queue/lumen.persistence.fact'}, JSON.stringify(factRequest));
            {"reply-to": 'lumen.persistence.fact.reply'}, JSON.stringify(factRequest));
    };
})

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

;