/// <reference path="../typings/main.d.ts"/>
var HumanDetected = (function () {
    function HumanDetected() {
    }
    return HumanDetected;
}());
angular.module('starter.controllers')
    .controller('VisualCameraCtrl', function ($scope, $stateParams, $log, Settings, LumenStomp) {
    $scope.imageObject = null;
    $scope.bottomImageObject = null;
    $scope.recognizeds = [];
    $scope.client = null;
    $scope.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    $scope.form = {
        avatarId: 'nao1',
        agentId: 'arkan'
    };
    // Avatar
    $scope.switchAvatar = function () {
        LumenStomp.unsubscribeAll();
        $scope.imageObject = null;
        $scope.bottomImageObject = null;
        LumenStomp.subscribe('/topic/avatar.' + $scope.form.avatarId + '.camera.main', function (msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.imageObject = imageObject;
            $log.debug('Got main ImageObject', imageObject);
        });
        LumenStomp.subscribe('/topic/avatar.' + $scope.form.avatarId + '.camera.bottom', function (msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.bottomImageObject = imageObject;
            $log.debug('Got bottom ImageObject', imageObject);
        });
        LumenStomp.subscribe('/topic/lumen.' + $scope.form.agentId + '.face.recognition', function (msg) {
            var recognized = JSON.parse(msg.body);
            if (recognized.index == 0) {
                $scope.recognizeds = [];
            }
            recognized.cssStyle = {
                left: recognized.minPoint.x + 'px',
                top: recognized.minPoint.y + 'px'
            };
            $scope.recognizeds.push(recognized);
        });
        $log.info('Subscriptions:', LumenStomp.getSubscriptions());
    };
    $scope.$on('$ionicView.enter', function () {
        LumenStomp.connect(function () {
            $scope.client = LumenStomp.getClient();
            $scope.switchAvatar();
        });
    });
    $scope.$on('$ionicView.beforeLeave', function () {
        LumenStomp.disconnect();
    });
})
    .controller('ObjectRecognitionCtrl', function ($scope, $stateParams, $log, Settings, LumenStomp) {
    $scope.imageObject = null;
    $scope.bottomImageObject = null;
    $scope.recognizeds = [];
    $scope.client = null;
    $scope.avatarIds = ['nao1', 'nao2',
        'anime1', 'anime2', 'anime3', 'anime4', 'anime5', 'anime6', 'anime7', 'anime8', 'anime9', 'anime10'];
    $scope.form = {
        avatarId: 'nao1',
        agentId: 'arkan'
    };
    // Avatar
    $scope.switchAvatar = function () {
        LumenStomp.unsubscribeAll();
        /*LumenStomp.subscribe('/topic/avatar.' + $scope.form.avatarId + '.camera.main', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.imageObject = imageObject;
            $log.debug('Got main ImageObject', imageObject);
        });
        LumenStomp.subscribe('/topic/avatar.' + $scope.form.avatarId + '.camera.bottom', function(msg) {
            var imageObject = JSON.parse(msg.body);
            $scope.bottomImageObject = imageObject;
            $log.debug('Got bottom ImageObject', imageObject);
        });*/
        LumenStomp.subscribe('/topic/lumen.visual.hogobj.recognition', function (msg) {
            var recognizeds = JSON.parse(msg.body);
            $log.debug('Received RecognizedObjects', recognizeds);
            $scope.recognizeds = recognizeds;
        });
        $log.info('Subscriptions:', LumenStomp.getSubscriptions());
    };
    $scope.$on('$ionicView.enter', function () {
        LumenStomp.connect(function () {
            $scope.client = LumenStomp.getClient();
            $scope.switchAvatar();
        });
    });
    $scope.$on('$ionicView.beforeLeave', function () {
        LumenStomp.disconnect();
    });
    $scope.sendMockRecognizedObjects = function () {
        var recognizedObjects = {
            "@type": "RecognizedObjects",
            "hasPosition": true,
            "hasDistance": false,
            "hasYaw": false,
            "trashes": [
                {
                    "@type": "RecognizedObject",
                    "topPosition": { "@type": "Vector2", "x": 45, "y": 70 },
                    "bottomPosition": null
                },
                {
                    "@type": "RecognizedObject",
                    "topPosition": null,
                    "bottomPosition": { "@type": "Vector2", "x": 98, "y": 120 }
                }
            ],
            "trashCans": [
                {
                    "@type": "RecognizedObject",
                    "topPosition": null,
                    "bottomPosition": { "@type": "Vector2", "x": 118, "y": 20 }
                }
            ]
        };
        $log.debug('Sending RecognizedObjects', recognizedObjects);
        $scope.client.send('/topic/lumen.visual.hogobj.recognition', {}, JSON.stringify(recognizedObjects));
    };
})
    .controller('FaceRecognitionImgCtrl', function ($scope, $stateParams, $log, LumenStomp, Settings) {
    $scope.imageObject = null;
    $scope.recognizeds = [];
    // Avatar
    $scope.switchAvatar = function () {
        LumenStomp.unsubscribeAll();
        $scope.imageObject = null;
        $scope.bottomImageObject = null;
        LumenStomp.subscribe('/topic/lumen.arkan.face.recognition', function (msg) {
            var recognized = JSON.parse(msg.body);
            recognized.cssStyle = {
                left: recognized.minPoint.x + 'px',
                top: recognized.minPoint.y + 'px'
            };
            $scope.recognizeds.push(recognized);
        });
        $log.info('Subscriptions:', LumenStomp.getSubscriptions());
    };
    $scope.$on('$ionicView.enter', function () {
        LumenStomp.connect(function () {
            $scope.client = LumenStomp.getClient();
            $scope.switchAvatar();
        });
    });
    $scope.$on('$ionicView.beforeLeave', function () {
        LumenStomp.disconnect();
    });
    $scope.testStomp = function () {
        var imageObject = {
            '@type': 'ImageObject',
            name: 'wajah1_240p.jpg',
            contentType: 'image/jpeg',
            contentSize: 4880,
            dateModified: "2015-01-09T08:05:37.000Z",
            contentUrl: "data:image/jpeg;base64,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Jx2Gee3rHw5kjl8G2csUiSI/mEMjBgf3jdxQBuUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAcl8dIrmf4W6nDaPseRoFZuPlQzx7zk8D5N3Jr588QaLaaJ4Fh0/T4/LtUdAhdyXnx/HjqRkn5m4ORjGa+ofE2mjV9Dn04yLH52352jEgXDBs7Twenfj69K4TxJ8Jv7W017IeIWto2kWQFLQszMpGC5MmW4zxwBnjHSgD5wgfyi0LHjqKZcBJJEkdfw9a9uvP2ehOc/wDCW7Txg/2b/wDbag/4ZzcqVbxrkf8AYK/+20AeLX2qLzHGGCjsDwPYVzHiK81eVRFZRTXB3cRqS2K+l4f2drZRiTxOHGQcDTsc/wDf2tiw+ClvZxlYNbjUsACwsOf/AEZQB8Xzv48gjMk2g3KRsCQSCTjpznn86xVi1C7uDNd28i7TzubpX3LqPwUmuoyq+KY489/7Myf/AEbXMal+zCl40jP4zVWk6kaR/wDbqAPljTxEIuADjpnvWhpMc1zcQQJBJI0kqxhYl3Eljj+hr6Hj/ZNij+746H46P/8Abq29H/ZuTTo4RB4xYPBcxXKSDTPm3qCDz5vQjt2PPNAHm+pbbLzry3kVRaK0dqy/8smb5A4HYiOLzPYsP71UvhfNMYbhYrdg0rj7NAMN+9k4jbnAISMKB6FvevbH+BMD2t1bnxH+7uN+xRYf6vcmzH+s5G3j8TRonwJTTb4Tx+JgY9jI8S6dtDAxhMf6zjkA/higDyPxsq6ZpyxwNJJGreTCY+WkQENNJ6ZkcbRnsOOrV9G/AaYXHwn0mYCAbhLlYBhFImcFR64xjPfGe9cnrXwSOpac9vN4mAlZhtl/s/7iBfugeZ/e+brznHvXoXw/0EeGPB1joQuEuPsaFfNSARK5LFs7ATjr60AbNFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//9k="
        };
        $log.info('ImageObject', imageObject, JSON.stringify(imageObject));
        $scope.client.send('/topic/avatar.nao1.camera.main', {}, JSON.stringify(imageObject));
    };
    $scope.loadImage = function () {
        $scope.recognizeds = [];
        var imageFileEl = document.getElementById('imageFile');
        // {"webkitRelativePath":"","lastModified":1373040168000,"lastModifiedDate":"2013-07-05T16:02:48.000Z","name":"Sate Tegal Balibul3.jpg","type":"image/jpeg","size":42082}
        var imageFile = imageFileEl.files[0];
        $log.debug('Reading...', imageFileEl, imageFileEl.files, imageFile, JSON.stringify(imageFile));
        // ImageObject: name, contentType, contentUrl, contentSize, width, height, uploadDate, dateCreated, dateModified, datePublished
        var reader = new FileReader();
        reader.onloadend = function () {
            $scope.$apply(function () {
                $scope.imageObject = {
                    '@type': 'ImageObject',
                    name: imageFile.name,
                    contentType: imageFile.type,
                    contentSize: imageFile.size,
                    dateModified: imageFile.lastModifiedDate,
                    contentUrl: reader.result
                };
                $log.info('ImageObject', $scope.imageObject, JSON.stringify($scope.imageObject));
            });
        };
        reader.readAsDataURL(imageFile);
    };
    $scope.recognize = function () {
        $log.info('Recognizing...', $scope.imageObject, JSON.stringify($scope.imageObject));
        $scope.client.send('/topic/avatar.nao1.camera.main', {}, JSON.stringify($scope.imageObject));
    };
})
    .controller('FaceRecognitionCamCtrl', function ($scope, $stateParams, $log, $interval, LumenStomp, Settings) {
    'use strict';
    $scope.imageObject = null;
    $scope.recognizeds = [];
    $scope.humanPos = { x: null, y: null, z: null };
    $scope.markers = {};
    //    {
    //        position: {imageU: 10, imageV: 100, imageVH: 50},
    //        cssStyle: {left: '0px', top: '0px', height: '0px'}}];
    // Avatar
    $scope.switchAvatar = function () {
        LumenStomp.unsubscribeAll();
        LumenStomp.subscribe('/topic/lumen.arkan.face.recognition', function (msg) {
            var recognized = JSON.parse(msg.body);
            recognized.cssStyle = {
                left: recognized.minPoint.x + 'px',
                top: recognized.minPoint.y + 'px'
            };
            $scope.recognizeds.push(recognized);
        });
        LumenStomp.subscribe('/topic/lumen.arkan.human.detection', function (msg) {
            var humanChanges = JSON.parse(msg.body);
            var humanThings = humanChanges.humanDetecteds.concat(humanChanges.humanMovings);
            _.each(humanThings, function (e) {
                $log.debug('human', e.humanId, 'pos', e.position);
                $scope.humanPos = e.position;
                $scope.markers[e.humanId] = e;
                e.cssStyle = {
                    left: (e.imageU - 2) + 'px',
                    top: (e.imageV - e.imageVH) + 'px',
                    width: '5px',
                    height: e.imageVH + 'px'
                };
            });
        });
        $log.info('Subscriptions:', LumenStomp.getSubscriptions());
    };
    $scope.$on('$ionicView.enter', function () {
        LumenStomp.connect(function () {
            $scope.client = LumenStomp.getClient();
            $scope.switchAvatar();
        });
    });
    $scope.$on('$ionicView.beforeLeave', function () {
        LumenStomp.disconnect();
    });
    var imageContentType = 'image/jpeg'; // stomp.js can't handle big messages yet :(
    var _video = null, patData = null, dataUri = null;
    $scope.patOpts = { x: 0, y: 0, w: 320, h: 240 };
    $scope.streamingInterval = 1000;
    $scope.streamer = null;
    $scope.onStream = function (stream) {
        // You could do something manually with the stream.
        _video = document.querySelector('.webcam-live');
        $log.debug('onStream', stream, _video);
    };
    $scope.onAccessDenied = function (err) {
        $log.error('Webcam error:', err);
    };
    $scope.onStreaming = function () {
        _video = document.querySelector('.webcam-live');
        $log.debug('onStreaming', _video);
        // The video element contains the captured camera data
        //        $scope.$apply(function() {
        //            $scope.patOpts.w = _video.width;
        //            $scope.patOpts.h = _video.height;
        //        });
    };
    /* no longer used
        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = $scope.patOpts.w;
            hiddenCanvas.height = $scope.patOpts.h;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, $scope.patOpts.w, $scope.patOpts.h);
            return ctx.getImageData(x, y, w, h);
        };
        */
    /**
     * This function could be used to send the image data
     * to a backend server that expects base64 encoded images.
     *
     * In this example, we simply store it in the scope for display.
     */
    var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
        $scope.snapshotData = imgBase64;
    };
    /**
     * Make a snapshot of the camera data and show it in another canvas.
     */
    $scope.makeSnapshot = function makeSnapshot() {
        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas)
                return;
            patCanvas.width = $scope.patOpts.w;
            patCanvas.height = $scope.patOpts.h;
            var ctxPat = patCanvas.getContext('2d');
            //            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            //            ctxPat.putImageData(idata, 0, 0);
            ctxPat.drawImage(_video, 0, 0, $scope.patOpts.w, $scope.patOpts.h);
            $log.info($scope.markers.length, 'markers', $scope.markers);
            _.each($scope.markers, function (e, k) {
                ctxPat.beginPath();
                ctxPat.lineWidth = 8;
                ctxPat.strokeStyle = '#00ff00';
                ctxPat.moveTo(e.imageU, e.imageV);
                ctxPat.lineTo(e.imageU, e.imageV - e.imageVH);
                ctxPat.stroke();
            });
            var idata = ctxPat.getImageData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            sendSnapshotToServer(patCanvas.toDataURL(imageContentType));
            patData = idata;
        }
    };
    $scope.recognize = function () {
        if (!$scope.snapshotData) {
            alert('No $scope.snapshotData!');
            return;
        }
        $scope.imageObject = {
            '@type': 'ImageObject',
            name: 'camera.jpg',
            contentType: imageContentType,
            // TODO: contentSize: imageFile.size,
            // TODO: dateModified: imageFile.lastModifiedDate,
            contentUrl: $scope.snapshotData
        };
        $log.info('Recognizing...', $scope.imageObject, JSON.stringify($scope.imageObject));
        $scope.client.send('/topic/avatar.nao1.camera.main', {}, JSON.stringify($scope.imageObject));
        //        window.alert('Sent: ' + JSON.stringify($scope.imageObject).substr(0, 300));
    };
    $scope.makeSnapshotAndRecognize = function () {
        $scope.makeSnapshot();
        $scope.recognize();
    };
    /**
     * Redirect the browser to the URL given.
     * Used to download the image by passing a dataURL string
     */
    $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
        window.location.href = dataURL;
    };
    $scope.startStreaming = function () {
        $scope.streamer = $interval(function () {
            $scope.makeSnapshotAndRecognize();
        }, $scope.streamingInterval);
    };
    $scope.stopStreaming = function () {
        $log.info('Canceling streamer');
        $interval.cancel($scope.streamer);
        $scope.streamer = null;
    };
});

