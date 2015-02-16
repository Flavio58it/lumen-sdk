---
layout: page
title: Avatar
permalink: /protocol/avatar/
---

Avatar channels

## Current Implementation

### avatar.NAO.data.image

{% highlight json %}
{
  "name": "166",
  "contentType": "image/jpeg",
  "contentSize": 20227,
  "uploadDate": "16/02/2015 0:00:00",
  "dateCreated": "16/02/2015 0:00:00",
  "dateModified": "16/02/2015 0:00:00",
  "datePublished": "16/02/2015 0:00:00",
  "contentUrl": "data:image/jpeg;base64,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"
}
{% endhighlight %}

### avatar.NAO.data.joint

{% highlight json %}
{
  "name": [
    "HeadYaw",
    "HeadPitch",
    "LShoulderPitch",
    "LShoulderRoll",
    "LElbowYaw",
    "LElbowRoll",
    "LWristYaw",
    "LHand",
    "LHipYawPitch",
    "LHipRoll",
    "LHipPitch ",
    "LKneePitch",
    "LAngklePitch",
    "LAngkleRoll",
    "RHipYawPitch",
    "RHipRoll",
    "RHipPitch",
    "RKneePitch",
    "RAngklePitch",
    "RAngkleRoll",
    "RShoulderPitch",
    "RShoulderRoll",
    "RElbowYaw",
    "RElbowRoll",
    "RWristYaw",
    "RHand"
  ],
  "angle": [
    0.06285204,
    0.514872134,
    2.08566856,
    0.170232043,
    -1.446604,
    -1.00933,
    0.257670045,
    0.1412,
    -0.7822981,
    0.171849966,
    -1.58458006,
    0.748550057,
    0.922581,
    -0.03370604,
    -0.7822981,
    -0.173300043,
    -1.187358,
    -0.05825004,
    0.848343968,
    0.0475959629,
    1.55245,
    0.25306803,
    0.901950061,
    1.287068,
    0.427944064,
    0.162
  ],
  "stiffness": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]
}
{% endhighlight %}

### avatar.NAO.data.sonar

{% highlight json %}
{
  "rightSensor": 0.24,
  "leftSensor": 0.47
}
{% endhighlight %}

### avatar.NAO.data.tactile

{% highlight json %}
{
  "name": [
    "RightBumper",
    "LeftBumper",
    "ChestButton",
    "FrontTactil",
    "MiddleTactil",
    "RearTactil",
    "HandRightBack",
    "HandRightLeft",
    "HandRightRight",
    "HandLeftBack",
    "HandLeftLeft",
    "HandLeftRight"
  ],
  "value": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]
}
{% endhighlight %}

### avatar.NAO.data.battery

{% highlight json %}
{
  "percentage": 100,
  "isPlugged": false,
  "isCharging": false
}
{% endhighlight %}

## Proposed

### /topic/lumen.AGENT_ID.motion

#### Wake up

{% highlight json %}
{
  "@type": "WakeUp"
}
{% endhighlight %}

#### Rest

{% highlight json %}
{
  "@type": "Rest"
}
{% endhighlight %}

#### Joints

Can get or set stiffness, angle.

Get stiffness:

{% highlight json %}
{
  "@type": "GetJointStiffness",
  "joint": {
    "@type": "Joint",
    "name": "<jointName>"
  }
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "Joint",
  "name": "<jointName>",
  "stiffness": <float>
}
{% endhighlight %}

Set stiffness: (`replyTo` is optional)

{% highlight json %}
{
  "@type": "SetJointStiffness",
  "joint": {
    "@type": "Joint",
    "name": "<jointName>",
    "stiffness": <float>
  },
  "speed": <float>
}
{% endhighlight %}

If reply requested:

{% highlight json %}
{
  "@type": "Joint",
  "name": "<jointName>"
}
{% endhighlight %}

Get angle:

{% highlight json %}
{
  "@type": "GetJointAngle",
  "joint": {
    "@type": "Joint",
    "name": "<jointName>"
  }
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "Joint",
  "name": "<jointName>",
  "angle": <float>
}
{% endhighlight %}

Set angle: (`replyTo` is optional)

