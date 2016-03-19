/// <reference path="../typings/main.d.ts"/>
var Settings = (function () {
    function Settings($q, $log, $window) {
        this.$q = $q;
        this.$log = $log;
        this.$window = $window;
        this.defaultSettings = {
            stompUri: 'ws://167.205.66.35:15674/ws',
            stompUser: 'lumen',
            stompPassword: 'lumen',
            motionAllowed: false
        };
    }
    Settings.prototype.getDefault = function () {
        return this.defaultSettings;
    };
    Settings.prototype.getSettings = function () {
        var settingsJson = this.$window.localStorage.getItem('settings');
        var settings = settingsJson !== null ? JSON.parse(settingsJson) : this.defaultSettings;
        return settings;
    };
    Settings.prototype.setSettings = function (settings) {
        this.$window.localStorage.setItem('settings', JSON.stringify(settings));
        return settings;
    };
    return Settings;
}());
var LumenStomp = (function () {
    function LumenStomp($q, $log, $window, Settings, ngstomp) {
        this.$q = $q;
        this.$log = $log;
        this.$window = $window;
        this.Settings = Settings;
        this.ngstomp = ngstomp;
        this.client = null;
        this.subscriptions = [];
    }
    LumenStomp.prototype.connect = function (callback) {
        var _this = this;
        var settings = this.Settings.getSettings();
        this.$log.info('Stomp connecting to', settings.stompUri);
        this.client = this.ngstomp(settings.stompUri);
        this.client.connect(settings.stompUser, settings.stompPassword, function () {
            _this.$log.info('Stomp connected to', settings.stompUri);
            callback();
        }, function (err) {
            _this.$log.error('Stomp error:', err);
            _this.client = null;
        }, '/');
    };
    LumenStomp.prototype.disconnect = function () {
        this.unsubscribeAll();
        if (this.client != null) {
            this.$log.info('Disconnecting', this.client);
            this.client.disconnect(function () { this.$log.info('Disconnected.'); });
            this.client = null;
        }
    };
    LumenStomp.prototype.getClient = function () {
        return this.client;
    };
    LumenStomp.prototype.getSubscriptions = function () {
        return this.subscriptions;
    };
    LumenStomp.prototype.subscribe = function (topic, headers, body) {
        var sub = this.client.subscribe(topic, headers, body);
        this.subscriptions.push(sub);
        return sub;
    };
    LumenStomp.prototype.unsubscribeAll = function () {
        var _this = this;
        this.subscriptions.forEach(function (sub) {
            _this.$log.info('Unsubscribing', sub);
            sub.unsubscribe();
        });
        this.subscriptions = [];
    };
    return LumenStomp;
}());
angular.module('starter.services', [])
    .service('Settings', Settings)
    .service('LumenStomp', LumenStomp);

//# sourceMappingURL=services.js.map
