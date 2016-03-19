/// <reference path="../typings/main.d.ts"/>

module Services {

    export class Settings {
        public defaultSettings = {
            stompUri: 'ws://167.205.66.35:15674/ws',
            stompUser: 'lumen',
            stompPassword: 'lumen',
            motionAllowed: false,
        };

        constructor(public $log: ng.ILogService, public $window: ng.IWindowService) {
        }

        getDefault() {
            return this.defaultSettings;
        }

        getSettings() {
            var settingsJson = this.$window.localStorage.getItem('settings');
            var settings = settingsJson !== null ? JSON.parse(settingsJson) : this.defaultSettings;
            return settings;
        }

        setSettings(settings) {
            this.$window.localStorage.setItem('settings', JSON.stringify(settings));
            return settings;
        }
    }
    
    export interface IExchange {
        body: string
    }

    export class LumenStomp {
        public client = null;
        public subscriptions = [];

        constructor(public $log: ng.ILogService, public $window: ng.IWindowService,
            public Settings: Settings, public ngstomp) {
        }

        connect(callback: () => any) {
            var settings = this.Settings.getSettings();
            this.$log.info('Stomp connecting to', settings.stompUri);
            this.client = this.ngstomp(settings.stompUri);
            this.client.connect(settings.stompUser, settings.stompPassword, () => {
                this.$log.info('Stomp connected to', settings.stompUri);
                callback();
            }, err => {
                this.$log.error('Stomp error:', err);
                this.client = null;
            }, '/');
        }

        disconnect() {
            this.unsubscribeAll();
            if (this.client != null) {
                this.$log.info('Disconnecting', this.client);
                this.client.disconnect(function() { this.$log.info('Disconnected.'); });
                this.client = null;
            }
        }

        getClient() {
            return this.client;
        }

        getSubscriptions() {
            return this.subscriptions;
        }

        subscribe(topic: string, callback: (exchange: IExchange) => any) {
            var sub = this.client.subscribe(topic, callback);
            this.subscriptions.push(sub);
            return sub;
        }

        unsubscribeAll() {
            this.subscriptions.forEach(sub => {
                this.$log.info('Unsubscribing', sub);
                sub.unsubscribe();
            });
            this.subscriptions = [];
        }
    }

}

angular.module('starter.services', [])
    .service('Settings', Services.Settings)
    .service('LumenStomp', Services.LumenStomp);