//# sourceMappingURL=data:application/json;base64,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LENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNwRixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNyRyxxRkFBcUY7SUFDakYsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxDQUFDLHdCQUF3QixHQUFHO1FBQzlCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDdkIsQ0FBQyxDQUFDO0lBRUY7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLGdCQUFnQixHQUFHLDBCQUEwQixPQUFPO1FBQ3ZELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUNuQyxDQUFDLENBQUM7SUFFRixNQUFNLENBQUMsY0FBYyxHQUFHO1FBQ3BCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ3RDLENBQUMsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUM7SUFDRixNQUFNLENBQUMsYUFBYSxHQUFHO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDLENBQUM7QUFDTixDQUFDLENBQUMsQ0FFRCIsImZpbGUiOiJ2aXN1YWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tYWluLmQudHNcIi8+XHJcblxyXG5jbGFzcyBIdW1hbkRldGVjdGVkIHtcclxuICAgIGh1bWFuSWQ6IHN0cmluZztcclxuICAgIHBvc2l0aW9uOiBhbnk7XHJcbiAgICByb3RhdGlvbjogYW55O1xyXG4gICAgaW1hZ2VVOiBudW1iZXI7XHJcbiAgICBpbWFnZVY6IG51bWJlcjtcclxuICAgIGltYWdlVkg6IG51bWJlcjtcclxuICAgIGNzc1N0eWxlOiBPYmplY3Q7XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJylcclxuXHJcbi5jb250cm9sbGVyKCdWaXN1YWxDYW1lcmFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRsb2csIFNldHRpbmdzLCBMdW1lblN0b21wKSB7XHJcbiAgICAkc2NvcGUuaW1hZ2VPYmplY3QgPSBudWxsO1xyXG4gICAgJHNjb3BlLmJvdHRvbUltYWdlT2JqZWN0ID0gbnVsbDtcclxuICAgICRzY29wZS5yZWNvZ25pemVkcyA9IFtdO1xyXG4gICAgJHNjb3BlLmNsaWVudCA9IG51bGw7XHJcbiAgICAkc2NvcGUuYXZhdGFySWRzID0gWyduYW8xJywgJ25hbzInLFxyXG4gICAgICAgICdhbmltZTEnLCAnYW5pbWUyJywgJ2FuaW1lMycsICdhbmltZTQnLCAnYW5pbWU1JywgJ2FuaW1lNicsICdhbmltZTcnLCAnYW5pbWU4JywgJ2FuaW1lOScsICdhbmltZTEwJ107XHJcbiAgICAkc2NvcGUuZm9ybSA9IHtcclxuICAgICAgICBhdmF0YXJJZDogJ25hbzEnLFxyXG4gICAgICAgIGFnZW50SWQ6ICdhcmthbidcclxuICAgIH07XHJcblxyXG4gICAgLy8gQXZhdGFyXHJcbiAgICAkc2NvcGUuc3dpdGNoQXZhdGFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTHVtZW5TdG9tcC51bnN1YnNjcmliZUFsbCgpO1xyXG4gICAgICAgICRzY29wZS5pbWFnZU9iamVjdCA9IG51bGw7XHJcbiAgICAgICAgJHNjb3BlLmJvdHRvbUltYWdlT2JqZWN0ID0gbnVsbDtcclxuICAgICAgICBMdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2F2YXRhci4nICsgJHNjb3BlLmZvcm0uYXZhdGFySWQgKyAnLmNhbWVyYS5tYWluJywgZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgICAgIHZhciBpbWFnZU9iamVjdCA9IEpTT04ucGFyc2UobXNnLmJvZHkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuaW1hZ2VPYmplY3QgPSBpbWFnZU9iamVjdDtcclxuICAgICAgICAgICAgJGxvZy5kZWJ1ZygnR290IG1haW4gSW1hZ2VPYmplY3QnLCBpbWFnZU9iamVjdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTHVtZW5TdG9tcC5zdWJzY3JpYmUoJy90b3BpYy9hdmF0YXIuJyArICRzY29wZS5mb3JtLmF2YXRhcklkICsgJy5jYW1lcmEuYm90dG9tJywgZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgICAgIHZhciBpbWFnZU9iamVjdCA9IEpTT04ucGFyc2UobXNnLmJvZHkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuYm90dG9tSW1hZ2VPYmplY3QgPSBpbWFnZU9iamVjdDtcclxuICAgICAgICAgICAgJGxvZy5kZWJ1ZygnR290IGJvdHRvbSBJbWFnZU9iamVjdCcsIGltYWdlT2JqZWN0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBMdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2x1bWVuLicgKyAkc2NvcGUuZm9ybS5hZ2VudElkICsgJy5mYWNlLnJlY29nbml0aW9uJywgZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgICAgIHZhciByZWNvZ25pemVkID0gSlNPTi5wYXJzZShtc2cuYm9keSk7XHJcbiAgICAgICAgICAgIGlmIChyZWNvZ25pemVkLmluZGV4ID09IDApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5yZWNvZ25pemVkcyA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlY29nbml6ZWQuY3NzU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiByZWNvZ25pemVkLm1pblBvaW50LnggKyAncHgnLFxyXG4gICAgICAgICAgICAgICAgdG9wOiByZWNvZ25pemVkLm1pblBvaW50LnkgKyAncHgnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzY29wZS5yZWNvZ25pemVkcy5wdXNoKHJlY29nbml6ZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRsb2cuaW5mbygnU3Vic2NyaXB0aW9uczonLCBMdW1lblN0b21wLmdldFN1YnNjcmlwdGlvbnMoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS4kb24oJyRpb25pY1ZpZXcuZW50ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBMdW1lblN0b21wLmNvbm5lY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jbGllbnQgPSBMdW1lblN0b21wLmdldENsaWVudCgpO1xyXG4gICAgICAgICAgICAkc2NvcGUuc3dpdGNoQXZhdGFyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgICRzY29wZS4kb24oJyRpb25pY1ZpZXcuYmVmb3JlTGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBMdW1lblN0b21wLmRpc2Nvbm5lY3QoKTtcclxuICAgIH0pO1xyXG59KVxyXG5cclxuLmNvbnRyb2xsZXIoJ09iamVjdFJlY29nbml0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkbG9nLCBTZXR0aW5ncywgTHVtZW5TdG9tcCkge1xyXG4gICAgJHNjb3BlLmltYWdlT2JqZWN0ID0gbnVsbDtcclxuICAgICRzY29wZS5ib3R0b21JbWFnZU9iamVjdCA9IG51bGw7XHJcbiAgICAkc2NvcGUucmVjb2duaXplZHMgPSBbXTtcclxuICAgICRzY29wZS5jbGllbnQgPSBudWxsO1xyXG4gICAgJHNjb3BlLmF2YXRhcklkcyA9IFsnbmFvMScsICduYW8yJyxcclxuICAgICAgICAnYW5pbWUxJywgJ2FuaW1lMicsICdhbmltZTMnLCAnYW5pbWU0JywgJ2FuaW1lNScsICdhbmltZTYnLCAnYW5pbWU3JywgJ2FuaW1lOCcsICdhbmltZTknLCAnYW5pbWUxMCddO1xyXG4gICAgJHNjb3BlLmZvcm0gPSB7XHJcbiAgICAgICAgYXZhdGFySWQ6ICduYW8xJyxcclxuICAgICAgICBhZ2VudElkOiAnYXJrYW4nXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEF2YXRhclxyXG4gICAgJHNjb3BlLnN3aXRjaEF2YXRhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAudW5zdWJzY3JpYmVBbGwoKTtcclxuICAgICAgICAvKkx1bWVuU3RvbXAuc3Vic2NyaWJlKCcvdG9waWMvYXZhdGFyLicgKyAkc2NvcGUuZm9ybS5hdmF0YXJJZCArICcuY2FtZXJhLm1haW4nLCBmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICAgICAgdmFyIGltYWdlT2JqZWN0ID0gSlNPTi5wYXJzZShtc2cuYm9keSk7XHJcbiAgICAgICAgICAgICRzY29wZS5pbWFnZU9iamVjdCA9IGltYWdlT2JqZWN0O1xyXG4gICAgICAgICAgICAkbG9nLmRlYnVnKCdHb3QgbWFpbiBJbWFnZU9iamVjdCcsIGltYWdlT2JqZWN0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBMdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2F2YXRhci4nICsgJHNjb3BlLmZvcm0uYXZhdGFySWQgKyAnLmNhbWVyYS5ib3R0b20nLCBmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICAgICAgdmFyIGltYWdlT2JqZWN0ID0gSlNPTi5wYXJzZShtc2cuYm9keSk7XHJcbiAgICAgICAgICAgICRzY29wZS5ib3R0b21JbWFnZU9iamVjdCA9IGltYWdlT2JqZWN0O1xyXG4gICAgICAgICAgICAkbG9nLmRlYnVnKCdHb3QgYm90dG9tIEltYWdlT2JqZWN0JywgaW1hZ2VPYmplY3QpO1xyXG4gICAgICAgIH0pOyovXHJcbiAgICAgICAgTHVtZW5TdG9tcC5zdWJzY3JpYmUoJy90b3BpYy9sdW1lbi52aXN1YWwuaG9nb2JqLnJlY29nbml0aW9uJywgZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgICAgIHZhciByZWNvZ25pemVkcyA9IEpTT04ucGFyc2UobXNnLmJvZHkpO1xyXG5cdFx0XHQkbG9nLmRlYnVnKCdSZWNlaXZlZCBSZWNvZ25pemVkT2JqZWN0cycsIHJlY29nbml6ZWRzKTtcclxuICAgICAgICAgICAgJHNjb3BlLnJlY29nbml6ZWRzID0gcmVjb2duaXplZHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGxvZy5pbmZvKCdTdWJzY3JpcHRpb25zOicsIEx1bWVuU3RvbXAuZ2V0U3Vic2NyaXB0aW9ucygpKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAuY29ubmVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNsaWVudCA9IEx1bWVuU3RvbXAuZ2V0Q2xpZW50KCk7XHJcbiAgICAgICAgICAgICRzY29wZS5zd2l0Y2hBdmF0YXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVMZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAuZGlzY29ubmVjdCgpO1xyXG4gICAgfSk7XHJcblxyXG5cdCRzY29wZS5zZW5kTW9ja1JlY29nbml6ZWRPYmplY3RzID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcmVjb2duaXplZE9iamVjdHMgPSB7XHJcblx0XHRcdFwiQHR5cGVcIjogXCJSZWNvZ25pemVkT2JqZWN0c1wiLFxyXG5cdFx0XHRcImhhc1Bvc2l0aW9uXCI6IHRydWUsXHJcblx0XHRcdFwiaGFzRGlzdGFuY2VcIjogZmFsc2UsXHJcblx0XHRcdFwiaGFzWWF3XCI6IGZhbHNlLFxyXG5cdFx0XHRcInRyYXNoZXNcIjogW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdFwiQHR5cGVcIjogXCJSZWNvZ25pemVkT2JqZWN0XCIsXHJcblx0XHRcdFx0XHRcInRvcFBvc2l0aW9uXCI6IHtcIkB0eXBlXCI6IFwiVmVjdG9yMlwiLCBcInhcIjogNDUsIFwieVwiOiA3MH0sXHJcblx0XHRcdFx0XHRcImJvdHRvbVBvc2l0aW9uXCI6IG51bGxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdFwiQHR5cGVcIjogXCJSZWNvZ25pemVkT2JqZWN0XCIsXHJcblx0XHRcdFx0XHRcInRvcFBvc2l0aW9uXCI6IG51bGwsXHJcblx0XHRcdFx0XHRcImJvdHRvbVBvc2l0aW9uXCI6IHtcIkB0eXBlXCI6IFwiVmVjdG9yMlwiLCBcInhcIjogOTgsIFwieVwiOiAxMjB9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcInRyYXNoQ2Fuc1wiOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XCJAdHlwZVwiOiBcIlJlY29nbml6ZWRPYmplY3RcIixcclxuXHRcdFx0XHRcdFwidG9wUG9zaXRpb25cIjogbnVsbCxcclxuXHRcdFx0XHRcdFwiYm90dG9tUG9zaXRpb25cIjoge1wiQHR5cGVcIjogXCJWZWN0b3IyXCIsIFwieFwiOiAxMTgsIFwieVwiOiAyMH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdF1cclxuXHRcdH07XHJcblx0XHQkbG9nLmRlYnVnKCdTZW5kaW5nIFJlY29nbml6ZWRPYmplY3RzJywgcmVjb2duaXplZE9iamVjdHMpO1xyXG5cdFx0JHNjb3BlLmNsaWVudC5zZW5kKCcvdG9waWMvbHVtZW4udmlzdWFsLmhvZ29iai5yZWNvZ25pdGlvbicsXHJcblx0XHRcdHt9LCBKU09OLnN0cmluZ2lmeShyZWNvZ25pemVkT2JqZWN0cykpO1xyXG5cdH07XHJcbn0pXHJcblxyXG4uY29udHJvbGxlcignRmFjZVJlY29nbml0aW9uSW1nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkbG9nLCBMdW1lblN0b21wLCBTZXR0aW5ncykge1xyXG4gICAgJHNjb3BlLmltYWdlT2JqZWN0ID0gbnVsbDtcclxuICAgICRzY29wZS5yZWNvZ25pemVkcyA9IFtdO1xyXG5cclxuICAgIC8vIEF2YXRhclxyXG4gICAgJHNjb3BlLnN3aXRjaEF2YXRhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAudW5zdWJzY3JpYmVBbGwoKTtcclxuICAgICAgICAkc2NvcGUuaW1hZ2VPYmplY3QgPSBudWxsO1xyXG4gICAgICAgICRzY29wZS5ib3R0b21JbWFnZU9iamVjdCA9IG51bGw7XHJcbiAgICAgICAgTHVtZW5TdG9tcC5zdWJzY3JpYmUoJy90b3BpYy9sdW1lbi5hcmthbi5mYWNlLnJlY29nbml0aW9uJywgZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgICAgIHZhciByZWNvZ25pemVkID0gSlNPTi5wYXJzZShtc2cuYm9keSk7XHJcbiAgICAgICAgICAgIHJlY29nbml6ZWQuY3NzU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiByZWNvZ25pemVkLm1pblBvaW50LnggKyAncHgnLFxyXG4gICAgICAgICAgICAgICAgdG9wOiByZWNvZ25pemVkLm1pblBvaW50LnkgKyAncHgnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzY29wZS5yZWNvZ25pemVkcy5wdXNoKHJlY29nbml6ZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRsb2cuaW5mbygnU3Vic2NyaXB0aW9uczonLCBMdW1lblN0b21wLmdldFN1YnNjcmlwdGlvbnMoKSk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmVudGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTHVtZW5TdG9tcC5jb25uZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2xpZW50ID0gTHVtZW5TdG9tcC5nZXRDbGllbnQoKTtcclxuICAgICAgICAgICAgJHNjb3BlLnN3aXRjaEF2YXRhcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmJlZm9yZUxlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTHVtZW5TdG9tcC5kaXNjb25uZWN0KCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgJHNjb3BlLnRlc3RTdG9tcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbWFnZU9iamVjdCA9IHtcclxuICAgICAgICAgICAgJ0B0eXBlJzogJ0ltYWdlT2JqZWN0JyxcclxuICAgICAgICAgICAgbmFtZTogJ3dhamFoMV8yNDBwLmpwZycsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnaW1hZ2UvanBlZycsXHJcbiAgICAgICAgICAgIGNvbnRlbnRTaXplOiA0ODgwLFxyXG4gICAgICAgICAgICBkYXRlTW9kaWZpZWQ6IFwiMjAxNS0wMS0wOVQwODowNTozNy4wMDBaXCIsXHJcbiAgICAgICAgICAgIGNvbnRlbnRVcmw6IFwiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFFQVlBQmdBQUQvNFFCb1JYaHBaZ0FBVFUwQUtnQUFBQWdBQkFFYUFBVUFBQUFCQUFBQVBnRWJBQVVBQUFBQkFBQUFSZ0VvQUFNQUFBQUJBQUlBQUFFeEFBSUFBQUFTQUFBQVRnQUFBQUFBQUFCZ0FBQUFBUUFBQUdBQUFBQUJVR0ZwYm5RdVRrVlVJSFl6TGpVdU1UQUEvOXNBUXdBRUFnTURBd0lFQXdNREJBUUVCQVVKQmdVRkJRVUxDQWdHQ1EwTERRME5Dd3dNRGhBVUVRNFBFdzhNREJJWUVoTVZGaGNYRnc0UkdSc1pGaG9VRmhjVy85c0FRd0VFQkFRRkJRVUtCZ1lLRmc4TUR4WVdGaFlXRmhZV0ZoWVdGaFlXRmhZV0ZoWVdGaFlXRmhZV0ZoWVdGaFlXRmhZV0ZoWVdGaFlXRmhZV0ZoWVdGaFlXLzhBQUVRZ0E4QUZBQXdFaUFBSVJBUU1SQWYvRUFCOEFBQUVGQVFFQkFRRUJBQUFBQUFBQUFBQUJBZ01FQlFZSENBa0tDLy9FQUxVUUFBSUJBd01DQkFNRkJRUUVBQUFCZlFFQ0F3QUVFUVVTSVRGQkJoTlJZUWNpY1JReWdaR2hDQ05Dc2NFVlV0SHdKRE5pY29JSkNoWVhHQmthSlNZbktDa3FORFUyTnpnNU9rTkVSVVpIU0VsS1UxUlZWbGRZV1ZwalpHVm1aMmhwYW5OMGRYWjNlSGw2ZzRTRmhvZUlpWXFTazVTVmxwZVltWnFpbzZTbHBxZW9xYXF5czdTMXRyZTR1YnJDdzhURnhzZkl5Y3JTMDlUVjF0ZlkyZHJoNHVQazVlYm42T25xOGZMejlQWDI5L2o1K3YvRUFCOEJBQU1CQVFFQkFRRUJBUUVBQUFBQUFBQUJBZ01FQlFZSENBa0tDLy9FQUxVUkFBSUJBZ1FFQXdRSEJRUUVBQUVDZHdBQkFnTVJCQVVoTVFZU1FWRUhZWEVUSWpLQkNCUkNrYUd4d1Frak0xTHdGV0p5MFFvV0pEVGhKZkVYR0JrYUppY29LU28xTmpjNE9UcERSRVZHUjBoSlNsTlVWVlpYV0ZsYVkyUmxabWRvYVdwemRIVjJkM2g1ZW9LRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVMajVPWG01K2pwNnZMejlQWDI5L2o1K3YvYUFBd0RBUUFDRVFNUkFEOEErL3FLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0s4bi9iaTFJNlQreTE0cTFBZmVpUzEyY1orWnJ1RlIrcEZmbDJMZTR1Ym5lOC9uVFR0ODVVNUFKUHI3LzBvQS9aeWl2emcrQi9ocURUZENVaVA5OUlmM2pZL1N2WGRMc1pIalZRRHQ5cUFQc0tpdmw2SFJyaU1MaVBEZWpEdFUvOWxxT1NCazlmZWdENmFvcjVqYlRFRGRCMXFHNjA5amxHT2VPTTk2QVBxS2l2ajdYckVxKzBqZytsY0I0eDB4SlluaGRBVmJJWUgwb0EvUUNpdnh6K0lHanY0VjhZUTN0c2pLMEV5elJNcDI5R0JBelgwSDRmdllOUzBlM3Y3Ujk4TnhHSkVZakdRUm5uMDlNZlgwb0EvUW1pdmdQazlxK3ZmMlhlUGdWb2YvYngvd0NsTXRBSGYwVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFlSy93REJRNVEzN0huakJUMFAySC8wdnQ2L092NGYyY2JheEdHVTdGd1ZHM3ZYNk0vOEZBd0QreUo0dUIvNmNlMy9BRS9XOWZBM3dlMGQ5VjFSVVNOL0xqKzg2dDIrdmFnRDNiNFoybWRORXlybFMrTTRyMGF4OHUyUVpQYml1VjBKRTA3U29vSWx3c1FDclhTNllKTGhBWEJZa2RxQU5WdFZWWWxZZlExVm4xV0lPU3pZRldvOUdMUTc1QnQ5alMvMkxDNEIzYzQ1b0FaYTMwY2k1QnpWYTl1Q0p1T2xTcjRka3NyZ3NranNINStaczFQY2FKTzhmbTdPbzY3cUFPYTFpWGZMbCt2YXVUOFJScExnZDgxMjE5cGI3ekczTGRzVnpldmFaTEhHeElPUm1nRHd2NCthVWttbG1jRDVvd2NjWjlxMi9nZUQvd0FLN3NBV1ZsQWJHM3Q4eDRxNThTTEgrME5GdTRTdVg4dHRvNzV4eFZENEhTRnZBME1aQVVSeU91QjJPN0p6NzgwQWRsZ1Y5ZWZzdi84QUpDOUQvd0Mzai8wcGxyNUR5RDByNjgvWmYvNUlYb2YvQUc4ZitsTXRBSGZVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFlTS84RkJVYVQ5a1B4Y2k5VDloNi93RFg5YjE4dWZCSFRZZE84RXdYRWlLTGljYm1iMjZDdnEzOXUzSC9BQXlyNG95TWpObHgvd0J2dHZYelA0QlRkNFd0UmpqeWx3UHJ6L1dnRGVzN3BIblV6RXJDdGRIYStMckhUb1ExdmI3bUhRc21jMXkwMHVuYWYrL3ZaVmpqakc0bVJzS1ByV2ZxSHhpOEZhYlp6SUhhYmFtN0VGdnV6NzU2QVVBZFZxbnhoMCsxWlZ1b0c1UHprREFIc0NNNS9TckduZkUzUTcrRnBZWlN1T2dQclhnWGlUNGsrRXZFN05GcDJpWHpUYkN6SHlnQ1BjNE5ZWGhtTzkxVy93QWFGSkxOR0hBZE9mazlNa2NBZGV0QUgxbDRmOFFEVUxkcDVKVGpQeUJtNlV0NTR3dGJTM2xnYVZjaFRrNTYxd0hoL3dBTytOSTlCaksvWXdvSHlxck8yZU81SXJ6VDRvWFBpZTFsQ1REeW15UURHU2YvQUs5QUhzV3NmRWpRdE9UZmNUTTdzQmhGR2E1L1ZQaWRwZW9JMFhrc3B6akxITmVJYVA4QVkzdmZOMXpVNW0yRExoZUZBL25YYzZmNG8rRjBRVzNzNzJBUzdCdWVaR0JQdHVJNU5BRnZWZFN0YjJWdktiQnJKK0ROdTF2NGZ1RTh2WkdMMllJUFlNUUQrWEg0VmF2WTdLNXVvN2l3S2VVVHcwYlpWdmNldGFmZ1d6RUdteVJNQnVFOGhPRC9BSG5MRGo2RVVBYVlBcjY4L1pmL0FPU0dhSC8yOGY4QXBUTFh5WjVKNzE5YS9zeWpiOEVORUgvWHgvNlVTMEFkNVJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQjVkKzJqWXRxUDdNbmltMFQ3elJXN3I5VnVZbkgvb05mTjN3emlpWFNiRlgyN2ZzOGVCL3dBQkZmU243WkYvSnBuN052aVc4aWg4NWtXMlVKbkdkMTFDdjlhK2JQQzU4aU9HQmhzS3FGSUl4dHdBTUVldkZBSFY2MTRhMGJWcG8wdmJhT1pPckl3NC9Hc1hWdmh4cFNXTndtbmFaWTdib0ZaRUtCTWc5dU9PNTdEOUs3RFM3V3psaUYwMCtDT2dKNjB6VnBKcFBsdGJqeTJQUTBBZVYrRmZoWm8rZ3pQTStsMjlxSlBsbGMzRWtyRmY3dlBUK3Zmb0s3ZlFmQjJuYWJpOXQ3Zlo1eWJWSkEzc21jZ2ZUSjlhMGRGMFF0ZEM2MUc1ZTZrUnNvdjNVSDRkNjE3NjVTTmpJWkY4MG41VnowL0R0UUJHcVBiYWY1YnlLbzlNZEI2VjVuNHZ0aTJyYmdkd0tzcDQ1Q25nNFBicjE2anJYb1FNend2NWltVGNlUzFjbjQ0dFJFeXpvQ05vNkR2UUJ6bzhFZUhadkRkM2JXRVIzMzBJVzRpeWlNK09oNEFCT2NjbnIzcnptUDRRMmxoUGNFV3Q5TTBvSVV6aEFzYW4zVWtaeU90ZW42Wk9rcWdvMk9lUFZhMWZLMUs0WEN5cElnUDNqMXhRQjV0NEk4RXg2REV5eHp5bFR5eU1jalB0Vy9vdjJyL2hJUll3VzQ4bGxaNVppZXA0QVVDdXB2ck5iT3hkNWR1MGdrMVQ4Qy92WVhrMmpoaU1rYzhrZjBGQUY0YVVkdk1pKzJCWDFCK3p2RDVId2QwZUxPZHZuOC85dDVEWHoxNVl4bkg2VjlHZkFnWStGT2xEL3J0LzZPa29BNjZpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0R6MzlxaTFsdmZnUHJsdkZFMGpNMXF4UmVwQzNVTEhINEExOHYzazRiWFpaNE54amtiY3U1TnB3ZlVlb3I2MytOdUI4TWRTSmZZTjBIelp4L3kzanI1TzhYU0l2aUZwSW1WMlVBdUZidi93RHF4UUIwUGhrNzJCZVY5dU9VREQxNjhWMHkyMWowUmd5OThaL25YRmFPNWVOWm9SaDFIUEdLMTFsZklKTFlibkdUUUJvNjdxbHRwRm03d0x5cW5CNU5ZR2hYU1RiNy9WYm5hU2VkdlVjWkdLdHphZTJxNnBGYlNMKzZEQXZ6MnJCK0puaExWTDh2SHBFc0tRM0IyeXE4akpzSFRnanJ3S0FPa3RQSGVsU1dBajAyTzJsamprT1pnUXhZanQvbnZYTWZFcnhoWVhpN25TS0pkbklVWTUvQ3VYMEg0TXhlRC9EVnlOQzFxYVM3dVgzU3h6bmJEa0FBQlIvZTY1UGNZOUs0M3g5NEIxWFVMT08zMXE3bkVpbmY5bXRwUGxaaHlOeFBCb0E3blFMeUdLNFlJaXl4eS9Pb0RmZE5kUnA4c1VYN3hHUFBVWjZtdk9mQVdqM3RwWTdMMEZXalVLcStadTQ5eUs2Z1hKaVhaME8zbHMwQVdmR2x6L3p6Yjc0NVUxZCtIdHUvOW5iOW9PZWNWeWVxWFBuU0tvZmQ3MTZQNEVzaU5FajNJM09BQ2VBUUJqajhjMEFTK1hPR0trcnp5SytpdmdVQ3Z3cjBzSHIrKy84QVIwbGVHalQzYVA1UXB3ZU1qTmU4ZkJlTXhmRFRUWTI2cjV2Yi9wczlBSFVVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFjajhkVkQvQ3ZWVklHUDNQWC9ydEhYeTM0cTA5SWpienh4S201aWo3VnhrOWMxOVNmSGlZVzN3bjFpNVpIZFlVamtaVSs4UXNxRTQ5OEN2bE84MVRVZFVrdlRENVgySFRycDRES3FuYmRaTWJJVkI1RzNPTTlQbXgxNkFGclR5WXVGTzBxTTFyMmJwSXk5V3lNNXhXVENVa2hTZFR0TzBnZjFGV0RlcGIyc2hac01Cd0Izb0E2VFQ1b3JiQjNLQ3c2SHRUNUJMTkNITHJ0NDNONzE1cHF3OFlYcW1ld3VMS0ZRTW9KOXpFL2xYTTNXbitPTHJkNXVwd3pNTXQ1RE8wYS9oeFFCNm40aGwvZG9ZWlVtalIvd0I0WXp1eCtWY3g0ZzhvNml1R3c0WGtIOHovQUVyeis0bjhYYVpjWWkwTzhhVEcxV3RXVmx5UjF6dUZjcnF0OTRwdDdyejVySzdpdU41M004bzNFLzhBZlJ6UUI2MUplSkdjdDJxcGNUcTZzeHp5ZUs0WFROZDE2NnQ0M3ZyQjB3Mk4rNWY1RHBYU1JYVHZhamN1R0o1b0EyUEJHbkhXUEZsclpxcDI3OTduR2ZrWGtpdmVkSjAySVFqNWRxcUJnS1BsQTdmaFhsbndwUzUwZTMrM0xZcGNUNm9SQmFBc1FTZHpiczhIQUd6T2ZRY2NFMTZSNFk4V1dkd3R6QThiRDdKS3lUU3hMNWlZRGJWT2VwM0hnS0Jsc2pISm9BM0k3Rk5nWlRrZHVLOVcrR2FlWDRJc2s5REovd0NqR3J5bTMxclI1MUtKcUNCdk04c293SUlmR2R1ZnVrZ1pKeDJHZWUzckh3NWtqbDhHMmNzVWlTSS9tRU1qQmdmM2pkeFFCdVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQWNsOGRJcm1mNFc2bkRhUHNlUm9GWnVQbFF6eDd6azhENU4zSnI1ODhRYUxhYUo0RmgwL1Q0L0x0VWRBaGR5WG54L0hqcVJrbjVtNE9SakdhK29mRTJtalY5RG4wNHlMSDUyMzUyakVnWERCczdUd2VuZmo2OUs0VHhKOEp2N1cwMTdJZUlXdG8ya1dRRkxRc3pNcEdDNU1tVzR6eHdCbmpIU2dENXdnZnlpMExIanFLWmNCSkpFa2RmdzlhOXV2UDJlaE9jL3dEQ1c3VHhnLzJiL3dEYmFnLzRaemNxVmJ4cmtmOEFZSy8rMjBBZUxYMnFMekhHR0Nqc0R3UFlWekhpSzgxZVZSRlpSVFhCM2NScVMySytsNGYyZHJaUmlUeE9IR1FjRFRzYy93RGYydGl3K0Nsdlp4bFlOYmpVc0FDd3NPZi9BRVpRQjhYenY0OGdqTWsyZzNLUnNDUVNDVGpwem5uODZ4VmkxQzd1RE5kMjhpN1R6dWJwWDNMcVB3VW11b3lxK0tZNDg5LzdNeWYvQUViWE1hbCt6Q2w0MGpQNHpWV2s2a2FSL3dEYnFBUGxqVHhFSXVBRGpwbnZXaHBNYzF6Y1FRSkJKSTBrcXhoWWwzRWxqaitocjZIai9aTmlqKzc0Nkg0NlAvOEFicTI5SC9adVRUbzRSQjR4WVBCY3hYS1NEVFBtM3FDRHo1dlFqdDJQUE5BSG0rcGJiTHpyeTNrVlJhSzBkcXkvOHNtYjVBNEhZaU9MelBZc1A3MVV2aGZOTVliaFlyZGcwcmo3TkFNTis5azRqYm5BSVNNS0I2RnZldmJIK0JNRDJ0MWJueEgrN3VOK3hSWWY2dmNtekgrczVHM2o4VFJvbndKVFRiNFR4K0pnWTlqSThTNmR0REF4aE1mNnpqa0EvaGlnRHlQeHNxNlpweXh3TkpKR3JlVENZK1drUUVOTko2WmtjYlJuc09PclY5Ry9BYVlYSHduMG1ZQ0FiaExsWUJoRkltY0ZSNjR4alBmR2U5Y25yWHdTT3BhYzl2TjRtQWxaaHRsL3MvN2lCZnVnZVovZSticnpuSHZYb1h3LzBFZUdQQjFqb1F1RXVQc2FGZk5TQVJLNUxGczdBVGpyNjBBYk5GRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQi8vOWs9XCJcclxuICAgICAgICB9O1xyXG4gICAgICAgICRsb2cuaW5mbygnSW1hZ2VPYmplY3QnLCBpbWFnZU9iamVjdCwgSlNPTi5zdHJpbmdpZnkoaW1hZ2VPYmplY3QpKTtcclxuICAgICAgICAkc2NvcGUuY2xpZW50LnNlbmQoJy90b3BpYy9hdmF0YXIubmFvMS5jYW1lcmEubWFpbicsIHt9LCBKU09OLnN0cmluZ2lmeShpbWFnZU9iamVjdCkpO1xyXG4gICAgfTtcclxuICAgICRzY29wZS5sb2FkSW1hZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkc2NvcGUucmVjb2duaXplZHMgPSBbXTtcclxuICAgICAgICB2YXIgaW1hZ2VGaWxlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1hZ2VGaWxlJykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAvLyB7XCJ3ZWJraXRSZWxhdGl2ZVBhdGhcIjpcIlwiLFwibGFzdE1vZGlmaWVkXCI6MTM3MzA0MDE2ODAwMCxcImxhc3RNb2RpZmllZERhdGVcIjpcIjIwMTMtMDctMDVUMTY6MDI6NDguMDAwWlwiLFwibmFtZVwiOlwiU2F0ZSBUZWdhbCBCYWxpYnVsMy5qcGdcIixcInR5cGVcIjpcImltYWdlL2pwZWdcIixcInNpemVcIjo0MjA4Mn1cclxuICAgICAgICB2YXIgaW1hZ2VGaWxlID0gaW1hZ2VGaWxlRWwuZmlsZXNbMF07XHJcbiAgICAgICAgJGxvZy5kZWJ1ZygnUmVhZGluZy4uLicsIGltYWdlRmlsZUVsLCBpbWFnZUZpbGVFbC5maWxlcywgaW1hZ2VGaWxlLCBKU09OLnN0cmluZ2lmeShpbWFnZUZpbGUpKTtcclxuICAgICAgICAvLyBJbWFnZU9iamVjdDogbmFtZSwgY29udGVudFR5cGUsIGNvbnRlbnRVcmwsIGNvbnRlbnRTaXplLCB3aWR0aCwgaGVpZ2h0LCB1cGxvYWREYXRlLCBkYXRlQ3JlYXRlZCwgZGF0ZU1vZGlmaWVkLCBkYXRlUHVibGlzaGVkXHJcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmltYWdlT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICdAdHlwZSc6ICdJbWFnZU9iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogaW1hZ2VGaWxlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGltYWdlRmlsZS50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiBpbWFnZUZpbGUuc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRlTW9kaWZpZWQ6IGltYWdlRmlsZS5sYXN0TW9kaWZpZWREYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRVcmw6IHJlYWRlci5yZXN1bHRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAkbG9nLmluZm8oJ0ltYWdlT2JqZWN0JywgJHNjb3BlLmltYWdlT2JqZWN0LCBKU09OLnN0cmluZ2lmeSgkc2NvcGUuaW1hZ2VPYmplY3QpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWFnZUZpbGUpO1xyXG4gICAgfTtcclxuICAgICRzY29wZS5yZWNvZ25pemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkbG9nLmluZm8oJ1JlY29nbml6aW5nLi4uJywgJHNjb3BlLmltYWdlT2JqZWN0LCBKU09OLnN0cmluZ2lmeSgkc2NvcGUuaW1hZ2VPYmplY3QpKTtcclxuICAgICAgICAkc2NvcGUuY2xpZW50LnNlbmQoJy90b3BpYy9hdmF0YXIubmFvMS5jYW1lcmEubWFpbicsIHt9LCBKU09OLnN0cmluZ2lmeSgkc2NvcGUuaW1hZ2VPYmplY3QpKTtcclxuICAgIH07XHJcbn0pXHJcbi5jb250cm9sbGVyKCdGYWNlUmVjb2duaXRpb25DYW1DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRsb2csICRpbnRlcnZhbCwgTHVtZW5TdG9tcCwgU2V0dGluZ3MpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkc2NvcGUuaW1hZ2VPYmplY3QgPSBudWxsO1xyXG4gICAgJHNjb3BlLnJlY29nbml6ZWRzID0gW107XHJcbiAgICAkc2NvcGUuaHVtYW5Qb3MgPSB7eDogbnVsbCwgeTogbnVsbCwgejogbnVsbH07XHJcbiAgICAkc2NvcGUubWFya2VycyA9IHt9O1xyXG4vLyAgICB7XHJcbi8vICAgICAgICBwb3NpdGlvbjoge2ltYWdlVTogMTAsIGltYWdlVjogMTAwLCBpbWFnZVZIOiA1MH0sXHJcbi8vICAgICAgICBjc3NTdHlsZToge2xlZnQ6ICcwcHgnLCB0b3A6ICcwcHgnLCBoZWlnaHQ6ICcwcHgnfX1dO1xyXG5cclxuICAgIC8vIEF2YXRhclxyXG4gICAgJHNjb3BlLnN3aXRjaEF2YXRhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAudW5zdWJzY3JpYmVBbGwoKTtcclxuICAgICAgICBMdW1lblN0b21wLnN1YnNjcmliZSgnL3RvcGljL2x1bWVuLmFya2FuLmZhY2UucmVjb2duaXRpb24nLCBmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICAgICAgdmFyIHJlY29nbml6ZWQgPSBKU09OLnBhcnNlKG1zZy5ib2R5KTtcclxuICAgICAgICAgICAgcmVjb2duaXplZC5jc3NTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHJlY29nbml6ZWQubWluUG9pbnQueCArICdweCcsXHJcbiAgICAgICAgICAgICAgICB0b3A6IHJlY29nbml6ZWQubWluUG9pbnQueSArICdweCdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHNjb3BlLnJlY29nbml6ZWRzLnB1c2gocmVjb2duaXplZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTHVtZW5TdG9tcC5zdWJzY3JpYmUoJy90b3BpYy9sdW1lbi5hcmthbi5odW1hbi5kZXRlY3Rpb24nLCBmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICAgICAgdmFyIGh1bWFuQ2hhbmdlcyA9IEpTT04ucGFyc2UobXNnLmJvZHkpO1xyXG4gICAgICAgICAgICB2YXIgaHVtYW5UaGluZ3MgPSBodW1hbkNoYW5nZXMuaHVtYW5EZXRlY3RlZHMuY29uY2F0KGh1bWFuQ2hhbmdlcy5odW1hbk1vdmluZ3MpIGFzIEh1bWFuRGV0ZWN0ZWRbXTtcclxuICAgICAgICAgICAgXy5lYWNoKGh1bWFuVGhpbmdzLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKCdodW1hbicsIGUuaHVtYW5JZCwgJ3BvcycsIGUucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmh1bWFuUG9zID0gZS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICRzY29wZS5tYXJrZXJzW2UuaHVtYW5JZF0gPSBlO1xyXG4gICAgICAgICAgICAgICAgZS5jc3NTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoZS5pbWFnZVUtMikgKyAncHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogKGUuaW1hZ2VWIC0gZS5pbWFnZVZIKSArICdweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICc1cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogZS5pbWFnZVZIICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGxvZy5pbmZvKCdTdWJzY3JpcHRpb25zOicsIEx1bWVuU3RvbXAuZ2V0U3Vic2NyaXB0aW9ucygpKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAuY29ubmVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNsaWVudCA9IEx1bWVuU3RvbXAuZ2V0Q2xpZW50KCk7XHJcbiAgICAgICAgICAgICRzY29wZS5zd2l0Y2hBdmF0YXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVMZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEx1bWVuU3RvbXAuZGlzY29ubmVjdCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGltYWdlQ29udGVudFR5cGUgPSAnaW1hZ2UvanBlZyc7IC8vIHN0b21wLmpzIGNhbid0IGhhbmRsZSBiaWcgbWVzc2FnZXMgeWV0IDooXHJcbiAgICB2YXIgX3ZpZGVvID0gbnVsbCxcclxuICAgICAgICBwYXREYXRhID0gbnVsbCxcclxuICAgICAgICBkYXRhVXJpID0gbnVsbDtcclxuICAgICRzY29wZS5wYXRPcHRzID0ge3g6IDAsIHk6IDAsIHc6IDMyMCwgaDogMjQwfTtcclxuICAgICRzY29wZS5zdHJlYW1pbmdJbnRlcnZhbCA9IDEwMDA7XHJcbiAgICAkc2NvcGUuc3RyZWFtZXIgPSBudWxsO1xyXG5cclxuICAgICRzY29wZS5vblN0cmVhbSA9IGZ1bmN0aW9uKHN0cmVhbSkge1xyXG4gICAgICAgIC8vIFlvdSBjb3VsZCBkbyBzb21ldGhpbmcgbWFudWFsbHkgd2l0aCB0aGUgc3RyZWFtLlxyXG4gICAgICAgIF92aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWJjYW0tbGl2ZScpO1xyXG4gICAgICAgICRsb2cuZGVidWcoJ29uU3RyZWFtJywgc3RyZWFtLCBfdmlkZW8pO1xyXG4gICAgfTtcclxuICAgICRzY29wZS5vbkFjY2Vzc0RlbmllZCA9IGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICRsb2cuZXJyb3IoJ1dlYmNhbSBlcnJvcjonLCBlcnIpO1xyXG4gICAgfTtcclxuICAgICRzY29wZS5vblN0cmVhbWluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIF92aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWJjYW0tbGl2ZScpO1xyXG4gICAgICAgICRsb2cuZGVidWcoJ29uU3RyZWFtaW5nJywgX3ZpZGVvKTtcclxuICAgICAgICAvLyBUaGUgdmlkZW8gZWxlbWVudCBjb250YWlucyB0aGUgY2FwdHVyZWQgY2FtZXJhIGRhdGFcclxuLy8gICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICAgICAgJHNjb3BlLnBhdE9wdHMudyA9IF92aWRlby53aWR0aDtcclxuLy8gICAgICAgICAgICAkc2NvcGUucGF0T3B0cy5oID0gX3ZpZGVvLmhlaWdodDtcclxuLy8gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbi8qIG5vIGxvbmdlciB1c2VkXHJcbiAgICB2YXIgZ2V0VmlkZW9EYXRhID0gZnVuY3Rpb24gZ2V0VmlkZW9EYXRhKHgsIHksIHcsIGgpIHtcclxuICAgICAgICB2YXIgaGlkZGVuQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgaGlkZGVuQ2FudmFzLndpZHRoID0gJHNjb3BlLnBhdE9wdHMudztcclxuICAgICAgICBoaWRkZW5DYW52YXMuaGVpZ2h0ID0gJHNjb3BlLnBhdE9wdHMuaDtcclxuICAgICAgICB2YXIgY3R4ID0gaGlkZGVuQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShfdmlkZW8sIDAsIDAsICRzY29wZS5wYXRPcHRzLncsICRzY29wZS5wYXRPcHRzLmgpO1xyXG4gICAgICAgIHJldHVybiBjdHguZ2V0SW1hZ2VEYXRhKHgsIHksIHcsIGgpO1xyXG4gICAgfTtcclxuICAgICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNvdWxkIGJlIHVzZWQgdG8gc2VuZCB0aGUgaW1hZ2UgZGF0YVxyXG4gICAgICogdG8gYSBiYWNrZW5kIHNlcnZlciB0aGF0IGV4cGVjdHMgYmFzZTY0IGVuY29kZWQgaW1hZ2VzLlxyXG4gICAgICpcclxuICAgICAqIEluIHRoaXMgZXhhbXBsZSwgd2Ugc2ltcGx5IHN0b3JlIGl0IGluIHRoZSBzY29wZSBmb3IgZGlzcGxheS5cclxuICAgICAqL1xyXG4gICAgdmFyIHNlbmRTbmFwc2hvdFRvU2VydmVyID0gZnVuY3Rpb24gc2VuZFNuYXBzaG90VG9TZXJ2ZXIoaW1nQmFzZTY0KSB7XHJcbiAgICAgICAgJHNjb3BlLnNuYXBzaG90RGF0YSA9IGltZ0Jhc2U2NDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWtlIGEgc25hcHNob3Qgb2YgdGhlIGNhbWVyYSBkYXRhIGFuZCBzaG93IGl0IGluIGFub3RoZXIgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICAkc2NvcGUubWFrZVNuYXBzaG90ID0gZnVuY3Rpb24gbWFrZVNuYXBzaG90KCkge1xyXG4gICAgICAgIGlmIChfdmlkZW8pIHtcclxuICAgICAgICAgICAgdmFyIHBhdENhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbmFwc2hvdCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoIXBhdENhbnZhcykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgcGF0Q2FudmFzLndpZHRoID0gJHNjb3BlLnBhdE9wdHMudztcclxuICAgICAgICAgICAgcGF0Q2FudmFzLmhlaWdodCA9ICRzY29wZS5wYXRPcHRzLmg7XHJcbiAgICAgICAgICAgIHZhciBjdHhQYXQgPSBwYXRDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbi8vICAgICAgICAgICAgdmFyIGlkYXRhID0gZ2V0VmlkZW9EYXRhKCRzY29wZS5wYXRPcHRzLngsICRzY29wZS5wYXRPcHRzLnksICRzY29wZS5wYXRPcHRzLncsICRzY29wZS5wYXRPcHRzLmgpO1xyXG4vLyAgICAgICAgICAgIGN0eFBhdC5wdXRJbWFnZURhdGEoaWRhdGEsIDAsIDApO1xyXG4gICAgICAgICAgICBjdHhQYXQuZHJhd0ltYWdlKF92aWRlbywgMCwgMCwgJHNjb3BlLnBhdE9wdHMudywgJHNjb3BlLnBhdE9wdHMuaCk7XHJcbiAgICAgICAgICAgICRsb2cuaW5mbygkc2NvcGUubWFya2Vycy5sZW5ndGgsICdtYXJrZXJzJywgJHNjb3BlLm1hcmtlcnMpO1xyXG4gICAgICAgICAgICBfLmVhY2goJHNjb3BlLm1hcmtlcnMgYXMgSHVtYW5EZXRlY3RlZFtdLCBmdW5jdGlvbihlLCBrKSB7XHJcbiAgICAgICAgICAgICAgICBjdHhQYXQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHhQYXQubGluZVdpZHRoID0gODtcclxuICAgICAgICAgICAgICAgIGN0eFBhdC5zdHJva2VTdHlsZSA9ICcjMDBmZjAwJztcclxuICAgICAgICAgICAgICAgIGN0eFBhdC5tb3ZlVG8oZS5pbWFnZVUsIGUuaW1hZ2VWKTtcclxuICAgICAgICAgICAgICAgIGN0eFBhdC5saW5lVG8oZS5pbWFnZVUsIGUuaW1hZ2VWIC0gZS5pbWFnZVZIKTtcclxuICAgICAgICAgICAgICAgIGN0eFBhdC5zdHJva2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBpZGF0YSA9IGN0eFBhdC5nZXRJbWFnZURhdGEoJHNjb3BlLnBhdE9wdHMueCwgJHNjb3BlLnBhdE9wdHMueSwgJHNjb3BlLnBhdE9wdHMudywgJHNjb3BlLnBhdE9wdHMuaCk7XHJcblxyXG4gICAgICAgICAgICBzZW5kU25hcHNob3RUb1NlcnZlcihwYXRDYW52YXMudG9EYXRhVVJMKGltYWdlQ29udGVudFR5cGUpKTtcclxuXHJcbiAgICAgICAgICAgIHBhdERhdGEgPSBpZGF0YTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgJHNjb3BlLnJlY29nbml6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghJHNjb3BlLnNuYXBzaG90RGF0YSkge1xyXG4gICAgICAgICAgICBhbGVydCgnTm8gJHNjb3BlLnNuYXBzaG90RGF0YSEnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmltYWdlT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAnQHR5cGUnOiAnSW1hZ2VPYmplY3QnLFxyXG4gICAgICAgICAgICBuYW1lOiAnY2FtZXJhLmpwZycsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBpbWFnZUNvbnRlbnRUeXBlLFxyXG4gICAgICAgICAgICAvLyBUT0RPOiBjb250ZW50U2l6ZTogaW1hZ2VGaWxlLnNpemUsXHJcbiAgICAgICAgICAgIC8vIFRPRE86IGRhdGVNb2RpZmllZDogaW1hZ2VGaWxlLmxhc3RNb2RpZmllZERhdGUsXHJcbiAgICAgICAgICAgIGNvbnRlbnRVcmw6ICRzY29wZS5zbmFwc2hvdERhdGFcclxuICAgICAgICB9O1xyXG4gICAgICAgICRsb2cuaW5mbygnUmVjb2duaXppbmcuLi4nLCAkc2NvcGUuaW1hZ2VPYmplY3QsIEpTT04uc3RyaW5naWZ5KCRzY29wZS5pbWFnZU9iamVjdCkpO1xyXG4gICAgICAgICRzY29wZS5jbGllbnQuc2VuZCgnL3RvcGljL2F2YXRhci5uYW8xLmNhbWVyYS5tYWluJywge30sIEpTT04uc3RyaW5naWZ5KCRzY29wZS5pbWFnZU9iamVjdCkpO1xyXG4vLyAgICAgICAgd2luZG93LmFsZXJ0KCdTZW50OiAnICsgSlNPTi5zdHJpbmdpZnkoJHNjb3BlLmltYWdlT2JqZWN0KS5zdWJzdHIoMCwgMzAwKSk7XHJcbiAgICB9O1xyXG4gICAgJHNjb3BlLm1ha2VTbmFwc2hvdEFuZFJlY29nbml6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICRzY29wZS5tYWtlU25hcHNob3QoKTtcclxuICAgICAgICAkc2NvcGUucmVjb2duaXplKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVkaXJlY3QgdGhlIGJyb3dzZXIgdG8gdGhlIFVSTCBnaXZlbi5cclxuICAgICAqIFVzZWQgdG8gZG93bmxvYWQgdGhlIGltYWdlIGJ5IHBhc3NpbmcgYSBkYXRhVVJMIHN0cmluZ1xyXG4gICAgICovXHJcbiAgICAkc2NvcGUuZG93bmxvYWRTbmFwc2hvdCA9IGZ1bmN0aW9uIGRvd25sb2FkU25hcHNob3QoZGF0YVVSTCkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZGF0YVVSTDtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnN0YXJ0U3RyZWFtaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJHNjb3BlLnN0cmVhbWVyID0gJGludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUubWFrZVNuYXBzaG90QW5kUmVjb2duaXplKCk7XHJcbiAgICAgICAgfSwgJHNjb3BlLnN0cmVhbWluZ0ludGVydmFsKTtcclxuICAgIH07XHJcbiAgICAkc2NvcGUuc3RvcFN0cmVhbWluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICRsb2cuaW5mbygnQ2FuY2VsaW5nIHN0cmVhbWVyJyk7XHJcbiAgICAgICAgJGludGVydmFsLmNhbmNlbCgkc2NvcGUuc3RyZWFtZXIpO1xyXG4gICAgICAgICRzY29wZS5zdHJlYW1lciA9IG51bGw7XHJcbiAgICB9O1xyXG59KVxyXG5cclxuO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
