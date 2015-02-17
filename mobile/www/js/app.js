// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'AngularStomp', 'webcam'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
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
          templateUrl: "templates/avatar/remote-control.html",
          controller: 'AvatarRemoteControlCtrl'
        }
      }
    })
  .state('app.avatar-instruments', {
      url: "/avatar/instruments",
      views: {
        'menuContent': {
          templateUrl: "templates/avatar/instruments.html",
          controller: 'AvatarInstrumentsCtrl'
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
  .state('app.face-recognition-cam', {
    url: "/face-recognition-cam",
    views: {
      'menuContent': {
        templateUrl: "templates/face-recognition-cam.html",
        controller: 'FaceRecognitionCamCtrl'
      }
    }
  })

  .state('app.social-monitor', {
    url: "/social-monitor",
    views: {
      'menuContent': {
        templateUrl: "templates/social-monitor.html",
        controller: 'SocialMonitorCtrl'
      }
    }
  })
  .state('app.social-express', {
    url: "/social-express",
    views: {
      'menuContent': {
        templateUrl: "templates/social-express.html",
        controller: 'SocialExpressCtrl'
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
});