{% highlight json %}
{
  "@type": "SetJointAngle",
  "joint": {
    "@type": "Joint",
    "name": "<jointName>",
    "angle": <float>
  },
  "speed": <float>
}
{% endhighlight %}

If reply requested:

{% highlight json %}
{
  "@type": "Joint",
  "name": "<jointName>"
}
{% endhighlight %}

#### Hand

Close and open hand: (TODO: should we use e.g. `SetHandState` instead?)

{% highlight json %}
{
  "@type": "CloseHand",
  "hand": {
    "@type": "Hand",
    "name": "<handName>"
  },
}
{% endhighlight %}

{% highlight json %}
{
  "@type": "OpenHand",
  "hand": {
    "@type": "Hand",
    "name": "<handName>"
  }
}
{% endhighlight %}

### Move init (TODO: ???)

{% highlight json %}
{
  "@type": "MoveInit"
}
{% endhighlight %}

### Move to

{% highlight json %}
{
  "@type": "MoveTo",
  "x": <float>,
  "y": <float>,
  "theta": <float>
}
{% endhighlight %}

### Set walk arms enabled

{% highlight json %}
{
  "@type": "SetWalkArmsEnabled",
  "leftHand": <boolean>,
  "rightHand": <boolean>
}
{% endhighlight %}

#### Stop move

{% highlight json %}
{
  "@type": "StopMove"
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.posture

#### Go to posture:

{% highlight json %}
{
  "@type": "GoToPosture",
  "name": "<postureName>",
  "speed": <float>
}
{% endhighlight %}

#### Stop move:

{% highlight json %}
{
  "@type": "StopMove"
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.camera

Get image remote: (one-off)

{% highlight json %}
{
  "@type": "GetImageRemote"
}
{% endhighlight %}

Stream image remote, sent to the reply-to (usually `/temp-queue/something`) until the destination is gone.

{% highlight json %}
{
  "@type": "StreamImageRemote",
  "enabled": <boolean>
}
{% endhighlight %}

Reply: (see [Data URI](http://en.wikipedia.org/wiki/Data_URI_scheme))

{% highlight json %}
{
  "@type": "ImageObject",
  "contentUrl": "<base64-encoded data URI>",
  "contentType": "image/jpeg"
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.camera.stream

Image streamed from camera:

{% highlight json %}
{
    "@type": "ImageObject",
    "name": "wajah1_240p.jpg",
    "contentType": "image/jpeg",
    "contentSize": 4880,
    "dateModified": "2015-01-09T08:05:37.000Z",
    "contentUrl": "data:image/jpeg;base64,/9j/4AAQ..."
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.speech.synthesis

Say text:

{% highlight json %}
{
  "@type": "Say",
  "message": "<message>"
}
{% endhighlight %}

Set language:

{% highlight json %}
{
  "@type": "SetLanguage",
  "language": "<language tag>"
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.speech.recognition

TODO

### /topic/lumen.AGENT_ID.battery

Get battery percentage:

{% highlight json %}
{
  "@type": "GetBatteryStatus"
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "BatteryStatus",
  "levelPercentage": <float>
}
{% endhighlight %}

Get is plugged:

{% highlight json %}
{
  "@type": "GetPluggedStatus"
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "BatteryStatus",
  "plugged": "AC | USB | ..."
}
{% endhighlight %}

Get is charging:

{% highlight json %}
{
  "@type": "GetChargingStatus"
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "BatteryStatus",
  "charging": "AC | USB | ..."
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.sensors

Get tactile:

{% highlight json %}
{
  "@type": "GetTactile",
  "tactileName": "<tactileName>"
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "Tactile",
  "tactile": <float>
}
{% endhighlight %}

Get bumper:

{% highlight json %}
{
  "@type": "GetBumper",
  "bumperName": "<bumperName>"
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "Bumper",
  "bumper": <float>
}
{% endhighlight %}

Get button:

{% highlight json %}
{
  "@type": "GetButton",
  "buttonName": "<buttonName>"
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "Tactile",
  "tactile": <float>
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.sonar

Get distance:

{% highlight json %}
{
  "@type": "GetSonarDistance",
  "sensorName": "<sensorName>"
}
{% endhighlight %}

Reply:

{% highlight json %}
{
  "@type": "SonarDistance",
  "distance": <float>
}
{% endhighlight %}
