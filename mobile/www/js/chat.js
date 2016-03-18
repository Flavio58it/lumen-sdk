/// <reference path="../typings/main.d.ts"/>
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
    function SocialChatCtrl($scope, $stateParams, $log, LumenStomp, $window, Settings, $rootScope, $state, MockService, $ionicActionSheet, $ionicPopup, $ionicScrollDelegate, $timeout, $interval) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$log = $log;
        this.LumenStomp = LumenStomp;
        this.$window = $window;
        this.Settings = Settings;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.MockService = MockService;
        this.$ionicActionSheet = $ionicActionSheet;
        this.$ionicPopup = $ionicPopup;
        this.$ionicScrollDelegate = $ionicScrollDelegate;
        this.$timeout = $timeout;
        this.$interval = $interval;
        this.$inject = ['$scope', '$stateParams', '$log',
            'LumenStomp', '$window', 'Settings',
            '$rootScope', '$state', 'MockService',
            '$ionicActionSheet',
            '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$interval'];
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
            console.log('UserMessages $ionicView.enter');
            getMessages();
            $timeout(function () {
                footerBar = document.body.querySelector('#userMessagesView .bar-footer');
                scroller = document.body.querySelector('#userMessagesView .scroll-content');
                vm.txtInput = angular.element(footerBar.querySelector('textarea'));
            }, 0);
            messageCheckTimer = $interval(function () {
                // here you could check for new messages if your app doesn't use push notifications or user disabled them
            }, 20000);
            LumenStomp.connect(function () {
                vm.client = LumenStomp.getClient();
                vm.switchAvatar();
            });
            audioQueueTimer = $interval(function () {
                if (vm.audioQueue.length == 0) {
                    return;
                }
                //$log.debug('audioQueue:', vm.audioQueue);
                var current = document.getElementById(vm.audioQueue[0]);
                if (current.paused && !current.ended) {
                    $log.debug('Playing ', current, '...');
                    current.play();
                }
                else if (current.ended) {
                    $log.debug('Finished playing', current);
                    vm.audioQueue.shift();
                }
            }, 250);
        });
        $scope.$on('$ionicView.beforeLeave', function () {
            console.log('leaving UserMessages view, destroying interval');
            LumenStomp.disconnect();
            // Make sure that the interval is destroyed
            if (angular.isDefined(messageCheckTimer)) {
                $interval.cancel(messageCheckTimer);
                messageCheckTimer = undefined;
            }
            if (angular.isDefined(audioQueueTimer)) {
                $interval.cancel(audioQueueTimer);
                audioQueueTimer = undefined;
            }
        });
        $scope.$on('$ionicView.beforeLeave', function () {
            if (!vm.form.message || vm.form.message === '') {
                localStorage.removeItem('userMessage-' + vm.toUser._id);
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
            $log.debug('input.message $watch, newValue ' + newValue);
            if (!newValue)
                newValue = '';
            localStorage['userMessage-' + vm.toUser._id] = newValue;
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
        var vm = this;
        this.LumenStomp.unsubscribeAll();
        this.messages = [];
        this.LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.chat.inbox', function (exchange) {
            var communicateAction = JSON.parse(exchange.body);
            vm.$log.info("Received inbox", communicateAction.object, communicateAction);
            vm.$log.debug('map', _.map(vm.messages, function (m) { return m._id; }));
            var already = _.find(vm.messages, function (m) { return m._id == communicateAction['@id']; }) || false;
            vm.$log.debug('contains', typeof communicateAction['@id'] === 'undefined', communicateAction['@id'], already);
            if ((typeof communicateAction['@id'] === 'undefined') || !already) {
                // TODO: natively support CommunicateAction
                communicateAction.toId = vm.user._id;
                communicateAction.text = communicateAction.object;
                if (typeof communicateAction['@id'] === undefined) {
                    communicateAction['@id'] = new Date().getTime(); // :~)
                    communicateAction._id = new Date().getTime(); // :~)
                }
                communicateAction.date = new Date();
                communicateAction.username = vm.user.username;
                communicateAction.userId = vm.user._id;
                communicateAction.pic = vm.user.pic;
                vm.messages.push(communicateAction);
            }
            vm.keepKeyboardOpen.call(vm);
            vm.viewScroll.scrollBottom(true);
        });
        // avatar.{avatarId}.chat.outbox
        this.LumenStomp.subscribe('/topic/avatar.' + vm.form.avatarId + '.chat.outbox', function (exchange) {
            var communicateAction = JSON.parse(exchange.body);
            vm.$log.info("Received outbox", communicateAction.object, communicateAction);
            // TODO: natively support CommunicateAction
            communicateAction.toId = vm.user._id;
            communicateAction.text = communicateAction.object;
            communicateAction['@id'] = communicateAction['@id'] || (new Date().getTime() + '_outbox'); // :~)
            communicateAction._id = communicateAction['@id'];
            communicateAction.date = new Date();
            communicateAction.username = vm.toUser.username;
            communicateAction.userId = vm.toUser._id;
            communicateAction.pic = vm.toUser.pic;
            vm.messages.push(communicateAction);
            vm.keepKeyboardOpen.call(vm);
            vm.viewScroll.scrollBottom(true);
            // has audio?
            if (communicateAction.audio) {
                var elId = 'audio_' + communicateAction['@id'];
                //var playedEl = document.getElementById(elId);
                if (!vm.form.audio.muted) {
                    vm.$log.info('Queueing ', elId, '...');
                    vm.audioQueue.push(elId);
                }
            }
        });
        // audio.out: AudioObject
        this.LumenStomp.subscribe('/topic/avatar.*.audio.out', function (exchange) {
            var msg = JSON.parse(exchange.body);
            vm.$log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes', msg);
            var playedId = 'played';
            var playedEl = document.getElementById(playedId);
            playedEl.src = msg.contentUrl;
            //vm.replayPlayed();
            if (!vm.form.audio.muted) {
                vm.$log.info('Queueing ', playedId, '...');
                vm.audioQueue.push(playedId);
            }
        });
        this.$log.info('Subscriptions:', this.LumenStomp.getSubscriptions());
    };
    SocialChatCtrl.prototype.sendMessage = function (sendMessageForm) {
        var vm = this;
        var message = {
            toId: this.toUser._id,
            text: this.form.message
        };
        // if you do a web service call this will be needed as well as before the viewScroll calls
        // you can't see the effect of this in the browser it needs to be used on a real device
        // for some reason the one time blur event is not firing in the browser but does on devices
        this.keepKeyboardOpen.call(vm);
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
            vm.keepKeyboardOpen.call(vm);
            vm.viewScroll.scrollBottom(true);
        }, 0);
        this.$timeout(function () {
            //        vm.messages.push(MockService.getMockMessage());
            vm.keepKeyboardOpen.call(vm);
            vm.viewScroll.scrollBottom(true);
        }, 2000);
        //});
    };
    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    SocialChatCtrl.prototype.keepKeyboardOpen = function () {
        var vm = this;
        vm.$log.debug('keepKeyboardOpen', this.txtInput);
        vm.txtInput.one('blur', function () {
            vm.$log.debug('textarea blur, focus back on it');
            vm.txtInput[0].focus();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNENBQTRDO0FBQzVDOzs7Ozs7RUFNRTtBQVlGO0lBQUE7SUFHQSxDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUhBLEFBR0MsSUFBQTtBQUVEO0lBQUE7SUFLQSxDQUFDO0lBQUQsZUFBQztBQUFELENBTEEsQUFLQyxJQUFBO0FBRUQ7SUFBQTtJQUdBLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FIQSxBQUdDLElBQUE7QUFFRDtJQXNCSSx3QkFBbUIsTUFBTSxFQUFTLFlBQVksRUFBUyxJQUFJLEVBQ2hELFVBQVUsRUFBUyxPQUFlLEVBQVMsUUFBUSxFQUNuRCxVQUFVLEVBQVMsTUFBTSxFQUFTLFdBQVcsRUFDN0MsaUJBQWlCLEVBQ2pCLFdBQTBDLEVBQzFDLG9CQUFzRCxFQUN0RCxRQUFRLEVBQVMsU0FBUztRQU5sQixXQUFNLEdBQU4sTUFBTSxDQUFBO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQUE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFBO1FBQ2hELGVBQVUsR0FBVixVQUFVLENBQUE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBQTtRQUNuRCxlQUFVLEdBQVYsVUFBVSxDQUFBO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBQTtRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFBO1FBQzdDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBQTtRQUNqQixnQkFBVyxHQUFYLFdBQVcsQ0FBK0I7UUFDMUMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFrQztRQUN0RCxhQUFRLEdBQVIsUUFBUSxDQUFBO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBQTtRQTNCOUIsWUFBTyxHQUFHLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxNQUFNO1lBQzlDLFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVTtZQUNuQyxZQUFZLEVBQUUsUUFBUSxFQUFFLGFBQWE7WUFDckMsbUJBQW1CO1lBQ25CLGFBQWEsRUFBRSxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUF3QnBFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztRQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDVixHQUFHLEVBQUUsT0FBTztZQUNaLElBQUksRUFBRSxhQUFhO1lBQ25CLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLEdBQUcsRUFBRSxpQkFBaUIsRUFBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDUixHQUFHLEVBQUUsUUFBUTtZQUNiLElBQUksRUFBRSxLQUFLO1lBQ1gsUUFBUSxFQUFFLEtBQUs7WUFDZixHQUFHLEVBQUUsb0JBQW9CLEVBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU07WUFDNUIsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDekcsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNYLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO1lBQ25DLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO1lBQ25DLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUM7WUFDMUMsRUFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUM7WUFDakMsRUFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUM7U0FDaEMsQ0FBQztRQUNGLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDUixRQUFRLEVBQUUsTUFBTTtZQUNoQixLQUFLLEVBQUU7Z0JBQ0gsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixXQUFXLEVBQUUsSUFBSTtnQkFDakIsS0FBSyxFQUFFLEtBQUs7YUFDZjtTQUNKLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUVyQixJQUFJLGlCQUFpQixDQUFDO1FBRXRCLElBQUksQ0FBQyxVQUFVLEdBQUcsb0JBQW9CLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDekUsSUFBSSxTQUFTLENBQUMsQ0FBQywrQkFBK0I7UUFDOUMsSUFBSSxRQUFRLENBQUM7UUFDYixJQUFJLGVBQWUsQ0FBQztRQUVwQixNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFO1lBRTNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUU3QyxXQUFXLEVBQUUsQ0FBQztZQUVkLFFBQVEsQ0FBQztnQkFDTCxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsK0JBQStCLENBQUMsQ0FBQztnQkFDekUsUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7Z0JBQzVFLEVBQUUsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdkUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRU4saUJBQWlCLEdBQUcsU0FBUyxDQUFDO2dCQUMxQix5R0FBeUc7WUFDN0csQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRVYsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDZixFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDbkMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBRUgsZUFBZSxHQUFHLFNBQVMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0QsMkNBQTJDO2dCQUMzQyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQXFCLENBQUM7Z0JBQzVFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN2QyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ25CLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN4QyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMxQixDQUFDO1lBQ0wsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFO1lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0RBQWdELENBQUMsQ0FBQztZQUM5RCxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDeEIsMkNBQTJDO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO1lBQ2xDLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDbEMsZUFBZSxHQUFHLFNBQVMsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsWUFBWSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSDtZQUNFLHlFQUF5RTtZQUN6RSxXQUFXLENBQUMsZUFBZSxDQUFDO2dCQUMxQixRQUFRLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHO2FBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO2dCQUNuQixFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDdEIsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUU1QixRQUFRLENBQUM7b0JBQ1AsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDL0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsVUFBUyxRQUFRLEVBQUUsUUFBUTtZQUN4RCxJQUFJLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDN0IsWUFBWSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUVILHlFQUF5RTtRQUN6RSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLFVBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUztZQUMvRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFFaEIsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsc0JBQXNCO1lBQ2hELE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXJDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUV2QixJQUFJLGVBQWUsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ3BDLGVBQWUsR0FBRyxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsR0FBRyxlQUFlLEdBQUcsRUFBRSxDQUFDO1lBRWhFLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDaEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFQyxxQ0FBWSxHQUFaO1FBQ0ksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLEVBQUUsVUFBUyxRQUFRO1lBQzlGLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFFNUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFTLENBQWMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckYsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVMsQ0FBYyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDO1lBQ25ILEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxLQUFLLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5RyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8saUJBQWlCLENBQUMsS0FBSyxDQUFDLEtBQUssV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUVoRSwyQ0FBMkM7Z0JBQzNDLGlCQUFpQixDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDckMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztnQkFDbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsTUFBTTtvQkFDdkQsaUJBQWlCLENBQUMsR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxNQUFNO2dCQUN4RCxDQUFDO2dCQUNELGlCQUFpQixDQUFDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNwQyxpQkFBaUIsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQzlDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDdkMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUVwQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFFRCxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsRUFBRSxVQUFTLFFBQVE7WUFDN0YsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUU3RSwyQ0FBMkM7WUFDM0MsaUJBQWlCLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ3JDLGlCQUFpQixDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7WUFDbEQsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTTtZQUNqRyxpQkFBaUIsQ0FBQyxHQUFHLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakQsaUJBQWlCLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDcEMsaUJBQWlCLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2hELGlCQUFpQixDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUN6QyxpQkFBaUIsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFFdEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpDLGFBQWE7WUFDYixFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLElBQUksR0FBRyxRQUFRLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9DLCtDQUErQztnQkFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2QixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN2QyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztZQUVMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILHlCQUF5QjtRQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsRUFBRSxVQUFTLFFBQVE7WUFDcEUsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3pGLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN4QixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBcUIsQ0FBQztZQUNyRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDOUIsb0JBQW9CO1lBQ3BCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDM0MsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELG9DQUFXLEdBQVgsVUFBWSxlQUFlO1FBQ3ZCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLE9BQU8sR0FBZ0I7WUFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBYTtZQUMvQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFpQjtTQUNsQyxDQUFDO1FBRUYsMEZBQTBGO1FBQzFGLHVGQUF1RjtRQUN2RiwyRkFBMkY7UUFDM0YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUvQix3REFBd0Q7UUFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRXZCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxNQUFNO1FBQ3BELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUMxQixPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUU1QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1QixJQUFJLGlCQUFpQixHQUFHO1lBQ3RCLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHO1lBQ2xCLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSTtZQUN0QixZQUFZLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDM0Msa0JBQWtCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9DQUFvQztTQUN2RSxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxFQUNuRCxFQUFDLFVBQVUsRUFBRSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLEVBQUMsRUFDbkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNaLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRU4sSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNwQix5REFBeUQ7WUFDakQsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QixFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFVCxLQUFLO0lBQ1AsQ0FBQztJQUVELDZGQUE2RjtJQUM3Rix5Q0FBZ0IsR0FBaEI7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRTtZQUN0QixFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUgsc0NBQWEsR0FBYixVQUFjLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTztRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQUUsQ0FBQztvQkFDUixJQUFJLEVBQUUsV0FBVztpQkFDbEIsRUFBRTtvQkFDRCxJQUFJLEVBQUUsZ0JBQWdCO2lCQUN2QixDQUFDO1lBQ0YsYUFBYSxFQUFFLFVBQVMsS0FBSztnQkFDM0IsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDZCxLQUFLLENBQUM7d0JBQ0osK0NBQStDO3dCQUUvQyxLQUFLLENBQUM7b0JBQ1IsS0FBSyxDQUFDO3dCQUNKLGtDQUFrQzt3QkFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDOzRCQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7d0JBQzNCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFTixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILG9DQUFXLEdBQVgsVUFBWSxHQUFHO1FBQ2IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFbkMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1FBRVIsQ0FBQztJQUNILENBQUM7O0lBRUQscUNBQVksR0FBWjtRQUNJLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFxQixDQUFDO1FBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMzRCxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELHdDQUFlLEdBQWY7UUFDSSxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBcUIsQ0FBQztRQUNoRixJQUFJLFlBQVksR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2hILElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLFNBQVMsR0FBRztZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNmLElBQUksV0FBVyxHQUFHO29CQUNkLE9BQU8sRUFBRSxhQUFhO29CQUN0QixVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ3pDLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSTtvQkFDdkIsV0FBVyxFQUFFLFlBQVksQ0FBQyxJQUFJO29CQUM5QixXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUk7b0JBQzlCLFlBQVksRUFBRSxZQUFZLENBQUMsZ0JBQWdCO29CQUMzQyxVQUFVLEVBQUUsTUFBTSxDQUFDLE1BQU07b0JBQ3pCLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXO2lCQUMzQyxDQUFDO2dCQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN4RSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLEVBQ2hFLEVBQUMsVUFBVSxFQUFFLHFCQUFxQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsRUFBQyxFQUN0RSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7O0lBRUgsb0NBQVcsR0FBWDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUNuRCxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQXRYQSxBQXNYQyxJQUFBO0FBRUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztLQUNwQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDO0tBRTVDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSTtJQUNwQyxVQUFTLEtBQUssRUFBRSxFQUFFO1FBQ2hCLElBQUksRUFBRSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFFM0IsRUFBRSxDQUFDLGVBQWUsR0FBRyxVQUFTLENBQUM7WUFDN0I7Ozs7Ozs7OztjQVNFO1lBQ0YsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTdCLFVBQVUsQ0FBQztnQkFDUCxRQUFRLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFDdEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRVIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDMUIsQ0FBQyxDQUFDO1FBRUYsRUFBRSxDQUFDLGNBQWMsR0FBRztZQUNsQixNQUFNLENBQUM7Z0JBQ0wsTUFBTSxFQUFFLDBCQUEwQjtnQkFDbEMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFO2dCQUNoQixJQUFJLEVBQUUseU9BQXlPO2FBQ2hQLENBQUM7UUFDSixDQUFDLENBQUE7UUFFRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztDQUNGLENBQUM7S0FHRCxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUztJQUN6QixVQUFTLE9BQU87UUFDZCxNQUFNLENBQUMsVUFBUyxJQUFJO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDO0tBR0QsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLFVBQVU7SUFDbEMsVUFBUyxRQUFRO1FBQ2YsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLEdBQUc7WUFDYixJQUFJLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUs7Z0JBQ2xDLFFBQVEsQ0FBQztvQkFDUCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBRTdCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO29CQUNmLENBQUM7b0JBRUQsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ2xDLFNBQVMsRUFBRSxZQUFZO3dCQUN2QixTQUFTLEVBQUUsS0FBSztxQkFDakIsQ0FBQyxDQUFDO29CQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRW5CLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFaEUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQzFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQUM7NEJBQ3BELElBQUksSUFBSSxHQUFJLENBQUMsQ0FBQyxNQUE0QixDQUFDLElBQUksQ0FBQzs0QkFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsQ0FBQzs0QkFFNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDVCwrQkFBK0I7Z0NBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzRCQUM5QixDQUFDOzRCQUVELENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs0QkFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQzt3QkFDZixDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDO2dCQUNILENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNSLENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQTtBQUVGLDJCQUEyQixHQUFHO0lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQjtBQUN0QyxDQUFDO0FBRUQ7SUFDRSxNQUFNLENBQUMsRUFBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUMsQ0FBQztJQUN2QyxnQ0FBZ0M7SUFDaEMsK01BQStNO0lBQy9NLDJMQUEyTDtJQUMzTCx1N0NBQXU3QztJQUN2N0MsMkxBQTJMO0lBQzNMLCtMQUErTDtJQUMvTCxvQkFBb0I7SUFDcEIsd0JBQXdCO0FBQ3hCLENBQUM7QUFLRCxpQ0FBaUM7QUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7SUFDbEIsWUFBWSxFQUFFO1FBQ1osTUFBTSxFQUFFLE9BQU87UUFDZixJQUFJLEVBQUUsUUFBUTtRQUNkLENBQUMsRUFBRSxRQUFRO1FBQ1gsQ0FBQyxFQUFFLFVBQVU7UUFDYixFQUFFLEVBQUUsWUFBWTtRQUNoQixDQUFDLEVBQUUsU0FBUztRQUNaLEVBQUUsRUFBRSxVQUFVO1FBQ2QsQ0FBQyxFQUFFLE9BQU87UUFDVixFQUFFLEVBQUUsU0FBUztRQUNiLENBQUMsRUFBRSxTQUFTO1FBQ1osRUFBRSxFQUFFLFdBQVc7UUFDZixDQUFDLEVBQUUsUUFBUTtRQUNYLEVBQUUsRUFBRSxVQUFVO0tBQ2Y7Q0FDRixDQUFDLENBQUMiLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL21haW4uZC50c1wiLz5cclxuLyogLS0tLS0tLS0tLS0gSW9uaWMgRWxhc3RpY2hhdDogaHR0cDovL2NvZGVwZW4uaW8vcm9zc21hcnRpbi9wZW4vWEptcFFyIC0tLS0tLS0tLS1cclxuUmVxdWlyZXMgYm93ZXIgcGFja2FnZXM6XHJcbjEuIG1vbWVudFxyXG4yLiBhbmd1bGFyLW1vbWVudFxyXG4zLiBhbmd1bGFyLWVsYXN0aWNcclxuNC4gQXV0b2xpbmtlci5qc1xyXG4qL1xyXG5cclxuaW50ZXJmYWNlIENoYXRNZXNzYWdlIHtcclxuICAgIF9pZD86IHN0cmluZyxcclxuICAgIHRvSWQ/OiBzdHJpbmcsXHJcbiAgICB0ZXh0Pzogc3RyaW5nLFxyXG4gICAgZGF0ZT86IERhdGUsXHJcbiAgICB1c2VybmFtZT86IHN0cmluZyxcclxuICAgIHVzZXJJZD86IHN0cmluZyxcclxuICAgIHBpYz86IHN0cmluZ1xyXG59XHJcblxyXG5jbGFzcyBNb2NrU2VydmljZSB7XHJcbiAgICBnZXRVc2VyTWVzc2FnZXM6IGFueTtcclxuICAgIGdldE1vY2tNZXNzYWdlOiBhbnk7XHJcbn1cclxuXHJcbmNsYXNzIENoYXRVc2VyIHtcclxuICAgIF9pZDogc3RyaW5nO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdXNlcm5hbWU6IHN0cmluZztcclxuICAgIHBpYzogc3RyaW5nO1xyXG59XHJcblxyXG5jbGFzcyBMb2NhbGUge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxufVxyXG5cclxuY2xhc3MgU29jaWFsQ2hhdEN0cmwge1xyXG4gICAgcHVibGljICRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGxvZycsIFxyXG4gICAgICAgICdMdW1lblN0b21wJywgJyR3aW5kb3cnLCAnU2V0dGluZ3MnLFxyXG4gICAgICAgICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICdNb2NrU2VydmljZScsXHJcbiAgICAgICAgJyRpb25pY0FjdGlvblNoZWV0JyxcclxuICAgICAgICAnJGlvbmljUG9wdXAnLCAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLCAnJHRpbWVvdXQnLCAnJGludGVydmFsJ107XHJcbiAgICAgICAgXHJcbiAgICBtZXNzYWdlczogQ2hhdE1lc3NhZ2VbXTtcclxuICAgIGZvcm06IGFueTtcclxuICAgIHRvVXNlcjogQ2hhdFVzZXI7XHJcbiAgICB1c2VyOiBDaGF0VXNlcjtcclxuICAgIGF2YXRhcklkczogc3RyaW5nW107XHJcbiAgICBsb2NhbGVzOiBMb2NhbGVbXTtcclxuICAgIC8qKlxyXG4gICAgICogcXVldWUgb2YgSURzIG9mIEhUTUxBdWRpb0VsZW1lbnQgdG8gYmUgcGxheWVkXHJcbiAgICAgKi9cclxuICAgIGF1ZGlvUXVldWU6IHN0cmluZ1tdO1xyXG4gICAgY2xpZW50OiBhbnk7XHJcbiAgICBkb25lTG9hZGluZzogYm9vbGVhbjtcclxuICAgIHR4dElucHV0OiBKUXVlcnk7XHJcbiAgICB2aWV3U2Nyb2xsOiBpb25pYy5zY3JvbGwuSW9uaWNTY3JvbGxEZWxlZ2F0ZTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocHVibGljICRzY29wZSwgcHVibGljICRzdGF0ZVBhcmFtcywgcHVibGljICRsb2csIFxyXG4gICAgICAgIHB1YmxpYyBMdW1lblN0b21wLCBwdWJsaWMgJHdpbmRvdzogV2luZG93LCBwdWJsaWMgU2V0dGluZ3MsXHJcbiAgICAgICAgcHVibGljICRyb290U2NvcGUsIHB1YmxpYyAkc3RhdGUsIHB1YmxpYyBNb2NrU2VydmljZSxcclxuICAgICAgICBwdWJsaWMgJGlvbmljQWN0aW9uU2hlZXQsXHJcbiAgICAgICAgcHVibGljICRpb25pY1BvcHVwOiBpb25pYy5wb3B1cC5Jb25pY1BvcHVwU2VydmljZSxcclxuICAgICAgICBwdWJsaWMgJGlvbmljU2Nyb2xsRGVsZWdhdGU6IGlvbmljLnNjcm9sbC5Jb25pY1Njcm9sbERlbGVnYXRlLCBcclxuICAgICAgICBwdWJsaWMgJHRpbWVvdXQsIHB1YmxpYyAkaW50ZXJ2YWwpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB0aGlzLm1lc3NhZ2VzID0gW107XHJcbiAgICB0aGlzLnRvVXNlciA9IHtcclxuICAgICAgICBfaWQ6ICdhcmthbicsXHJcbiAgICAgICAgbmFtZTogJ0Fya2FuIEx1bWVuJyxcclxuICAgICAgICB1c2VybmFtZTogJ0Fya2FuIEx1bWVuJyxcclxuICAgICAgICBwaWM6ICdpbWcvbmFvLTEyOC5wbmcnfTtcclxuICAgIHRoaXMudXNlciA9IHtcclxuICAgICAgICBfaWQ6ICdwZXJzb24nLFxyXG4gICAgICAgIG5hbWU6ICdZb3UnLFxyXG4gICAgICAgIHVzZXJuYW1lOiAnWW91JyxcclxuICAgICAgICBwaWM6ICdpbWcvcGVyc29uLTEyOC5wbmcnfTtcclxuICAgIHRoaXMuYXZhdGFySWRzID0gWyduYW8xJywgJ25hbzInLFxyXG4gICAgICAgICdhbmltZTEnLCAnYW5pbWUyJywgJ2FuaW1lMycsICdhbmltZTQnLCAnYW5pbWU1JywgJ2FuaW1lNicsICdhbmltZTcnLCAnYW5pbWU4JywgJ2FuaW1lOScsICdhbmltZTEwJ107XHJcbiAgICB0aGlzLmxvY2FsZXMgPSBbXHJcbiAgICAgICAge2lkOiAnZW4tVVMnLCBuYW1lOiAnRW5nbGlzaCAoVVMpJ30sXHJcbiAgICAgICAge2lkOiAnZW4tVUsnLCBuYW1lOiAnRW5nbGlzaCAoVUspJ30sXHJcbiAgICAgICAge2lkOiAnZW4tQVUnLCBuYW1lOiAnRW5nbGlzaCAoQXVzdHJhbGlhKSd9LFxyXG4gICAgICAgIHtpZDogJ2lkLUlEJywgbmFtZTogJ0luZG9uZXNpYW4nfSxcclxuICAgICAgICB7aWQ6ICdhci1TQScsIG5hbWU6ICdBcmFiaWMnfVxyXG4gICAgXTtcclxuICAgIHRoaXMuZm9ybSA9IHtcclxuICAgICAgICBhdmF0YXJJZDogJ25hbzEnLFxyXG4gICAgICAgIGF1ZGlvOiB7XHJcbiAgICAgICAgICAgIGluTGFuZ3VhZ2U6IHRoaXMubG9jYWxlc1szXSxcclxuICAgICAgICAgICAgdXNlZEZvckNoYXQ6IHRydWUsXHJcbiAgICAgICAgICAgIG11dGVkOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aGlzLmF1ZGlvUXVldWUgPSBbXTtcclxuXHJcbiAgICB2YXIgbWVzc2FnZUNoZWNrVGltZXI7XHJcblxyXG4gICAgdGhpcy52aWV3U2Nyb2xsID0gJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCd1c2VyTWVzc2FnZVNjcm9sbCcpO1xyXG4gICAgdmFyIGZvb3RlckJhcjsgLy8gZ2V0cyBzZXQgaW4gJGlvbmljVmlldy5lbnRlclxyXG4gICAgdmFyIHNjcm9sbGVyO1xyXG4gICAgdmFyIGF1ZGlvUXVldWVUaW1lcjtcclxuXHJcbiAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmVudGVyJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdVc2VyTWVzc2FnZXMgJGlvbmljVmlldy5lbnRlcicpO1xyXG5cclxuICAgICAgICBnZXRNZXNzYWdlcygpO1xyXG5cclxuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZm9vdGVyQmFyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjdXNlck1lc3NhZ2VzVmlldyAuYmFyLWZvb3RlcicpO1xyXG4gICAgICAgICAgICBzY3JvbGxlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI3VzZXJNZXNzYWdlc1ZpZXcgLnNjcm9sbC1jb250ZW50Jyk7XHJcbiAgICAgICAgICAgIHZtLnR4dElucHV0ID0gYW5ndWxhci5lbGVtZW50KGZvb3RlckJhci5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpKTtcclxuICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgbWVzc2FnZUNoZWNrVGltZXIgPSAkaW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIGhlcmUgeW91IGNvdWxkIGNoZWNrIGZvciBuZXcgbWVzc2FnZXMgaWYgeW91ciBhcHAgZG9lc24ndCB1c2UgcHVzaCBub3RpZmljYXRpb25zIG9yIHVzZXIgZGlzYWJsZWQgdGhlbVxyXG4gICAgICAgIH0sIDIwMDAwKTtcclxuXHJcbiAgICAgICAgTHVtZW5TdG9tcC5jb25uZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2bS5jbGllbnQgPSBMdW1lblN0b21wLmdldENsaWVudCgpO1xyXG4gICAgICAgICAgICB2bS5zd2l0Y2hBdmF0YXIoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYXVkaW9RdWV1ZVRpbWVyID0gJGludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodm0uYXVkaW9RdWV1ZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vJGxvZy5kZWJ1ZygnYXVkaW9RdWV1ZTonLCB2bS5hdWRpb1F1ZXVlKTtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5hdWRpb1F1ZXVlWzBdKSBhcyBIVE1MTWVkaWFFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudC5wYXVzZWQgJiYgIWN1cnJlbnQuZW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ1BsYXlpbmcgJywgY3VycmVudCwgJy4uLicpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudC5wbGF5KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5lbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnRmluaXNoZWQgcGxheWluZycsIGN1cnJlbnQpO1xyXG4gICAgICAgICAgICAgICAgdm0uYXVkaW9RdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMjUwKTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS4kb24oJyRpb25pY1ZpZXcuYmVmb3JlTGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbGVhdmluZyBVc2VyTWVzc2FnZXMgdmlldywgZGVzdHJveWluZyBpbnRlcnZhbCcpO1xyXG4gICAgICAgIEx1bWVuU3RvbXAuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBpbnRlcnZhbCBpcyBkZXN0cm95ZWRcclxuICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQobWVzc2FnZUNoZWNrVGltZXIpKSB7XHJcbiAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwobWVzc2FnZUNoZWNrVGltZXIpO1xyXG4gICAgICAgICAgICBtZXNzYWdlQ2hlY2tUaW1lciA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGF1ZGlvUXVldWVUaW1lcikpIHtcclxuICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChhdWRpb1F1ZXVlVGltZXIpO1xyXG4gICAgICAgICAgICBhdWRpb1F1ZXVlVGltZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVMZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoIXZtLmZvcm0ubWVzc2FnZSB8fCB2bS5mb3JtLm1lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXJNZXNzYWdlLScgKyB2bS50b1VzZXIuX2lkKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TWVzc2FnZXMoKSB7XHJcbiAgICAgIC8vIHRoZSBzZXJ2aWNlIGlzIG1vY2sgYnV0IHlvdSB3b3VsZCBwcm9iYWJseSBwYXNzIHRoZSB0b1VzZXIncyBHVUlEIGhlcmVcclxuICAgICAgTW9ja1NlcnZpY2UuZ2V0VXNlck1lc3NhZ2VzKHtcclxuICAgICAgICB0b1VzZXJJZDogdm0udG9Vc2VyLl9pZFxyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2bS5kb25lTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgdm0ubWVzc2FnZXMgPSBkYXRhLm1lc3NhZ2VzO1xyXG5cclxuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZtLnZpZXdTY3JvbGwuc2Nyb2xsQm90dG9tKCk7XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS4kd2F0Y2goJ2lucHV0Lm1lc3NhZ2UnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcclxuICAgICAgJGxvZy5kZWJ1ZygnaW5wdXQubWVzc2FnZSAkd2F0Y2gsIG5ld1ZhbHVlICcgKyBuZXdWYWx1ZSk7XHJcbiAgICAgIGlmICghbmV3VmFsdWUpIG5ld1ZhbHVlID0gJyc7XHJcbiAgICAgIGxvY2FsU3RvcmFnZVsndXNlck1lc3NhZ2UtJyArIHZtLnRvVXNlci5faWRdID0gbmV3VmFsdWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBJIGVtaXQgdGhpcyBldmVudCBmcm9tIHRoZSBtb25vc3BhY2VkLmVsYXN0aWMgZGlyZWN0aXZlLCByZWFkIGxpbmUgNDgwXHJcbiAgICAkc2NvcGUuJG9uKCdlbGFzdGljOnJlc2l6ZScsIGZ1bmN0aW9uKGUsIHRhLCBvbGRIZWlnaHQsIG5ld0hlaWdodCkge1xyXG4gICAgICBpZiAoIXRhKSByZXR1cm47XHJcblxyXG4gICAgICB2YXIgdGFIZWlnaHQgPSBuZXdIZWlnaHQ7IC8vIHRhWzBdLm9mZnNldEhlaWdodDtcclxuICAgICAgY29uc29sZS5kZWJ1ZygndGFIZWlnaHQ6JywgdGFIZWlnaHQpO1xyXG5cclxuICAgICAgaWYgKCFmb290ZXJCYXIpIHJldHVybjtcclxuXHJcbiAgICAgIHZhciBuZXdGb290ZXJIZWlnaHQgPSB0YUhlaWdodCArIDEwO1xyXG4gICAgICBuZXdGb290ZXJIZWlnaHQgPSAobmV3Rm9vdGVySGVpZ2h0ID4gNDQpID8gbmV3Rm9vdGVySGVpZ2h0IDogNDQ7XHJcblxyXG4gICAgICBmb290ZXJCYXIuc3R5bGUuaGVpZ2h0ID0gbmV3Rm9vdGVySGVpZ2h0ICsgJ3B4JztcclxuICAgICAgc2Nyb2xsZXIuc3R5bGUuYm90dG9tID0gbmV3Rm9vdGVySGVpZ2h0ICsgJ3B4JztcclxuICAgIH0pO1xyXG5cclxuICB9XHJcbiAgXHJcbiAgICBzd2l0Y2hBdmF0YXIoKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB0aGlzLkx1bWVuU3RvbXAudW5zdWJzY3JpYmVBbGwoKTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gW107XHJcbiAgICAgICAgdGhpcy5MdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2F2YXRhci4nICsgdGhpcy5mb3JtLmF2YXRhcklkICsgJy5jaGF0LmluYm94JywgZnVuY3Rpb24oZXhjaGFuZ2UpIHtcclxuICAgICAgICAgICAgdmFyIGNvbW11bmljYXRlQWN0aW9uID0gSlNPTi5wYXJzZShleGNoYW5nZS5ib2R5KTtcclxuICAgICAgICAgICAgdm0uJGxvZy5pbmZvKFwiUmVjZWl2ZWQgaW5ib3hcIiwgY29tbXVuaWNhdGVBY3Rpb24ub2JqZWN0LCBjb21tdW5pY2F0ZUFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICB2bS4kbG9nLmRlYnVnKCdtYXAnLCBfLm1hcCh2bS5tZXNzYWdlcywgZnVuY3Rpb24obTogQ2hhdE1lc3NhZ2UpIHsgcmV0dXJuIG0uX2lkOyB9KSk7XHJcbiAgICAgICAgICAgIHZhciBhbHJlYWR5ID0gXy5maW5kKHZtLm1lc3NhZ2VzLCBmdW5jdGlvbihtOiBDaGF0TWVzc2FnZSkgeyByZXR1cm4gbS5faWQgPT0gY29tbXVuaWNhdGVBY3Rpb25bJ0BpZCddOyB9KSB8fCBmYWxzZTtcclxuICAgICAgICAgICAgdm0uJGxvZy5kZWJ1ZygnY29udGFpbnMnLCB0eXBlb2YgY29tbXVuaWNhdGVBY3Rpb25bJ0BpZCddID09PSAndW5kZWZpbmVkJywgY29tbXVuaWNhdGVBY3Rpb25bJ0BpZCddLCBhbHJlYWR5KTtcclxuICAgICAgICAgICAgaWYgKCh0eXBlb2YgY29tbXVuaWNhdGVBY3Rpb25bJ0BpZCddID09PSAndW5kZWZpbmVkJykgfHwgIWFscmVhZHkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBuYXRpdmVseSBzdXBwb3J0IENvbW11bmljYXRlQWN0aW9uXHJcbiAgICAgICAgICAgICAgICBjb21tdW5pY2F0ZUFjdGlvbi50b0lkID0gdm0udXNlci5faWQ7XHJcbiAgICAgICAgICAgICAgICBjb21tdW5pY2F0ZUFjdGlvbi50ZXh0ID0gY29tbXVuaWNhdGVBY3Rpb24ub2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21tdW5pY2F0ZUFjdGlvblsnQGlkJ10gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW11bmljYXRlQWN0aW9uWydAaWQnXSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpOyAvLyA6filcclxuICAgICAgICAgICAgICAgICAgICBjb21tdW5pY2F0ZUFjdGlvbi5faWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTsgLy8gOn4pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21tdW5pY2F0ZUFjdGlvbi5kYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbW11bmljYXRlQWN0aW9uLnVzZXJuYW1lID0gdm0udXNlci51c2VybmFtZTtcclxuICAgICAgICAgICAgICAgIGNvbW11bmljYXRlQWN0aW9uLnVzZXJJZCA9IHZtLnVzZXIuX2lkO1xyXG4gICAgICAgICAgICAgICAgY29tbXVuaWNhdGVBY3Rpb24ucGljID0gdm0udXNlci5waWM7XHJcblxyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZXMucHVzaChjb21tdW5pY2F0ZUFjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLmtlZXBLZXlib2FyZE9wZW4uY2FsbCh2bSk7XHJcbiAgICAgICAgICAgIHZtLnZpZXdTY3JvbGwuc2Nyb2xsQm90dG9tKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGF2YXRhci57YXZhdGFySWR9LmNoYXQub3V0Ym94XHJcbiAgICAgICAgdGhpcy5MdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2F2YXRhci4nICsgdm0uZm9ybS5hdmF0YXJJZCArICcuY2hhdC5vdXRib3gnLCBmdW5jdGlvbihleGNoYW5nZSkge1xyXG4gICAgICAgICAgICB2YXIgY29tbXVuaWNhdGVBY3Rpb24gPSBKU09OLnBhcnNlKGV4Y2hhbmdlLmJvZHkpO1xyXG4gICAgICAgICAgICB2bS4kbG9nLmluZm8oXCJSZWNlaXZlZCBvdXRib3hcIiwgY29tbXVuaWNhdGVBY3Rpb24ub2JqZWN0LCBjb21tdW5pY2F0ZUFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPOiBuYXRpdmVseSBzdXBwb3J0IENvbW11bmljYXRlQWN0aW9uXHJcbiAgICAgICAgICAgIGNvbW11bmljYXRlQWN0aW9uLnRvSWQgPSB2bS51c2VyLl9pZDtcclxuICAgICAgICAgICAgY29tbXVuaWNhdGVBY3Rpb24udGV4dCA9IGNvbW11bmljYXRlQWN0aW9uLm9iamVjdDtcclxuICAgICAgICAgICAgY29tbXVuaWNhdGVBY3Rpb25bJ0BpZCddID0gY29tbXVuaWNhdGVBY3Rpb25bJ0BpZCddIHx8IChuZXcgRGF0ZSgpLmdldFRpbWUoKSArICdfb3V0Ym94Jyk7IC8vIDp+KVxyXG4gICAgICAgICAgICBjb21tdW5pY2F0ZUFjdGlvbi5faWQgPSBjb21tdW5pY2F0ZUFjdGlvblsnQGlkJ107XHJcbiAgICAgICAgICAgIGNvbW11bmljYXRlQWN0aW9uLmRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb21tdW5pY2F0ZUFjdGlvbi51c2VybmFtZSA9IHZtLnRvVXNlci51c2VybmFtZTtcclxuICAgICAgICAgICAgY29tbXVuaWNhdGVBY3Rpb24udXNlcklkID0gdm0udG9Vc2VyLl9pZDtcclxuICAgICAgICAgICAgY29tbXVuaWNhdGVBY3Rpb24ucGljID0gdm0udG9Vc2VyLnBpYztcclxuXHJcbiAgICAgICAgICAgIHZtLm1lc3NhZ2VzLnB1c2goY29tbXVuaWNhdGVBY3Rpb24pO1xyXG4gICAgICAgICAgICB2bS5rZWVwS2V5Ym9hcmRPcGVuLmNhbGwodm0pO1xyXG4gICAgICAgICAgICB2bS52aWV3U2Nyb2xsLnNjcm9sbEJvdHRvbSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGhhcyBhdWRpbz9cclxuICAgICAgICAgICAgaWYgKGNvbW11bmljYXRlQWN0aW9uLmF1ZGlvKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxJZCA9ICdhdWRpb18nICsgY29tbXVuaWNhdGVBY3Rpb25bJ0BpZCddO1xyXG4gICAgICAgICAgICAgICAgLy92YXIgcGxheWVkRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbElkKTtcclxuICAgICAgICAgICAgICAgIGlmICghdm0uZm9ybS5hdWRpby5tdXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLiRsb2cuaW5mbygnUXVldWVpbmcgJywgZWxJZCwgJy4uLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmF1ZGlvUXVldWUucHVzaChlbElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vcGxheWVkRWwucGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gYXVkaW8ub3V0OiBBdWRpb09iamVjdFxyXG4gICAgICAgIHRoaXMuTHVtZW5TdG9tcC5zdWJzY3JpYmUoJy90b3BpYy9hdmF0YXIuKi5hdWRpby5vdXQnLCBmdW5jdGlvbihleGNoYW5nZSkge1xyXG4gICAgICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShleGNoYW5nZS5ib2R5KTtcclxuICAgICAgICAgICAgdm0uJGxvZy5pbmZvKFwiUmVjZWl2ZWQgYXVkaW9cIiwgbXNnLm5hbWUsIG1zZy5jb250ZW50VHlwZSwgbXNnLmNvbnRlbnRTaXplLCAnYnl0ZXMnLCBtc2cpO1xyXG4gICAgICAgICAgICB2YXIgcGxheWVkSWQgPSAncGxheWVkJztcclxuICAgICAgICAgICAgdmFyIHBsYXllZEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGxheWVkSWQpIGFzIEhUTUxNZWRpYUVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHBsYXllZEVsLnNyYyA9IG1zZy5jb250ZW50VXJsO1xyXG4gICAgICAgICAgICAvL3ZtLnJlcGxheVBsYXllZCgpO1xyXG4gICAgICAgICAgICBpZiAoIXZtLmZvcm0uYXVkaW8ubXV0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHZtLiRsb2cuaW5mbygnUXVldWVpbmcgJywgcGxheWVkSWQsICcuLi4nKTtcclxuICAgICAgICAgICAgICAgIHZtLmF1ZGlvUXVldWUucHVzaChwbGF5ZWRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLiRsb2cuaW5mbygnU3Vic2NyaXB0aW9uczonLCB0aGlzLkx1bWVuU3RvbXAuZ2V0U3Vic2NyaXB0aW9ucygpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2VuZE1lc3NhZ2Uoc2VuZE1lc3NhZ2VGb3JtKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgdmFyIG1lc3NhZ2U6IENoYXRNZXNzYWdlID0ge1xyXG4gICAgICAgIHRvSWQ6IHRoaXMudG9Vc2VyLl9pZCBhcyBzdHJpbmcsXHJcbiAgICAgICAgdGV4dDogdGhpcy5mb3JtLm1lc3NhZ2UgYXMgc3RyaW5nXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBpZiB5b3UgZG8gYSB3ZWIgc2VydmljZSBjYWxsIHRoaXMgd2lsbCBiZSBuZWVkZWQgYXMgd2VsbCBhcyBiZWZvcmUgdGhlIHZpZXdTY3JvbGwgY2FsbHNcclxuICAgICAgLy8geW91IGNhbid0IHNlZSB0aGUgZWZmZWN0IG9mIHRoaXMgaW4gdGhlIGJyb3dzZXIgaXQgbmVlZHMgdG8gYmUgdXNlZCBvbiBhIHJlYWwgZGV2aWNlXHJcbiAgICAgIC8vIGZvciBzb21lIHJlYXNvbiB0aGUgb25lIHRpbWUgYmx1ciBldmVudCBpcyBub3QgZmlyaW5nIGluIHRoZSBicm93c2VyIGJ1dCBkb2VzIG9uIGRldmljZXNcclxuICAgICAgdGhpcy5rZWVwS2V5Ym9hcmRPcGVuLmNhbGwodm0pO1xyXG5cclxuICAgICAgLy9Nb2NrU2VydmljZS5zZW5kTWVzc2FnZShtZXNzYWdlKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgdGhpcy5mb3JtLm1lc3NhZ2UgPSAnJztcclxuXHJcbiAgICAgIG1lc3NhZ2UuX2lkID0gJ2NoYXQ6JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyAvLyA6filcclxuICAgICAgbWVzc2FnZVsnQGlkJ10gPSBtZXNzYWdlLl9pZDtcclxuICAgICAgbWVzc2FnZS5kYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgbWVzc2FnZS51c2VybmFtZSA9IHRoaXMudXNlci51c2VybmFtZTtcclxuICAgICAgbWVzc2FnZS51c2VySWQgPSB0aGlzLnVzZXIuX2lkO1xyXG4gICAgICBtZXNzYWdlLnBpYyA9IHRoaXMudXNlci5waWM7XHJcblxyXG4gICAgICB0aGlzLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XHJcblxyXG4gICAgICB2YXIgY29tbXVuaWNhdGVBY3Rpb24gPSB7XHJcbiAgICAgICAgXCJAdHlwZVwiOiBcIkNvbW11bmljYXRlQWN0aW9uXCIsXHJcbiAgICAgICAgXCJAaWRcIjogbWVzc2FnZS5faWQsXHJcbiAgICAgICAgXCJvYmplY3RcIjogbWVzc2FnZS50ZXh0LFxyXG4gICAgICAgIFwiaW5MYW5ndWFnZVwiOiB0aGlzLmZvcm0uYXVkaW8uaW5MYW5ndWFnZS5pZCxcclxuICAgICAgICBcInNwZWVjaFRydXRoVmFsdWVcIjogWzEuMCwgMS4wLCAwXSAvLyB0byBnZXQgc3BlZWNoIHN5bnRoZXNpcyBmb3IgcmVwbHlcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci4nICsgdGhpcy5mb3JtLmF2YXRhcklkICsgJy5jaGF0LmluYm94JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHtcInJlcGx5LXRvXCI6ICcvdG9waWMvYXZhdGFyLicgKyB0aGlzLmZvcm0uYXZhdGFySWQgKyAnLmNoYXQuaW5ib3gnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGNvbW11bmljYXRlQWN0aW9uKSk7XHJcblxyXG4gICAgICB0aGlzLiR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZtLmtlZXBLZXlib2FyZE9wZW4uY2FsbCh2bSk7XHJcbiAgICAgICAgdm0udmlld1Njcm9sbC5zY3JvbGxCb3R0b20odHJ1ZSk7XHJcbiAgICAgIH0sIDApO1xyXG5cclxuICAgICAgdGhpcy4kdGltZW91dChmdW5jdGlvbigpIHtcclxuLy8gICAgICAgIHZtLm1lc3NhZ2VzLnB1c2goTW9ja1NlcnZpY2UuZ2V0TW9ja01lc3NhZ2UoKSk7XHJcbiAgICAgICAgdm0ua2VlcEtleWJvYXJkT3Blbi5jYWxsKHZtKTtcclxuICAgICAgICB2bS52aWV3U2Nyb2xsLnNjcm9sbEJvdHRvbSh0cnVlKTtcclxuICAgICAgfSwgMjAwMCk7XHJcblxyXG4gICAgICAvL30pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMga2VlcHMgdGhlIGtleWJvYXJkIG9wZW4gb24gYSBkZXZpY2Ugb25seSBhZnRlciBzZW5kaW5nIGEgbWVzc2FnZSwgaXQgaXMgbm9uIG9idHJ1c2l2ZVxyXG4gICAga2VlcEtleWJvYXJkT3BlbigpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICB2bS4kbG9nLmRlYnVnKCdrZWVwS2V5Ym9hcmRPcGVuJywgdGhpcy50eHRJbnB1dCk7XHJcbiAgICAgIHZtLnR4dElucHV0Lm9uZSgnYmx1cicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZtLiRsb2cuZGVidWcoJ3RleHRhcmVhIGJsdXIsIGZvY3VzIGJhY2sgb24gaXQnKTtcclxuICAgICAgICB2bS50eHRJbnB1dFswXS5mb2N1cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgb25NZXNzYWdlSG9sZChlLCBpdGVtSW5kZXgsIG1lc3NhZ2UpIHtcclxuICAgICAgdGhpcy4kbG9nLmRlYnVnKCdvbk1lc3NhZ2VIb2xkJyk7XHJcbiAgICAgIHRoaXMuJGxvZy5kZWJ1ZygnbWVzc2FnZTogJyArIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UsIG51bGwsIDIpKTtcclxuICAgICAgdGhpcy4kaW9uaWNBY3Rpb25TaGVldC5zaG93KHtcclxuICAgICAgICBidXR0b25zOiBbe1xyXG4gICAgICAgICAgdGV4dDogJ0NvcHkgVGV4dCdcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICB0ZXh0OiAnRGVsZXRlIE1lc3NhZ2UnXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgYnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiAvLyBDb3B5IFRleHRcclxuICAgICAgICAgICAgICAvL2NvcmRvdmEucGx1Z2lucy5jbGlwYm9hcmQuY29weShtZXNzYWdlLnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOiAvLyBEZWxldGVcclxuICAgICAgICAgICAgICAvLyBubyBzZXJ2ZXIgc2lkZSBzZWNyZXRzIGhlcmUgOn4pXHJcbiAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlcy5zcGxpY2UoaXRlbUluZGV4LCAxKTtcclxuICAgICAgICAgICAgICB0aGlzLiR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3U2Nyb2xsLnJlc2l6ZSgpO1xyXG4gICAgICAgICAgICAgIH0sIDApO1xyXG5cclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIHRoaXMgcHJvYiBzZWVtcyB3ZWlyZCBoZXJlIGJ1dCBJIGhhdmUgcmVhc29ucyBmb3IgdGhpcyBpbiBteSBhcHAsIHNlY3JldCFcclxuICAgICAqL1xyXG4gICAgdmlld1Byb2ZpbGUobXNnKSB7XHJcbiAgICAgIGlmIChtc2cudXNlcklkID09PSB0aGlzLnVzZXIuX2lkKSB7XHJcbiAgICAgICAgLy8gZ28gdG8geW91ciBwcm9maWxlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gZ28gdG8gb3RoZXIgdXNlcnMgcHJvZmlsZVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJlcGxheVBsYXllZCgpIHtcclxuICAgICAgICB2YXIgcGxheWVkRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVkJykgYXMgSFRNTE1lZGlhRWxlbWVudDtcclxuICAgICAgICB0aGlzLiRsb2cuaW5mbygnUGxheWluZyBwbGF5ZWQgJywgcGxheWVkRWwsICdzZWNvbmRzIC4uLicpO1xyXG4gICAgICAgIHBsYXllZEVsLnBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kUmVjb3JkZWRNaWMoKSB7XHJcbiAgICAgICAgdmFyIHJlY29yZGVkRmlsZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlY29yZGVkTWljJykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICB2YXIgcmVjb3JkZWRGaWxlID0gcmVjb3JkZWRGaWxlRWwuZmlsZXNbMF07XHJcbiAgICAgICAgdGhpcy4kbG9nLmRlYnVnKCdSZWFkaW5nLi4uJywgcmVjb3JkZWRGaWxlRWwsIHJlY29yZGVkRmlsZUVsLmZpbGVzLCByZWNvcmRlZEZpbGUsIEpTT04uc3RyaW5naWZ5KHJlY29yZGVkRmlsZSkpO1xyXG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy4kc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF1ZGlvT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICdAdHlwZSc6ICdBdWRpb09iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5MYW5ndWFnZTogdGhpcy5mb3JtLmF1ZGlvLmluTGFuZ3VhZ2UuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcmVjb3JkZWRGaWxlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IHJlY29yZGVkRmlsZS50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiByZWNvcmRlZEZpbGUuc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRlTW9kaWZpZWQ6IHJlY29yZGVkRmlsZS5sYXN0TW9kaWZpZWREYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRVcmw6IHJlYWRlci5yZXN1bHQsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlZEZvckNoYXQ6IHRoaXMuZm9ybS5hdWRpby51c2VkRm9yQ2hhdFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGxvZy5pbmZvKCdBdWRpb09iamVjdCcsIGF1ZGlvT2JqZWN0LCBKU09OLnN0cmluZ2lmeShhdWRpb09iamVjdCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci4nICsgdGhpcy5mb3JtLmF2YXRhcklkICsgJy5hdWRpby5pbicsXHJcbiAgICAgICAgICAgICAgICAgICAge1wicmVwbHktdG9cIjogJy90ZW1wLXF1ZXVlL2F2YXRhci4nICsgdGhpcy5mb3JtLmF2YXRhcklkICsgJy5hdWRpby5pbid9LFxyXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGF1ZGlvT2JqZWN0KSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwocmVjb3JkZWRGaWxlKTtcclxuICAgIH07XHJcblxyXG4gIHRvZ2dsZU11dGVkKCkge1xyXG4gICAgICB0aGlzLmZvcm0uYXVkaW8ubXV0ZWQgPSAhdGhpcy5mb3JtLmF1ZGlvLm11dGVkO1xyXG4gIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnKVxyXG4uY29udHJvbGxlcignU29jaWFsQ2hhdEN0cmwnLCBTb2NpYWxDaGF0Q3RybClcclxuLy8gc2VydmljZXNcclxuLmZhY3RvcnkoJ01vY2tTZXJ2aWNlJywgWyckaHR0cCcsICckcScsXHJcbiAgZnVuY3Rpb24oJGh0dHAsICRxKSB7XHJcbiAgICB2YXIgbWUgPSBuZXcgTW9ja1NlcnZpY2UoKTtcclxuXHJcbiAgICBtZS5nZXRVc2VyTWVzc2FnZXMgPSBmdW5jdGlvbihkKSB7XHJcbiAgICAgIC8qXHJcbiAgICAgIHZhciBlbmRwb2ludCA9XHJcbiAgICAgICAgJ2h0dHA6Ly93d3cubW9ja3kuaW8vdjIvNTQ3Y2YzNDE1MDFjMzM3ZjBjOWE2M2ZkP2NhbGxiYWNrPUpTT05fQ0FMTEJBQ0snO1xyXG4gICAgICByZXR1cm4gJGh0dHAuanNvbnAoZW5kcG9pbnQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2dldCB1c2VyIG1lc3NhZ2VzIGVycm9yLCBlcnI6ICcgKyBKU09OLnN0cmluZ2lmeShcclxuICAgICAgICAgIGVyciwgbnVsbCwgMikpO1xyXG4gICAgICB9KTtcclxuICAgICAgKi9cclxuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcblx0XHQgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgXHRkZWZlcnJlZC5yZXNvbHZlKGdldE1vY2tNZXNzYWdlcygpKTtcclxuXHQgICAgfSwgMTUwMCk7XHJcblxyXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH07XHJcblxyXG4gICAgbWUuZ2V0TW9ja01lc3NhZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VySWQ6ICc1MzRiOGU1YWFhNWU3YWZjMWIyM2U2OWInLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgdGV4dDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LidcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWU7XHJcbiAgfVxyXG5dKVxyXG5cclxuLy8gZml0bGVyc1xyXG4uZmlsdGVyKCdubDJicicsIFsnJGZpbHRlcicsXHJcbiAgZnVuY3Rpb24oJGZpbHRlcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gZGF0YTtcclxuICAgICAgcmV0dXJuIGRhdGEucmVwbGFjZSgvXFxuXFxyPy9nLCAnPGJyIC8+Jyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXSlcclxuXHJcbi8vIGRpcmVjdGl2ZXNcclxuLmRpcmVjdGl2ZSgnYXV0b2xpbmtlcicsIFsnJHRpbWVvdXQnLFxyXG4gIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciBlbGVIdG1sID0gZWxlbWVudC5odG1sKCk7XHJcblxyXG4gICAgICAgICAgaWYgKGVsZUh0bWwgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgdGV4dCA9IEF1dG9saW5rZXIubGluayhlbGVIdG1sLCB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F1dG9saW5rZXInLFxyXG4gICAgICAgICAgICBuZXdXaW5kb3c6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGV4dCk7XHJcblxyXG4gICAgICAgICAgdmFyIGF1dG9saW5rcyA9IGVsZW1lbnRbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXV0b2xpbmtlcicpO1xyXG5cclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXV0b2xpbmtzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChhdXRvbGlua3NbaV0pLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgIHZhciBocmVmID0gKGUudGFyZ2V0IGFzIEhUTUxBbmNob3JFbGVtZW50KS5ocmVmO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRvbGlua0NsaWNrLCBocmVmOiAnICsgaHJlZik7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChocmVmKSB7XHJcbiAgICAgICAgICAgICAgICAvL3dpbmRvdy5vcGVuKGhyZWYsICdfc3lzdGVtJyk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihocmVmLCAnX2JsYW5rJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXSlcclxuXHJcbmZ1bmN0aW9uIG9uUHJvZmlsZVBpY0Vycm9yKGVsZSkge1xyXG4gIHRoaXMuZWxlLnNyYyA9ICcnOyAvLyBzZXQgYSBmYWxsYmFja1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb2NrTWVzc2FnZXMoKSB7XHJcbiAgcmV0dXJuIHtcIm1lc3NhZ2VzXCI6IFtdLCBcInVucmVhZFwiOiAwfTtcclxuLy8gIG1vY2tNZXNzYWdlcyA9IHtcIm1lc3NhZ2VzXCI6W1xyXG4vLyAgICB7XCJfaWRcIjpcIjUzNWQ2MjVmODk4ZGY0ZTgwZTJhMTI1ZVwiLFwidGV4dFwiOlwiSW9uaWMgaGFzIGNoYW5nZWQgdGhlIGdhbWUgZm9yIGh5YnJpZCBhcHAgZGV2ZWxvcG1lbnQuXCIsXCJ1c2VySWRcIjpcInBlcnNvblwiLFwiZGF0ZVwiOlwiMjAxNC0wNC0yN1QyMDowMjozOS4wODJaXCIsXCJyZWFkXCI6dHJ1ZSxcInJlYWREYXRlXCI6XCIyMDE0LTEyLTAxVDA2OjI3OjM3Ljk0NFpcIn0sXHJcbi8vICAgIHtcIl9pZFwiOlwiNTM1ZjEzZmZlZTNiMmE2ODExMmI5ZmMwXCIsXCJ0ZXh0XCI6XCJJIGxpa2UgSW9uaWMgYmV0dGVyIHRoYW4gaWNlIGNyZWFtIVwiLFwidXNlcklkXCI6XCJhcmthblwiLFwiZGF0ZVwiOlwiMjAxNC0wNC0yOVQwMjo1Mjo0Ny43MDZaXCIsXCJyZWFkXCI6dHJ1ZSxcInJlYWREYXRlXCI6XCIyMDE0LTEyLTAxVDA2OjI3OjM3Ljk0NFpcIn0sXHJcbi8vICAgIHtcIl9pZFwiOlwiNTQ2YTU4NDNmZDRjNWQ1ODFlZmEyNjNhXCIsXCJ0ZXh0XCI6XCJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0uXCIsXCJ1c2VySWRcIjpcInBlcnNvblwiLFwiZGF0ZVwiOlwiMjAxNC0xMS0xN1QyMDoxOToxNS4yODlaXCIsXCJyZWFkXCI6dHJ1ZSxcInJlYWREYXRlXCI6XCIyMDE0LTEyLTAxVDA2OjI3OjM4LjMyOFpcIn0se1wiX2lkXCI6XCI1NDc2NDM5OWFiNDNkMWQ0MTEzYWJmZDFcIixcInRleHRcIjpcIkFtIEkgZHJlYW1pbmc/XCIsXCJ1c2VySWRcIjpcImFya2FuXCIsXCJkYXRlXCI6XCIyMDE0LTExLTI2VDIxOjE4OjE3LjU5MVpcIixcInJlYWRcIjp0cnVlLFwicmVhZERhdGVcIjpcIjIwMTQtMTItMDFUMDY6Mjc6MzguMzM3WlwifSx7XCJfaWRcIjpcIjU0NzY0M2FlYWI0M2QxZDQxMTNhYmZkMlwiLFwidGV4dFwiOlwiSXMgdGhpcyBtYWdpYz9cIixcInVzZXJJZFwiOlwicGVyc29uXCIsXCJkYXRlXCI6XCIyMDE0LTExLTI2VDIxOjE4OjM4LjU0OVpcIixcInJlYWRcIjp0cnVlLFwicmVhZERhdGVcIjpcIjIwMTQtMTItMDFUMDY6Mjc6MzguMzM4WlwifSx7XCJfaWRcIjpcIjU0NzgxNWRiYWI0M2QxZDQxMTNhYmZlZlwiLFwidGV4dFwiOlwiR2VlIHdpeiwgdGhpcyBpcyBzb21ldGhpbmcgc3BlY2lhbC5cIixcInVzZXJJZFwiOlwiYXJrYW5cIixcImRhdGVcIjpcIjIwMTQtMTEtMjhUMDY6Mjc6NDAuMDAxWlwiLFwicmVhZFwiOnRydWUsXCJyZWFkRGF0ZVwiOlwiMjAxNC0xMi0wMVQwNjoyNzozOC4zMzhaXCJ9LHtcIl9pZFwiOlwiNTQ3ODFjNjlhYjQzZDFkNDExM2FiZmYwXCIsXCJ0ZXh0XCI6XCJJIHRoaW5rIEkgbGlrZSBJb25pYyBtb3JlIHRoYW4gSSBsaWtlIGljZSBjcmVhbSFcIixcInVzZXJJZFwiOlwicGVyc29uXCIsXCJkYXRlXCI6XCIyMDE0LTExLTI4VDA2OjU1OjM3LjM1MFpcIixcInJlYWRcIjp0cnVlLFwicmVhZERhdGVcIjpcIjIwMTQtMTItMDFUMDY6Mjc6MzguMzM4WlwifSx7XCJfaWRcIjpcIjU0NzgxY2E0YWI0M2QxZDQxMTNhYmZmMVwiLFwidGV4dFwiOlwiWWVhLCBpdCdzIHByZXR0eSBzd2VldFwiLFwidXNlcklkXCI6XCJhcmthblwiLFwiZGF0ZVwiOlwiMjAxNC0xMS0yOFQwNjo1NjozNi40NzJaXCIsXCJyZWFkXCI6dHJ1ZSxcInJlYWREYXRlXCI6XCIyMDE0LTEyLTAxVDA2OjI3OjM4LjMzOFpcIn0sXHJcbi8vICAgIHtcIl9pZFwiOlwiNTQ3OGRmODZhYjQzZDFkNDExM2FiZmY0XCIsXCJ0ZXh0XCI6XCJXb3csIHRoaXMgaXMgcmVhbGx5IHNvbWV0aGluZyBodWg/XCIsXCJ1c2VySWRcIjpcInBlcnNvblwiLFwiZGF0ZVwiOlwiMjAxNC0xMS0yOFQyMDo0ODowNi41NzJaXCIsXCJyZWFkXCI6dHJ1ZSxcInJlYWREYXRlXCI6XCIyMDE0LTEyLTAxVDA2OjI3OjM4LjMzOVpcIn0sXHJcbi8vICAgIHtcIl9pZFwiOlwiNTQ3ODFjYTRhYjQzZDFkNDExM2FiZmYxXCIsXCJ0ZXh0XCI6XCJDcmVhdGUgYW1hemluZyBhcHBzIC0gaW9uaWNmcmFtZXdvcmsuY29tXCIsXCJ1c2VySWRcIjpcImFya2FuXCIsXCJkYXRlXCI6XCIyMDE0LTExLTI5VDA2OjU2OjM2LjQ3MlpcIixcInJlYWRcIjp0cnVlLFwicmVhZERhdGVcIjpcIjIwMTQtMTItMDFUMDY6Mjc6MzguMzM4WlwifVxyXG4vLyAgICBdLFwidW5yZWFkXCI6MH07XHJcbi8vICByZXR1cm4gbW9ja01lc3NhZ2VzO1xyXG59XHJcblxyXG4vL2ltcG9ydCBtb21lbnRSZWYgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuLy9kZWNsYXJlIHZhciBtb21lbnQ6IG1vbWVudC5Nb21lbnRTdGF0aWMgPSBtb21lbnRSZWY7XHJcbmRlY2xhcmUgdmFyIG1vbWVudDogYW55O1xyXG4vLyBjb25maWd1cmUgbW9tZW50IHJlbGF0aXZlIHRpbWVcclxubW9tZW50LmxvY2FsZSgnZW4nLCB7XHJcbiAgcmVsYXRpdmVUaW1lOiB7XHJcbiAgICBmdXR1cmU6IFwiaW4gJXNcIixcclxuICAgIHBhc3Q6IFwiJXMgYWdvXCIsXHJcbiAgICBzOiBcIiVkIHNlY1wiLFxyXG4gICAgbTogXCJhIG1pbnV0ZVwiLFxyXG4gICAgbW06IFwiJWQgbWludXRlc1wiLFxyXG4gICAgaDogXCJhbiBob3VyXCIsXHJcbiAgICBoaDogXCIlZCBob3Vyc1wiLFxyXG4gICAgZDogXCJhIGRheVwiLFxyXG4gICAgZGQ6IFwiJWQgZGF5c1wiLFxyXG4gICAgTTogXCJhIG1vbnRoXCIsXHJcbiAgICBNTTogXCIlZCBtb250aHNcIixcclxuICAgIHk6IFwiYSB5ZWFyXCIsXHJcbiAgICB5eTogXCIlZCB5ZWFyc1wiXHJcbiAgfVxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
