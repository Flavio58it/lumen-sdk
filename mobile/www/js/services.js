angular.module('starter.services', [])

.factory('Settings', function($q, $log, $window) {
    return {
        getDefault: function() {
            var defaultSettings = {
                stompUri: 'http://167.205.56.130:15674/stomp',
                stompUser: 'lumen',
                stompPassword: 'lumen',
            };
            return defaultSettings;
        },
        getSettings: function() {
            var defaultSettings = {
                stompUri: 'http://167.205.56.130:15674/stomp',
                stompUser: 'lumen',
                stompPassword: 'lumen',
            };
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