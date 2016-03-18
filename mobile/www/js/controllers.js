/// <reference path="../typings/main.d.ts"/>
angular.module('starter.controllers', [])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    var ctrl = this;
    // Form data for the login modal
    this.loginData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        ctrl.modal = modal;
    });
    // Triggered in the login modal to close it
    this.closeLogin = function () {
        ctrl.modal.hide();
    };
    // Open the login modal
    this.login = function () {
        ctrl.modal.show();
    };
    // Perform the login action when the user submits the login form
    this.doLogin = function () {
        console.log('Doing login', ctrl.loginData);
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            ctrl.closeLogin();
        }, 1000);
    };
})
    .controller('SettingsCtrl', function ($scope, $log, $window, Settings) {
    $scope.settings = Settings.getSettings();
    $scope.save = function () {
        Settings.setSettings($scope.settings);
        $window.alert('Settings saved.');
    };
    $scope.reset = function () {
        $scope.settings = Settings.getDefault();
    };
    $scope.resetLocal = function () {
        $scope.settings = {
            stompUri: 'ws://localhost:15674/ws',
            stompUser: 'guest',
            stompPassword: 'guest'
        };
    };
    $scope.resetWindow = function () {
        $scope.settings = {
            stompUri: 'ws://' + $window.location.hostname + ':15674/ws',
            stompUser: 'lumen',
            stompPassword: 'lumen'
        };
    };
})
    .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
    ];
})
    .controller('PlaylistCtrl', function ($scope, $stateParams) {
});

//# sourceMappingURL=data:application/json;base64,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QUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN2QixFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtLQUM1QixDQUFDO0FBQ0osQ0FBQyxDQUFDO0tBRUQsVUFBVSxDQUFDLGNBQWMsRUFBRSxVQUFTLE1BQU0sRUFBRSxZQUFZO0FBQ3pELENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbnRyb2xsZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvbWFpbi5kLnRzXCIvPlxyXG5hbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5jb250cm9sbGVycycsIFtdKVxyXG5cclxuLmNvbnRyb2xsZXIoJ0FwcEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRpb25pY01vZGFsLCAkdGltZW91dCkge1xyXG4gIHZhciBjdHJsID0gdGhpcztcclxuICAvLyBGb3JtIGRhdGEgZm9yIHRoZSBsb2dpbiBtb2RhbFxyXG4gIHRoaXMubG9naW5EYXRhID0ge307XHJcblxyXG4gIC8vIENyZWF0ZSB0aGUgbG9naW4gbW9kYWwgdGhhdCB3ZSB3aWxsIHVzZSBsYXRlclxyXG4gICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL2xvZ2luLmh0bWwnLCB7XHJcbiAgICBzY29wZTogJHNjb3BlXHJcbiAgfSkudGhlbihmdW5jdGlvbihtb2RhbCkge1xyXG4gICAgY3RybC5tb2RhbCA9IG1vZGFsO1xyXG4gIH0pO1xyXG5cclxuICAvLyBUcmlnZ2VyZWQgaW4gdGhlIGxvZ2luIG1vZGFsIHRvIGNsb3NlIGl0XHJcbiAgdGhpcy5jbG9zZUxvZ2luID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjdHJsLm1vZGFsLmhpZGUoKTtcclxuICB9O1xyXG5cclxuICAvLyBPcGVuIHRoZSBsb2dpbiBtb2RhbFxyXG4gIHRoaXMubG9naW4gPSBmdW5jdGlvbigpIHtcclxuICAgIGN0cmwubW9kYWwuc2hvdygpO1xyXG4gIH07XHJcblxyXG4gIC8vIFBlcmZvcm0gdGhlIGxvZ2luIGFjdGlvbiB3aGVuIHRoZSB1c2VyIHN1Ym1pdHMgdGhlIGxvZ2luIGZvcm1cclxuICB0aGlzLmRvTG9naW4gPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdEb2luZyBsb2dpbicsIGN0cmwubG9naW5EYXRhKTtcclxuXHJcbiAgICAvLyBTaW11bGF0ZSBhIGxvZ2luIGRlbGF5LiBSZW1vdmUgdGhpcyBhbmQgcmVwbGFjZSB3aXRoIHlvdXIgbG9naW5cclxuICAgIC8vIGNvZGUgaWYgdXNpbmcgYSBsb2dpbiBzeXN0ZW1cclxuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICBjdHJsLmNsb3NlTG9naW4oKTtcclxuICAgIH0sIDEwMDApO1xyXG4gIH07XHJcbn0pXHJcblxyXG4uY29udHJvbGxlcignU2V0dGluZ3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9nLCAkd2luZG93LCBTZXR0aW5ncykge1xyXG4gICAgJHNjb3BlLnNldHRpbmdzID0gU2V0dGluZ3MuZ2V0U2V0dGluZ3MoKTtcclxuICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U2V0dGluZ3MoJHNjb3BlLnNldHRpbmdzKTtcclxuICAgICAgICAkd2luZG93LmFsZXJ0KCdTZXR0aW5ncyBzYXZlZC4nKTtcclxuICAgIH07XHJcbiAgICAkc2NvcGUucmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSBTZXR0aW5ncy5nZXREZWZhdWx0KCk7XHJcbiAgICB9O1xyXG4gICAgJHNjb3BlLnJlc2V0TG9jYWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIHN0b21wVXJpOiAnd3M6Ly9sb2NhbGhvc3Q6MTU2NzQvd3MnLFxyXG4gICAgICAgICAgICBzdG9tcFVzZXI6ICdndWVzdCcsXHJcbiAgICAgICAgICAgIHN0b21wUGFzc3dvcmQ6ICdndWVzdCdcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgICRzY29wZS5yZXNldFdpbmRvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICRzY29wZS5zZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgc3RvbXBVcmk6ICd3czovLycgKyAkd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICsgJzoxNTY3NC93cycsXHJcbiAgICAgICAgICAgIHN0b21wVXNlcjogJ2x1bWVuJyxcclxuICAgICAgICAgICAgc3RvbXBQYXNzd29yZDogJ2x1bWVuJ1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG59KVxyXG5cclxuLmNvbnRyb2xsZXIoJ1BsYXlsaXN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuICAkc2NvcGUucGxheWxpc3RzID0gW1xyXG4gICAgeyB0aXRsZTogJ1JlZ2dhZScsIGlkOiAxIH0sXHJcbiAgICB7IHRpdGxlOiAnQ2hpbGwnLCBpZDogMiB9LFxyXG4gICAgeyB0aXRsZTogJ0R1YnN0ZXAnLCBpZDogMyB9LFxyXG4gICAgeyB0aXRsZTogJ0luZGllJywgaWQ6IDQgfSxcclxuICAgIHsgdGl0bGU6ICdSYXAnLCBpZDogNSB9LFxyXG4gICAgeyB0aXRsZTogJ0Nvd2JlbGwnLCBpZDogNiB9XHJcbiAgXTtcclxufSlcclxuXHJcbi5jb250cm9sbGVyKCdQbGF5bGlzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcykge1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
