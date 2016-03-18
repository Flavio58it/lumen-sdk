/// <reference path="../typings/main.d.ts"/>
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services',
    'AngularStomp', 'webcam', 'monospaced.elastic', 'angularMoment'])
    .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
    .filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }])
    .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from data URI
        'data:**'
    ]);
    $stateProvider
        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html"
    })
        .state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/home.html"
            }
        }
    })
        .state('app.avatar-remote-control', {
        url: "/avatar/remote-control",
        views: {
            'menuContent': {
                templateUrl: "templates/avatar/remote-control.html"
            }
        }
    })
        .state('app.avatar-instruments', {
        url: "/avatar/instruments",
        views: {
            'menuContent': {
                templateUrl: "templates/avatar/instruments.html"
            }
        }
    })
        .state('app.visual-camera', {
        url: "/visual/camera",
        views: {
            'menuContent': {
                templateUrl: "templates/visual/camera.html",
                controller: 'VisualCameraCtrl'
            }
        }
    })
        .state('app.face-recognition-img', {
        url: "/face-recognition-img",
        views: {
            'menuContent': {
                templateUrl: "templates/face-recognition-img.html",
                controller: 'FaceRecognitionImgCtrl'
            }
        }
    })
        .state('app.visual-object-recognition', {
        url: "/visual/object-recognition",
        views: {
            'menuContent': {
                templateUrl: "templates/visual/object-recognition.html",
                controller: 'ObjectRecognitionCtrl'
            }
        }
    })
        .state('app.face-recognition-cam', {
        url: "/face-recognition-cam",
        views: {
            'menuContent': {
                templateUrl: "templates/face-recognition-cam.html",
                controller: 'FaceRecognitionCamCtrl'
            }
        }
    })
        .state('app.audio-monitor', {
        url: "/audio/monitor",
        views: {
            'menuContent': {
                templateUrl: "templates/audio/monitor.html",
                controller: 'AudioMonitorCtrl'
            }
        }
    })
        .state('app.persistence-fact', {
        url: "/persistence/fact",
        views: {
            'menuContent': {
                templateUrl: "templates/persistence/fact.html",
                controller: 'PersistenceFactCtrl'
            }
        }
    })
        .state('app.persistence-query-find-all', {
        url: "/persistence/query-find-all",
        views: {
            'menuContent': {
                templateUrl: "templates/persistence/query-find-all.html",
                controller: 'PersistenceQueryFindAllCtrl'
            }
        }
    })
        .state('app.persistence-query-cypher', {
        url: "/persistence/query-cypher",
        views: {
            'menuContent': {
                templateUrl: "templates/persistence/query-cypher.html",
                controller: 'PersistenceQueryCypherCtrl'
            }
        }
    })
        .state('app.persistence-journal-image', {
        url: "/persistence/journal-image",
        views: {
            'menuContent': {
                templateUrl: "templates/persistence/journal-image.html",
                controller: 'PersistenceJournalImageCtrl'
            }
        }
    })
        .state('app.persistence-journal-joint', {
        url: "/persistence/journal-joint",
        views: {
            'menuContent': {
                templateUrl: "templates/persistence/journal-joint.html",
                controller: 'PersistenceJournalJointCtrl'
            }
        }
    })
        .state('app.persistence-journal-sonar', {
        url: "/persistence/journal-sonar",
        views: {
            'menuContent': {
                templateUrl: "templates/persistence/journal-sonar.html",
                controller: 'PersistenceJournalSonarCtrl'
            }
        }
    })
        .state('app.persistence-journal-tactile', {
        url: "/persistence/journal-tactile",
        views: {
            'menuContent': {
                templateUrl: "templates/persistence/journal-tactile.html",
                controller: 'PersistenceJournalTactileCtrl'
            }
        }
    })
        .state('app.persistence-journal-battery', {
        url: "/persistence/journal-battery",
        views: {
            'menuContent': {
                templateUrl: "templates/persistence/journal-battery.html",
                controller: 'PersistenceJournalBatteryCtrl'
            }
        }
    })
        .state('app.social-chat', {
        url: "/social-chat",
        views: {
            'menuContent': {
                templateUrl: "templates/social/chat.html"
            }
        }
    })
        .state('app.social-monitor', {
        url: "/social-monitor",
        views: {
            'menuContent': {
                templateUrl: "templates/social/monitor.html",
                controller: 'SocialMonitorCtrl'
            }
        }
    })
        .state('app.social-express', {
        url: "/social-express",
        views: {
            'menuContent': {
                templateUrl: "templates/social/express.html",
                controller: 'SocialExpressCtrl'
            }
        }
    })
        .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "templates/settings.html",
                controller: 'SettingsCtrl'
            }
        }
    })
        .state('app.search', {
        url: "/search",
        views: {
            'menuContent': {
                templateUrl: "templates/search.html"
            }
        }
    })
        .state('app.browse', {
        url: "/browse",
        views: {
            'menuContent': {
                templateUrl: "templates/browse.html"
            }
        }
    })
        .state('app.playlists', {
        url: "/playlists",
        views: {
            'menuContent': {
                templateUrl: "templates/playlists.html",
                controller: 'PlaylistsCtrl'
            }
        }
    })
        .state('app.single', {
        url: "/playlists/:playlistId",
        views: {
            'menuContent': {
                templateUrl: "templates/playlist.html",
                controller: 'PlaylistCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
})
    .directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

//# sourceMappingURL=data:application/json;base64,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VyxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0tBRUQsU0FBUyxDQUFDLFNBQVMsRUFBRTtJQUNsQixNQUFNLENBQUMsVUFBVSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUs7UUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLEtBQUs7WUFDNUMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDO29CQUNULEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztnQkFFSCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDM0IsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvbWFpbi5kLnRzXCIvPlxyXG4vLyBJb25pYyBTdGFydGVyIEFwcFxyXG5cclxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcclxuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXHJcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcclxuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXHJcbmFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJywgWydpb25pYycsICdzdGFydGVyLmNvbnRyb2xsZXJzJywgJ3N0YXJ0ZXIuc2VydmljZXMnLFxyXG4gICAgJ0FuZ3VsYXJTdG9tcCcsICd3ZWJjYW0nLCAnbW9ub3NwYWNlZC5lbGFzdGljJywgJ2FuZ3VsYXJNb21lbnQnXSlcclxuXHJcbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcclxuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcclxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XHJcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xyXG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXHJcbiAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKTtcclxuICAgIH1cclxuICB9KTtcclxufSlcclxuXHJcbi5maWx0ZXIoJ3RydXN0ZWQnLCBbJyRzY2UnLCBmdW5jdGlvbiAoJHNjZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHVybCkge1xyXG4gICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCh1cmwpO1xyXG4gICAgfTtcclxufV0pXHJcblxyXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRzY2VEZWxlZ2F0ZVByb3ZpZGVyKSB7XHJcblxyXG4gICRzY2VEZWxlZ2F0ZVByb3ZpZGVyLnJlc291cmNlVXJsV2hpdGVsaXN0KFtcclxuICAgIC8vIEFsbG93IHNhbWUgb3JpZ2luIHJlc291cmNlIGxvYWRzLlxyXG4gICAgJ3NlbGYnLFxyXG4gICAgLy8gQWxsb3cgbG9hZGluZyBmcm9tIGRhdGEgVVJJXHJcbiAgICAnZGF0YToqKidcclxuICBdKTtcclxuXHJcbiAgJHN0YXRlUHJvdmlkZXJcclxuXHJcbiAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICB1cmw6IFwiL2FwcFwiLFxyXG4gICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvbWVudS5odG1sXCJcclxuICB9KVxyXG5cclxuICAuc3RhdGUoJ2FwcC5ob21lJywge1xyXG4gICAgdXJsOiBcIi9ob21lXCIsXHJcbiAgICB2aWV3czoge1xyXG4gICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2hvbWUuaHRtbFwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG5cclxuICAuc3RhdGUoJ2FwcC5hdmF0YXItcmVtb3RlLWNvbnRyb2wnLCB7XHJcbiAgICAgIHVybDogXCIvYXZhdGFyL3JlbW90ZS1jb250cm9sXCIsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2F2YXRhci9yZW1vdGUtY29udHJvbC5odG1sXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgLnN0YXRlKCdhcHAuYXZhdGFyLWluc3RydW1lbnRzJywge1xyXG4gICAgICB1cmw6IFwiL2F2YXRhci9pbnN0cnVtZW50c1wiLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hdmF0YXIvaW5zdHJ1bWVudHMuaHRtbFwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFZpc3VhbFxyXG4gIC5zdGF0ZSgnYXBwLnZpc3VhbC1jYW1lcmEnLCB7XHJcbiAgICAgIHVybDogXCIvdmlzdWFsL2NhbWVyYVwiLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy92aXN1YWwvY2FtZXJhLmh0bWxcIixcclxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdWaXN1YWxDYW1lcmFDdHJsJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgLnN0YXRlKCdhcHAuZmFjZS1yZWNvZ25pdGlvbi1pbWcnLCB7XHJcbiAgICB1cmw6IFwiL2ZhY2UtcmVjb2duaXRpb24taW1nXCIsXHJcbiAgICB2aWV3czoge1xyXG4gICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2ZhY2UtcmVjb2duaXRpb24taW1nLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnRmFjZVJlY29nbml0aW9uSW1nQ3RybCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgLnN0YXRlKCdhcHAudmlzdWFsLW9iamVjdC1yZWNvZ25pdGlvbicsIHtcclxuICAgIHVybDogXCIvdmlzdWFsL29iamVjdC1yZWNvZ25pdGlvblwiLFxyXG4gICAgdmlld3M6IHtcclxuICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy92aXN1YWwvb2JqZWN0LXJlY29nbml0aW9uLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnT2JqZWN0UmVjb2duaXRpb25DdHJsJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICAuc3RhdGUoJ2FwcC5mYWNlLXJlY29nbml0aW9uLWNhbScsIHtcclxuICAgIHVybDogXCIvZmFjZS1yZWNvZ25pdGlvbi1jYW1cIixcclxuICAgIHZpZXdzOiB7XHJcbiAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvZmFjZS1yZWNvZ25pdGlvbi1jYW0uaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGYWNlUmVjb2duaXRpb25DYW1DdHJsJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgICAvLyBBdWRpb1xyXG4gIC5zdGF0ZSgnYXBwLmF1ZGlvLW1vbml0b3InLCB7XHJcbiAgICB1cmw6IFwiL2F1ZGlvL21vbml0b3JcIixcclxuICAgIHZpZXdzOiB7XHJcbiAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYXVkaW8vbW9uaXRvci5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0F1ZGlvTW9uaXRvckN0cmwnXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG5cclxuICAvLyBQZXJzaXN0ZW5jZVxyXG4gIC5zdGF0ZSgnYXBwLnBlcnNpc3RlbmNlLWZhY3QnLCB7XHJcbiAgICB1cmw6IFwiL3BlcnNpc3RlbmNlL2ZhY3RcIixcclxuICAgIHZpZXdzOiB7XHJcbiAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcGVyc2lzdGVuY2UvZmFjdC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1BlcnNpc3RlbmNlRmFjdEN0cmwnXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gIC5zdGF0ZSgnYXBwLnBlcnNpc3RlbmNlLXF1ZXJ5LWZpbmQtYWxsJywge1xyXG4gICAgdXJsOiBcIi9wZXJzaXN0ZW5jZS9xdWVyeS1maW5kLWFsbFwiLFxyXG4gICAgdmlld3M6IHtcclxuICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wZXJzaXN0ZW5jZS9xdWVyeS1maW5kLWFsbC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1BlcnNpc3RlbmNlUXVlcnlGaW5kQWxsQ3RybCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgLnN0YXRlKCdhcHAucGVyc2lzdGVuY2UtcXVlcnktY3lwaGVyJywge1xyXG4gICAgdXJsOiBcIi9wZXJzaXN0ZW5jZS9xdWVyeS1jeXBoZXJcIixcclxuICAgIHZpZXdzOiB7XHJcbiAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcGVyc2lzdGVuY2UvcXVlcnktY3lwaGVyLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnUGVyc2lzdGVuY2VRdWVyeUN5cGhlckN0cmwnXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gIC5zdGF0ZSgnYXBwLnBlcnNpc3RlbmNlLWpvdXJuYWwtaW1hZ2UnLCB7XHJcbiAgICB1cmw6IFwiL3BlcnNpc3RlbmNlL2pvdXJuYWwtaW1hZ2VcIixcclxuICAgIHZpZXdzOiB7XHJcbiAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcGVyc2lzdGVuY2Uvam91cm5hbC1pbWFnZS5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1BlcnNpc3RlbmNlSm91cm5hbEltYWdlQ3RybCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgLnN0YXRlKCdhcHAucGVyc2lzdGVuY2Utam91cm5hbC1qb2ludCcsIHtcclxuICAgIHVybDogXCIvcGVyc2lzdGVuY2Uvam91cm5hbC1qb2ludFwiLFxyXG4gICAgdmlld3M6IHtcclxuICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wZXJzaXN0ZW5jZS9qb3VybmFsLWpvaW50Lmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnUGVyc2lzdGVuY2VKb3VybmFsSm9pbnRDdHJsJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICAuc3RhdGUoJ2FwcC5wZXJzaXN0ZW5jZS1qb3VybmFsLXNvbmFyJywge1xyXG4gICAgdXJsOiBcIi9wZXJzaXN0ZW5jZS9qb3VybmFsLXNvbmFyXCIsXHJcbiAgICB2aWV3czoge1xyXG4gICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3BlcnNpc3RlbmNlL2pvdXJuYWwtc29uYXIuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQZXJzaXN0ZW5jZUpvdXJuYWxTb25hckN0cmwnXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gIC5zdGF0ZSgnYXBwLnBlcnNpc3RlbmNlLWpvdXJuYWwtdGFjdGlsZScsIHtcclxuICAgIHVybDogXCIvcGVyc2lzdGVuY2Uvam91cm5hbC10YWN0aWxlXCIsXHJcbiAgICB2aWV3czoge1xyXG4gICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3BlcnNpc3RlbmNlL2pvdXJuYWwtdGFjdGlsZS5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1BlcnNpc3RlbmNlSm91cm5hbFRhY3RpbGVDdHJsJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICAuc3RhdGUoJ2FwcC5wZXJzaXN0ZW5jZS1qb3VybmFsLWJhdHRlcnknLCB7XHJcbiAgICB1cmw6IFwiL3BlcnNpc3RlbmNlL2pvdXJuYWwtYmF0dGVyeVwiLFxyXG4gICAgdmlld3M6IHtcclxuICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wZXJzaXN0ZW5jZS9qb3VybmFsLWJhdHRlcnkuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQZXJzaXN0ZW5jZUpvdXJuYWxCYXR0ZXJ5Q3RybCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG5cclxuICAuc3RhdGUoJ2FwcC5zb2NpYWwtY2hhdCcsIHtcclxuICAgIHVybDogXCIvc29jaWFsLWNoYXRcIixcclxuICAgIHZpZXdzOiB7XHJcbiAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvc29jaWFsL2NoYXQuaHRtbFwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gIC5zdGF0ZSgnYXBwLnNvY2lhbC1tb25pdG9yJywge1xyXG4gICAgdXJsOiBcIi9zb2NpYWwtbW9uaXRvclwiLFxyXG4gICAgdmlld3M6IHtcclxuICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9zb2NpYWwvbW9uaXRvci5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1NvY2lhbE1vbml0b3JDdHJsJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICAuc3RhdGUoJ2FwcC5zb2NpYWwtZXhwcmVzcycsIHtcclxuICAgIHVybDogXCIvc29jaWFsLWV4cHJlc3NcIixcclxuICAgIHZpZXdzOiB7XHJcbiAgICAgICdtZW51Q29udGVudCc6IHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvc29jaWFsL2V4cHJlc3MuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTb2NpYWxFeHByZXNzQ3RybCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIC5zdGF0ZSgnYXBwLnNldHRpbmdzJywge1xyXG4gICAgdXJsOiBcIi9zZXR0aW5nc1wiLFxyXG4gICAgdmlld3M6IHtcclxuICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9zZXR0aW5ncy5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzQ3RybCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIC5zdGF0ZSgnYXBwLnNlYXJjaCcsIHtcclxuICAgIHVybDogXCIvc2VhcmNoXCIsXHJcbiAgICB2aWV3czoge1xyXG4gICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3NlYXJjaC5odG1sXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIC5zdGF0ZSgnYXBwLmJyb3dzZScsIHtcclxuICAgIHVybDogXCIvYnJvd3NlXCIsXHJcbiAgICB2aWV3czoge1xyXG4gICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2Jyb3dzZS5odG1sXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgICAuc3RhdGUoJ2FwcC5wbGF5bGlzdHMnLCB7XHJcbiAgICAgIHVybDogXCIvcGxheWxpc3RzXCIsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3BsYXlsaXN0cy5odG1sXCIsXHJcbiAgICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RzQ3RybCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gIC5zdGF0ZSgnYXBwLnNpbmdsZScsIHtcclxuICAgIHVybDogXCIvcGxheWxpc3RzLzpwbGF5bGlzdElkXCIsXHJcbiAgICB2aWV3czoge1xyXG4gICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3BsYXlsaXN0Lmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RDdHJsJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcclxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL2hvbWUnKTtcclxufSlcclxuXHJcbi5kaXJlY3RpdmUoJ25nRW50ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgIGVsZW1lbnQuYmluZChcImtleWRvd24ga2V5cHJlc3NcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmKGV2ZW50LndoaWNoID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsKGF0dHJzLm5nRW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
