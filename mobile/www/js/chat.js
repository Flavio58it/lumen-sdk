/// <reference path="../typings/main.d.ts"/>
/// <reference path="services.ts"/>
/* ----------- Ionic Elastichat: http://codepen.io/rossmartin/pen/XJmpQr ----------
Requires bower packages:
1. moment
2. angular-moment
3. angular-elastic
4. Autolinker.js
*/
var MockService = (function () {
    function MockService() {
    }
    return MockService;
}());
var ChatUser = (function () {
    function ChatUser() {
    }
    return ChatUser;
}());
var Locale = (function () {
    function Locale() {
    }
    return Locale;
}());
var SocialChatCtrl = (function () {
    function SocialChatCtrl($scope, $stateParams, $log, LumenStomp, Settings, $window, $rootScope, $state, MockService, $ionicActionSheet, $ionicPopup, $ionicScrollDelegate, $timeout, $interval, recorderService) {
        var _this = this;
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$log = $log;
        this.LumenStomp = LumenStomp;
        this.Settings = Settings;
        this.$window = $window;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.MockService = MockService;
        this.$ionicActionSheet = $ionicActionSheet;
        this.$ionicPopup = $ionicPopup;
        this.$ionicScrollDelegate = $ionicScrollDelegate;
        this.$timeout = $timeout;
        this.$interval = $interval;
        this.recorderService = recorderService;
        this.$inject = ['$scope', '$stateParams', '$log',
            'LumenStomp', '$window', 'Settings',
            '$rootScope', '$state', 'MockService',
            '$ionicActionSheet',
            '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$interval', 'recorderService'];
        var vm = this;
        this.messages = [];
        this.toUser = {
            _id: 'arkan',
            name: 'Arkan Lumen',
            username: 'Arkan Lumen',
            pic: 'img/nao-128.png' };
        this.user = {
            _id: 'person',
            name: 'You',
            username: 'You',
            pic: 'img/person-128.png' };
        this.avatarIds = ['nao1', 'nao2',
            'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
        this.locales = [
            { id: 'en-US', name: 'English (US)' },
            { id: 'en-UK', name: 'English (UK)' },
            { id: 'en-AU', name: 'English (Australia)' },
            { id: 'id-ID', name: 'Indonesian' },
            { id: 'ar-SA', name: 'Arabic' }
        ];
        this.form = {
            avatarId: 'nao1',
            audio: {
                inLanguage: this.locales[3],
                usedForChat: true,
                muted: false
            }
        };
        this.audioQueue = [];
        var messageCheckTimer;
        this.viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var footerBar; // gets set in $ionicView.enter
        var scroller;
        var audioQueueTimer;
        $scope.$on('$ionicView.enter', function () {
            _this.$log.debug('UserMessages $ionicView.enter');
            getMessages();
            $timeout(function () {
                footerBar = document.body.querySelector('#userMessagesView .bar-footer');
                scroller = document.body.querySelector('#userMessagesView .scroll-content');
                _this.txtInput = angular.element(footerBar.querySelector('textarea'));
            }, 0);
            messageCheckTimer = $interval(function () {
                // here you could check for new messages if your app doesn't use push notifications or user disabled them
            }, 20000);
            _this.LumenStomp.connect(function () {
                _this.client = LumenStomp.getClient();
                _this.switchAvatar();
            });
            audioQueueTimer = $interval(function () {
                if (_this.audioQueue.length == 0) {
                    return;
                }
                //$log.debug('audioQueue:', vm.audioQueue);
                var current = document.getElementById(_this.audioQueue[0]);
                if (current.paused && !current.ended) {
                    _this.$log.debug('Playing ', current, '...');
                    current.play();
                }
                else if (current.ended) {
                    _this.$log.debug('Finished playing', current);
                    _this.audioQueue.shift();
                }
            }, 250);
        });
        $scope.$on('$ionicView.beforeLeave', function () {
            _this.$log.debug('leaving UserMessages view, destroying interval');
            _this.LumenStomp.disconnect();
            // Make sure that the interval is destroyed
            if (angular.isDefined(messageCheckTimer)) {
                _this.$interval.cancel(messageCheckTimer);
                messageCheckTimer = undefined;
            }
            if (angular.isDefined(audioQueueTimer)) {
                _this.$interval.cancel(audioQueueTimer);
                audioQueueTimer = undefined;
            }
        });
        $scope.$on('$ionicView.beforeLeave', function () {
            if (!_this.form.message || _this.form.message === '') {
            }
        });
        function getMessages() {
            // the service is mock but you would probably pass the toUser's GUID here
            MockService.getUserMessages({
                toUserId: vm.toUser._id
            }).then(function (data) {
                vm.doneLoading = true;
                vm.messages = data.messages;
                $timeout(function () {
                    vm.viewScroll.scrollBottom();
                }, 0);
            });
        }
        $scope.$watch('input.message', function (newValue, oldValue) {
            _this.$log.debug('input.message $watch, newValue ' + newValue);
            if (!newValue)
                newValue = '';
            //localStorage['userMessage-' + vm.toUser._id] = newValue;
        });
        // I emit this event from the monospaced.elastic directive, read line 480
        $scope.$on('elastic:resize', function (e, ta, oldHeight, newHeight) {
            if (!ta)
                return;
            var taHeight = newHeight; // ta[0].offsetHeight;
            console.debug('taHeight:', taHeight);
            if (!footerBar)
                return;
            var newFooterHeight = taHeight + 10;
            newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
            footerBar.style.height = newFooterHeight + 'px';
            scroller.style.bottom = newFooterHeight + 'px';
        });
    }
    SocialChatCtrl.prototype.switchAvatar = function () {
        var _this = this;
        this.LumenStomp.unsubscribeAll();
        this.messages = [];
        this.LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.chat.inbox', function (exchange) {
            var communicateAction = JSON.parse(exchange.body);
            _this.$log.info("Received inbox", communicateAction.object, communicateAction);
            _this.$log.debug('map', _.map(_this.messages, function (m) { return m._id; }));
            var already = _.find(_this.messages, function (m) { return m._id == communicateAction['@id']; }) || false;
            _this.$log.debug('contains', typeof communicateAction['@id'] === 'undefined', communicateAction['@id'], already);
            if ((typeof communicateAction['@id'] === 'undefined') || !already) {
                // TODO: natively support CommunicateAction
                communicateAction.toId = _this.user._id;
                communicateAction.text = communicateAction.object;
                if (typeof communicateAction['@id'] === undefined) {
                    communicateAction['@id'] = new Date().getTime(); // :~)
                    communicateAction._id = new Date().getTime(); // :~)
                }
                communicateAction.date = new Date();
                communicateAction.username = _this.user.username;
                communicateAction.userId = _this.user._id;
                communicateAction.pic = _this.user.pic;
                _this.messages.push(communicateAction);
            }
            _this.keepKeyboardOpen();
            _this.viewScroll.scrollBottom(true);
        });
        // avatar.{avatarId}.chat.outbox
        this.LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.chat.outbox', function (exchange) {
            var communicateAction = JSON.parse(exchange.body);
            _this.$log.info("Received outbox", communicateAction.object, communicateAction);
            // TODO: natively support CommunicateAction
            communicateAction.toId = _this.user._id;
            communicateAction.text = communicateAction.object;
            communicateAction['@id'] = communicateAction['@id'] || (new Date().getTime() + '_outbox'); // :~)
            communicateAction._id = communicateAction['@id'];
            communicateAction.date = new Date();
            communicateAction.username = _this.toUser.username;
            communicateAction.userId = _this.toUser._id;
            communicateAction.pic = _this.toUser.pic;
            _this.messages.push(communicateAction);
            _this.keepKeyboardOpen();
            _this.viewScroll.scrollBottom(true);
            // has audio?
            if (communicateAction.audio) {
                var elId = 'audio_' + communicateAction['@id'];
                //var playedEl = document.getElementById(elId);
                if (!_this.form.audio.muted) {
                    _this.$log.info('Queueing ', elId, '...');
                    _this.audioQueue.push(elId);
                }
            }
        });
        // audio.out: AudioObject
        this.LumenStomp.subscribe('/topic/avatar.*.audio.out', function (exchange) {
            var msg = JSON.parse(exchange.body);
            _this.$log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes', msg);
            var playedId = 'played';
            var playedEl = document.getElementById(playedId);
            playedEl.src = msg.contentUrl;
            //this.replayPlayed();
            if (!_this.form.audio.muted) {
                _this.$log.info('Queueing ', playedId, '...');
                _this.audioQueue.push(playedId);
            }
        });
        this.$log.info('Subscriptions:', this.LumenStomp.getSubscriptions());
    };
    SocialChatCtrl.prototype.sendMessage = function (sendMessageForm) {
        var _this = this;
        var message = {
            toId: this.toUser._id,
            text: this.form.message
        };
        // if you do a web service call this will be needed as well as before the viewScroll calls
        // you can't see the effect of this in the browser it needs to be used on a real device
        // for some reason the one time blur event is not firing in the browser but does on devices
        this.keepKeyboardOpen();
        //MockService.sendMessage(message).then(function(data) {
        this.form.message = '';
        message._id = 'chat:' + new Date().getTime(); // :~)
        message['@id'] = message._id;
        message.date = new Date();
        message.username = this.user.username;
        message.userId = this.user._id;
        message.pic = this.user.pic;
        this.messages.push(message);
        var communicateAction = {
            "@type": "CommunicateAction",
            "@id": message._id,
            "object": message.text,
            "inLanguage": this.form.audio.inLanguage.id,
            "speechTruthValue": [1.0, 1.0, 0] // to get speech synthesis for reply
        };
        this.client.send('/topic/avatar.' + this.form.avatarId + '.chat.inbox', { "reply-to": '/topic/avatar.' + this.form.avatarId + '.chat.inbox' }, JSON.stringify(communicateAction));
        this.$timeout(function () {
            _this.keepKeyboardOpen();
            _this.viewScroll.scrollBottom(true);
        }, 0);
        this.$timeout(function () {
            //        vm.messages.push(MockService.getMockMessage());
            _this.keepKeyboardOpen();
            _this.viewScroll.scrollBottom(true);
        }, 2000);
        //});
    };
    /**
     * this keeps the keyboard open on a device only after sending a message, it is non obtrusive
     */
    SocialChatCtrl.prototype.keepKeyboardOpen = function () {
        var _this = this;
        this.$log.debug('keepKeyboardOpen', this.txtInput);
        this.txtInput.one('blur', function () {
            _this.$log.debug('textarea blur, focus back on it');
            _this.txtInput[0].focus();
        });
    };
    SocialChatCtrl.prototype.onMessageHold = function (e, itemIndex, message) {
        this.$log.debug('onMessageHold');
        this.$log.debug('message: ' + JSON.stringify(message, null, 2));
        this.$ionicActionSheet.show({
            buttons: [{
                    text: 'Copy Text'
                }, {
                    text: 'Delete Message'
                }],
            buttonClicked: function (index) {
                switch (index) {
                    case 0:
                        //cordova.plugins.clipboard.copy(message.text);
                        break;
                    case 1:
                        // no server side secrets here :~)
                        this.messages.splice(itemIndex, 1);
                        this.$timeout(function () {
                            this.viewScroll.resize();
                        }, 0);
                        break;
                }
                return true;
            }
        });
    };
    /**
     * this prob seems weird here but I have reasons for this in my app, secret!
     */
    SocialChatCtrl.prototype.viewProfile = function (msg) {
        if (msg.userId === this.user._id) {
        }
        else {
        }
    };
    ;
    SocialChatCtrl.prototype.replayPlayed = function () {
        var playedEl = document.getElementById('played');
        this.$log.info('Playing played ', playedEl, 'seconds ...');
        playedEl.play();
    };
    SocialChatCtrl.prototype.sendRecordedMic = function () {
        var recordedFileEl = document.getElementById('recordedMic');
        var recordedFile = recordedFileEl.files[0];
        this.$log.debug('Reading...', recordedFileEl, recordedFileEl.files, recordedFile, JSON.stringify(recordedFile));
        var reader = new FileReader();
        reader.onloadend = function () {
            this.$scope.$apply(function () {
                var audioObject = {
                    '@type': 'AudioObject',
                    inLanguage: this.form.audio.inLanguage.id,
                    name: recordedFile.name,
                    contentType: recordedFile.type,
                    contentSize: recordedFile.size,
                    dateModified: recordedFile.lastModifiedDate,
                    contentUrl: reader.result,
                    usedForChat: this.form.audio.usedForChat
                };
                this.$log.info('AudioObject', audioObject, JSON.stringify(audioObject));
                this.client.send('/topic/avatar.' + this.form.avatarId + '.audio.in', { "reply-to": '/temp-queue/avatar.' + this.form.avatarId + '.audio.in' }, JSON.stringify(audioObject));
            });
        };
        reader.readAsDataURL(recordedFile);
    };
    ;
    SocialChatCtrl.prototype.toggleMuted = function () {
        this.form.audio.muted = !this.form.audio.muted;
    };
    SocialChatCtrl.prototype.startRecord = function () {
        this.$log.debug('start...');
        this.recorderService.startRecord();
    };
    SocialChatCtrl.prototype.stopRecord = function () {
        this.$log.debug('stop...');
        this.recorderService.stopRecord();
    };
    return SocialChatCtrl;
}());
angular.module('starter.controllers')
    .controller('SocialChatCtrl', SocialChatCtrl)
    .factory('MockService', ['$http', '$q',
    function ($http, $q) {
        var me = new MockService();
        me.getUserMessages = function (d) {
            /*
            var endpoint =
              'http://www.mocky.io/v2/547cf341501c337f0c9a63fd?callback=JSON_CALLBACK';
            return $http.jsonp(endpoint).then(function(response) {
              return response.data;
            }, function(err) {
              console.log('get user messages error, err: ' + JSON.stringify(
                err, null, 2));
            });
            */
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.resolve(getMockMessages());
            }, 1500);
            return deferred.promise;
        };
        me.getMockMessage = function () {
            return {
                userId: '534b8e5aaa5e7afc1b23e69b',
                date: new Date(),
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            };
        };
        return me;
    }
])
    .filter('nl2br', ['$filter',
    function ($filter) {
        return function (data) {
            if (!data)
                return data;
            return data.replace(/\n\r?/g, '<br />');
        };
    }
])
    .directive('autolinker', ['$timeout',
    function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var eleHtml = element.html();
                    if (eleHtml === '') {
                        return false;
                    }
                    var text = Autolinker.link(eleHtml, {
                        className: 'autolinker',
                        newWindow: false
                    });
                    element.html(text);
                    var autolinks = element[0].getElementsByClassName('autolinker');
                    for (var i = 0; i < autolinks.length; i++) {
                        angular.element(autolinks[i]).bind('click', function (e) {
                            var href = e.target.href;
                            console.log('autolinkClick, href: ' + href);
                            if (href) {
                                //window.open(href, '_system');
                                window.open(href, '_blank');
                            }
                            e.preventDefault();
                            return false;
                        });
                    }
                }, 0);
            }
        };
    }
]);
function onProfilePicError(ele) {
    this.ele.src = ''; // set a fallback
}
function getMockMessages() {
    return { "messages": [], "unread": 0 };
    //  mockMessages = {"messages":[
    //    {"_id":"535d625f898df4e80e2a125e","text":"Ionic has changed the game for hybrid app development.","userId":"person","date":"2014-04-27T20:02:39.082Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},
    //    {"_id":"535f13ffee3b2a68112b9fc0","text":"I like Ionic better than ice cream!","userId":"arkan","date":"2014-04-29T02:52:47.706Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},
    //    {"_id":"546a5843fd4c5d581efa263a","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","userId":"person","date":"2014-11-17T20:19:15.289Z","read":true,"readDate":"2014-12-01T06:27:38.328Z"},{"_id":"54764399ab43d1d4113abfd1","text":"Am I dreaming?","userId":"arkan","date":"2014-11-26T21:18:17.591Z","read":true,"readDate":"2014-12-01T06:27:38.337Z"},{"_id":"547643aeab43d1d4113abfd2","text":"Is this magic?","userId":"person","date":"2014-11-26T21:18:38.549Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"547815dbab43d1d4113abfef","text":"Gee wiz, this is something special.","userId":"arkan","date":"2014-11-28T06:27:40.001Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781c69ab43d1d4113abff0","text":"I think I like Ionic more than I like ice cream!","userId":"person","date":"2014-11-28T06:55:37.350Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"Yea, it's pretty sweet","userId":"arkan","date":"2014-11-28T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},
    //    {"_id":"5478df86ab43d1d4113abff4","text":"Wow, this is really something huh?","userId":"person","date":"2014-11-28T20:48:06.572Z","read":true,"readDate":"2014-12-01T06:27:38.339Z"},
    //    {"_id":"54781ca4ab43d1d4113abff1","text":"Create amazing apps - ionicframework.com","userId":"arkan","date":"2014-11-29T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"}
    //    ],"unread":0};
    //  return mockMessages;
}
// configure moment relative time
moment.locale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d sec",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
});

//# sourceMappingURL=chat.js.map
