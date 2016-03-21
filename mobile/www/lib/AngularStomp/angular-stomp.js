/*
 * Copyright: 2012, V. Glenn Tarcea
 * MIT License Applies
 */

angular.module('AngularStomp', []).
    factory('ngstomp', function($rootScope) {
        var stompClient = {};

        function NGStomp(url) {
            //this.stompClient = Stomp.client(url);
            this.stompClient = Stomp.over( new WebSocket(url) );
            // use SockJS
            //this.stompClient = Stomp.over( new SockJS(url) );
            // STOMP heartbeats won't work with SockJS.
            //this.stompClient.heartbeat.outgoing = 0;
            //this.stompClient.heartbeat.incoming = 0;
            // Lumen needs big message for images & audio data URIs - maxWebSocketFrameSize doesn't work
            //this.stompClient.maxWebSocketFrameSize = 128 * 1024;
            // what should work is: -- and still doesn't work even with 3dec2014 master
            // 1. https://github.com/jmesnil/stomp-websocket/pull/76
            // 2. https://github.com/jmesnil/stomp-websocket/issues/87
        }

        NGStomp.prototype.subscribe = function(queue, callback) {
            return this.stompClient.subscribe(queue, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback(args[0]);
                })
            })
        }

        NGStomp.prototype.send = function(queue, headers, data) {
            this.stompClient.send(queue, headers, data);
        }

        NGStomp.prototype.connect = function(user, password, on_connect, on_error, vhost) {
            this.stompClient.connect(user, password,
                function(frame) {
                    $rootScope.$apply(function() {
                        on_connect.call(stompClient, frame);
                    })
                },
                function(frame) {
                    $rootScope.$apply(function() {
                        on_error.call(stompClient, frame);
                    })
                }, vhost);
        }

        NGStomp.prototype.disconnect = function(callback) {
            this.stompClient.disconnect(function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(stompClient, args);
                })
            })
        }

        return function(url) {
            return new NGStomp(url);
        }
    });
