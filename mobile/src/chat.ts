/// <reference path="../typings/main.d.ts"/>
/// <reference path="services.ts"/>
/* ----------- Ionic Elastichat: http://codepen.io/rossmartin/pen/XJmpQr ----------
Requires bower packages:
1. moment
2. angular-moment
3. angular-elastic
4. Autolinker.js
*/

interface ChatMessage {
    _id?: string,
    toId?: string,
    text?: string,
    date?: Date,
    username?: string,
    userId?: string,
    pic?: string
}

class MockService {
    getUserMessages: any;
    getMockMessage: any;
}

class ChatUser {
    _id: string;
    name: string;
    username: string;
    pic: string;
}

class Locale {
    id: string;
    name: string;
}

class SocialChatCtrl {
    public $inject = ['$scope', '$stateParams', '$log', 
        'LumenStomp', '$window', 'Settings',
        '$rootScope', '$state', 'MockService',
        '$ionicActionSheet',
        '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$interval', 'recorderService'];
        
    messages: ChatMessage[];
    form: any;
    toUser: ChatUser;
    user: ChatUser;
    avatarIds: string[];
    locales: Locale[];
    /**
     * queue of IDs of HTMLAudioElement to be played
     */
    audioQueue: string[];
    client: any;
    doneLoading: boolean;
    txtInput: JQuery;
    viewScroll: ionic.scroll.IonicScrollDelegate;
    
