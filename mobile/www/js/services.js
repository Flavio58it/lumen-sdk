angular.module('starter.services', [])

.factory('Settings', function($q, $log, $window) {
    var defaultSettings = {
        stompUri: 'http://167.205.66.68:15674/stomp',
        stompUser: 'lumen',
        stompPassword: 'lumen',
        motionAllowed: false,
    };
    return {
        getDefault: function() {
            return defaultSettings;
        },
        getSettings: function() {
            var settingsJson = $window.localStorage.getItem('settings');
            var settings = settingsJson !== null ? JSON.parse(settingsJson) : defaultSettings;
            return settings;
        },
        setSettings: function(settings) {
            $window.localStorage.setItem('settings', JSON.stringify(settings));
            return settings;
        },
    };
})

;
