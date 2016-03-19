/// <reference path="../typings/main.d.ts"/>
angular.module('starter.services', [])
    .factory('Settings', function ($q, $log, $window) {
    var defaultSettings = {
        stompUri: 'ws://167.205.66.35:15674/ws',
        stompUser: 'lumen',
        stompPassword: 'lumen',
        motionAllowed: false
    };
    return {
        getDefault: function () {
            return defaultSettings;
        },
        getSettings: function () {
            var settingsJson = $window.localStorage.getItem('settings');
            var settings = settingsJson !== null ? JSON.parse(settingsJson) : defaultSettings;
            return settings;
        },
        setSettings: function (settings) {
            $window.localStorage.setItem('settings', JSON.stringify(settings));
            return settings;
        }
    };
})
    .factory('LumenStomp', function ($q, $log, $window, Settings, ngstomp) {
    var client = null;
    var subscriptions = [];
    return {
        connect: function (callback) {
            var settings = Settings.getSettings();
            $log.info('Stomp connecting to', settings.stompUri);
            client = ngstomp(settings.stompUri);
            client.connect(settings.stompUser, settings.stompPassword, function () {
                $log.info('Stomp connected to', settings.stompUri);
                callback();
            }, function (err) {
                $log.error('Stomp error:', err);
                client = null;
            }, '/');
        },
        disconnect: function () {
            this.unsubscribeAll();
            if (client != null) {
                $log.info('Disconnecting', client);
                client.disconnect(function () { $log.info('Disconnected.'); });
                client = null;
            }
        },
        getClient: function () {
            return client;
        },
        getSubscriptions: function () {
            return subscriptions;
        },
        subscribe: function (topic, headers, body) {
            var sub = client.subscribe(topic, headers, body);
            subscriptions.push(sub);
            return sub;
        },
        unsubscribeAll: function () {
            _.forEach(subscriptions, function (sub) {
                $log.info('Unsubscribing', sub);
                sub.unsubscribe();
            });
            subscriptions = [];
        }
    };
});

//# sourceMappingURL=services.js.map
