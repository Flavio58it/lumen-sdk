---
layout: page
title: Lumen Protocol
permalink: /protocol/
---

**Lumen High-level Protocol** uses [JSON-LD](http://json-ld.org/) format using the following transports:

1. [STOMP 1.2](https://stomp.github.io/stomp-specification-1.2.html) and [Stomp.js](https://github.com/jmesnil/stomp-websocket)
2. HTTP (TODO)

The broker uses [RabbitMQ](http://www.rabbitmq.com/), which supports all of [STOMP](https://www.rabbitmq.com/stomp.html),
[Web-Stomp](http://www.rabbitmq.com/web-stomp.html), [AMQP](http://www.amqp.org/), and [MQTT](https://www.rabbitmq.com/mqtt.html) protocols.
So a node is flexible to choose.

This document describes the Lumen High-level Protocol (based on [Lumen Server dan API versi 2.0 Release](http://ta141501040.blog.lskk.ee.itb.ac.id/2014/12/29/lumen-server-dan-api-versi-2-0-release/)) using STOMP convention.
Following [Linked Data](http://linkeddata.org/) approach, each message structure is a [Class](http://en.wikipedia.org/wiki/RDF_Schema#Classes).

The protocol is implemented by corresponding SDKs in the following languages:

* [C# (.NET)](/dotnet/)
* [AngularJS/JavaScript](/javascript/)
* [Java (JVM)](/java/)

A [Mobile App](/app/) is also provided to control Lumen robot using web browser or Android mobile device.

Each Lumen robot "instance" is assigned an ID which is used as the topic's routing key prefix,
e.g. for `lumen1`, the available topics are:

1. `/topic/lumen1.motion`
2. `/topic/lumen1.camera`
3. `/topic/lumen1.sonar`
4. etc.

## .motion

Wake up

{% highlight json %}
{
  "@type": "WakeUp"
}
{% endhighlight %}

Rest

{% highlight json %}
{
  "@type": "Rest"
}
{% endhighlight %}

Joints:

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

Move init (TODO: ???)

{% highlight json %}
{
  "@type": "MoveInit"
}
{% endhighlight %}

Move to:

{% highlight json %}
{
  "@type": "MoveTo",
  "x": <float>,
  "y": <float>,
  "theta": <float>
}
{% endhighlight %}

Set walk arms enabled:

{% highlight json %}
{
  "@type": "SetWalkArmsEnabled",
  "leftHand": <boolean>,
  "rightHand": <boolean>
}
{% endhighlight %}

Stop move:

{% highlight json %}
{
  "@type": "StopMove"
}
{% endhighlight %}

## .posture

Go to posture:

{% highlight json %}
{
  "@type": "GoToPosture",
  "name": "<postureName>",
  "speed": <float>
}
{% endhighlight %}

Stop move:

{% highlight json %}
{
  "@type": "StopMove"
}
{% endhighlight %}

## .camera

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

## .speech.synthesis

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

## .speech.recognition

TODO

## .battery

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

## .sensors

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

## .sonar

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