    constructor(public $scope: any, public $stateParams: ng.ui.IStateParamsService, 
        public $log: ng.ILogService, 
        public LumenStomp: Services.LumenStomp, public Settings: Services.Settings, 
        public $window: ng.IWindowService,
        public $rootScope: ng.IRootScopeService, public $state: ng.ui.IState, public MockService,
        public $ionicActionSheet: ionic.actionSheet.IonicActionSheetService,
        public $ionicPopup: ionic.popup.IonicPopupService,
        public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate, 
        public $timeout: ng.ITimeoutService, public $interval: ng.IIntervalService,
        public recorderService) {
    var vm = this;
    this.messages = [];
    this.toUser = {
        _id: 'arkan',
        name: 'Arkan Lumen',
        username: 'Arkan Lumen',
        pic: 'img/nao-128.png'};
    this.user = {
        _id: 'person',
        name: 'You',
        username: 'You',
        pic: 'img/person-128.png'};
    this.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    this.locales = [
        {id: 'en-US', name: 'English (US)'},
        {id: 'en-UK', name: 'English (UK)'},
        {id: 'en-AU', name: 'English (Australia)'},
        {id: 'id-ID', name: 'Indonesian'},
        {id: 'ar-SA', name: 'Arabic'}
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

    $scope.$on('$ionicView.enter', () => {
        this.$log.debug('UserMessages $ionicView.enter');

        getMessages();

        $timeout(() => {
            footerBar = document.body.querySelector('#userMessagesView .bar-footer');
            scroller = document.body.querySelector('#userMessagesView .scroll-content');
            this.txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);

        messageCheckTimer = $interval(() => {
            // here you could check for new messages if your app doesn't use push notifications or user disabled them
        }, 20000);

        this.LumenStomp.connect(() => {
            this.client = LumenStomp.getClient();
            this.switchAvatar();
        });

        audioQueueTimer = $interval(() => {
            if (this.audioQueue.length == 0) {
                return;
            }
            //$log.debug('audioQueue:', vm.audioQueue);
            var current = document.getElementById(this.audioQueue[0]) as HTMLMediaElement;
            if (current.paused && !current.ended) {
                this.$log.debug('Playing ', current, '...');
                current.play();
            } else if (current.ended) {
                this.$log.debug('Finished playing', current);
                this.audioQueue.shift();
            }
        }, 250);
    });

    $scope.$on('$ionicView.beforeLeave', () => {
        this.$log.debug('leaving UserMessages view, destroying interval');
        this.LumenStomp.disconnect();
        // Make sure that the interval is destroyed
        if (angular.isDefined(messageCheckTimer)) {
            this.$interval.cancel(messageCheckTimer);
            messageCheckTimer = undefined;
        }
        if (angular.isDefined(audioQueueTimer)) {
            this.$interval.cancel(audioQueueTimer);
            audioQueueTimer = undefined;
        }
    });

    $scope.$on('$ionicView.beforeLeave', () => {
      if (!this.form.message || this.form.message === '') {
        //localStorage.removeItem('userMessage-' + this.toUser._id);
      }
    });

    function getMessages() {
      // the service is mock but you would probably pass the toUser's GUID here
      MockService.getUserMessages({
        toUserId: vm.toUser._id
      }).then(function(data) {
        vm.doneLoading = true;
        vm.messages = data.messages;

        $timeout(function() {
          vm.viewScroll.scrollBottom();
        }, 0);
      });
    }

    $scope.$watch('input.message', (newValue, oldValue) => {
      this.$log.debug('input.message $watch, newValue ' + newValue);
      if (!newValue) newValue = '';
      //localStorage['userMessage-' + vm.toUser._id] = newValue;
    });

    // I emit this event from the monospaced.elastic directive, read line 480
    $scope.$on('elastic:resize', function(e, ta, oldHeight, newHeight) {
      if (!ta) return;

      var taHeight = newHeight; // ta[0].offsetHeight;
      console.debug('taHeight:', taHeight);

      if (!footerBar) return;

      var newFooterHeight = taHeight + 10;
      newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

      footerBar.style.height = newFooterHeight + 'px';
      scroller.style.bottom = newFooterHeight + 'px';
    });

  }
  
    switchAvatar() {
        this.LumenStomp.unsubscribeAll();
        this.messages = [];
        this.LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.chat.inbox', exchange => {
            var communicateAction = JSON.parse(exchange.body);
            this.$log.info("Received inbox", communicateAction.object, communicateAction);

            this.$log.debug('map', _.map(this.messages, function(m: ChatMessage) { return m._id; }));
            var already = _.find(this.messages, function(m: ChatMessage) { return m._id == communicateAction['@id']; }) || false;
            this.$log.debug('contains', typeof communicateAction['@id'] === 'undefined', communicateAction['@id'], already);
            if ((typeof communicateAction['@id'] === 'undefined') || !already) {

                // TODO: natively support CommunicateAction
                communicateAction.toId = this.user._id;
                communicateAction.text = communicateAction.object;
                if (typeof communicateAction['@id'] === undefined) {
                    communicateAction['@id'] = new Date().getTime(); // :~)
                    communicateAction._id = new Date().getTime(); // :~)
                }
                communicateAction.date = new Date();
                communicateAction.username = this.user.username;
                communicateAction.userId = this.user._id;
                communicateAction.pic = this.user.pic;

                this.messages.push(communicateAction);
            }

            this.keepKeyboardOpen();
            this.viewScroll.scrollBottom(true);
        });
        // avatar.{avatarId}.chat.outbox
        this.LumenStomp.subscribe('/topic/avatar.' + this.form.avatarId + '.chat.outbox', exchange => {
            var communicateAction = JSON.parse(exchange.body);
            this.$log.info("Received outbox", communicateAction.object, communicateAction);

            // TODO: natively support CommunicateAction
            communicateAction.toId = this.user._id;
            communicateAction.text = communicateAction.object;
            communicateAction['@id'] = communicateAction['@id'] || (new Date().getTime() + '_outbox'); // :~)
            communicateAction._id = communicateAction['@id'];
            communicateAction.date = new Date();
            communicateAction.username = this.toUser.username;
            communicateAction.userId = this.toUser._id;
            communicateAction.pic = this.toUser.pic;

            this.messages.push(communicateAction);
            this.keepKeyboardOpen();
            this.viewScroll.scrollBottom(true);

            // has audio?
            if (communicateAction.audio) {
                var elId = 'audio_' + communicateAction['@id'];
                //var playedEl = document.getElementById(elId);
                if (!this.form.audio.muted) {
                    this.$log.info('Queueing ', elId, '...');
                    this.audioQueue.push(elId);
                }
                //playedEl.play();
            }
        });
        // audio.out: AudioObject
        this.LumenStomp.subscribe('/topic/avatar.*.audio.out', exchange => {
            var msg = JSON.parse(exchange.body);
            this.$log.info("Received audio", msg.name, msg.contentType, msg.contentSize, 'bytes', msg);
            var playedId = 'played';
            var playedEl = document.getElementById(playedId) as HTMLMediaElement;
            playedEl.src = msg.contentUrl;
            //this.replayPlayed();
            if (!this.form.audio.muted) {
                this.$log.info('Queueing ', playedId, '...');
                this.audioQueue.push(playedId);
            }
        });
        this.$log.info('Subscriptions:', this.LumenStomp.getSubscriptions());
    }
    
    sendMessage(sendMessageForm) {
      var message: ChatMessage = {
        toId: this.toUser._id as string,
        text: this.form.message as string
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
      this.client.send('/topic/avatar.' + this.form.avatarId + '.chat.inbox',
                         {"reply-to": '/topic/avatar.' + this.form.avatarId + '.chat.inbox'},
                         JSON.stringify(communicateAction));

      this.$timeout(() => {
        this.keepKeyboardOpen();
        this.viewScroll.scrollBottom(true);
      }, 0);

      this.$timeout(() => {
//        vm.messages.push(MockService.getMockMessage());
        this.keepKeyboardOpen();
        this.viewScroll.scrollBottom(true);
      }, 2000);

      //});
    }

    /**
     * this keeps the keyboard open on a device only after sending a message, it is non obtrusive
     */
    keepKeyboardOpen() {
        this.$log.debug('keepKeyboardOpen', this.txtInput);
        this.txtInput.one('blur', () => {
            this.$log.debug('textarea blur, focus back on it');
            this.txtInput[0].focus();
        });
    }

  onMessageHold(e, itemIndex, message) {
      this.$log.debug('onMessageHold');
      this.$log.debug('message: ' + JSON.stringify(message, null, 2));
      this.$ionicActionSheet.show({
        buttons: [{
          text: 'Copy Text'
        }, {
          text: 'Delete Message'
        }],
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Copy Text
              //cordova.plugins.clipboard.copy(message.text);

              break;
            case 1: // Delete
              // no server side secrets here :~)
              this.messages.splice(itemIndex, 1);
              this.$timeout(function() {
                this.viewScroll.resize();
              }, 0);

              break;
          }

          return true;
        }
      });
    }
    
    /**
     * this prob seems weird here but I have reasons for this in my app, secret!
     */
    viewProfile(msg) {
      if (msg.userId === this.user._id) {
        // go to your profile
      } else {
        // go to other users profile
      }
    };

    replayPlayed() {
        var playedEl = document.getElementById('played') as HTMLMediaElement;
        this.$log.info('Playing played ', playedEl, 'seconds ...');
        playedEl.play();
    }

    sendRecordedMic() {
        var recordedFileEl = document.getElementById('recordedMic') as HTMLInputElement;
        var recordedFile = recordedFileEl.files[0];
        this.$log.debug('Reading...', recordedFileEl, recordedFileEl.files, recordedFile, JSON.stringify(recordedFile));
        var reader = new FileReader();
        reader.onloadend = function() {
            this.$scope.$apply(function() {
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
                this.client.send('/topic/avatar.' + this.form.avatarId + '.audio.in',
                    {"reply-to": '/temp-queue/avatar.' + this.form.avatarId + '.audio.in'},
                    JSON.stringify(audioObject));
            });
        };
        reader.readAsDataURL(recordedFile);
    };

  toggleMuted() {
      this.form.audio.muted = !this.form.audio.muted;
  }
  
    startRecord() {
        this.$log.debug('start...');
        this.recorderService.startRecord();
      
      
    }
  
    stopRecord() {
        this.$log.debug('stop...');
        this.recorderService.stopRecord();
      
    }
}

angular.module('starter.controllers')
.controller('SocialChatCtrl', SocialChatCtrl)
// services
.factory('MockService', ['$http', '$q',
  function($http: ng.IHttpService, $q: ng.IQService) {
    var me = new MockService();

    me.getUserMessages = function(d) {
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

		 setTimeout(function() {
      	deferred.resolve(getMockMessages());
	    }, 1500);

      return deferred.promise;
    };

    me.getMockMessage = function() {
      return {
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      };
    }

    return me;
  }
])

// fitlers
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])

// directives
.directive('autolinker', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function() {
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
            angular.element(autolinks[i]).bind('click', function(e) {
              var href = (e.target as HTMLAnchorElement).href;
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
    }
  }
])

function onProfilePicError(ele) {
  this.ele.src = ''; // set a fallback
}

function getMockMessages() {
  return {"messages": [], "unread": 0};
//  mockMessages = {"messages":[
//    {"_id":"535d625f898df4e80e2a125e","text":"Ionic has changed the game for hybrid app development.","userId":"person","date":"2014-04-27T20:02:39.082Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},
//    {"_id":"535f13ffee3b2a68112b9fc0","text":"I like Ionic better than ice cream!","userId":"arkan","date":"2014-04-29T02:52:47.706Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},
//    {"_id":"546a5843fd4c5d581efa263a","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","userId":"person","date":"2014-11-17T20:19:15.289Z","read":true,"readDate":"2014-12-01T06:27:38.328Z"},{"_id":"54764399ab43d1d4113abfd1","text":"Am I dreaming?","userId":"arkan","date":"2014-11-26T21:18:17.591Z","read":true,"readDate":"2014-12-01T06:27:38.337Z"},{"_id":"547643aeab43d1d4113abfd2","text":"Is this magic?","userId":"person","date":"2014-11-26T21:18:38.549Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"547815dbab43d1d4113abfef","text":"Gee wiz, this is something special.","userId":"arkan","date":"2014-11-28T06:27:40.001Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781c69ab43d1d4113abff0","text":"I think I like Ionic more than I like ice cream!","userId":"person","date":"2014-11-28T06:55:37.350Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"Yea, it's pretty sweet","userId":"arkan","date":"2014-11-28T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},
//    {"_id":"5478df86ab43d1d4113abff4","text":"Wow, this is really something huh?","userId":"person","date":"2014-11-28T20:48:06.572Z","read":true,"readDate":"2014-12-01T06:27:38.339Z"},
//    {"_id":"54781ca4ab43d1d4113abff1","text":"Create amazing apps - ionicframework.com","userId":"arkan","date":"2014-11-29T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"}
//    ],"unread":0};
//  return mockMessages;
}

//import momentRef = require('moment');
//declare var moment: moment.MomentStatic = momentRef;
declare var moment: any;
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
