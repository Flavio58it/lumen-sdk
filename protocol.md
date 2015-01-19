---
layout: page
title: Lumen Protocol
permalink: /protocol/
---

**Lumen High-level Protocol** uses [JSON-LD](http://json-ld.org/) format using the following transports:

1. [STOMP 1.2](https://stomp.github.io/stomp-specification-1.2.html) and [Stomp.js](https://github.com/jmesnil/stomp-websocket)
2. HTTP (TODO)

## Goals

1. Easy to implement in popular programming languages (C#, Java, JavaScript)
2. Flexible (relatively future-proof)

## Lumen Protocol in General

The broker uses [RabbitMQ](http://www.rabbitmq.com/), which supports all of [STOMP](https://www.rabbitmq.com/stomp.html),
[Web-Stomp](http://www.rabbitmq.com/web-stomp.html), [AMQP](http://www.amqp.org/), and [MQTT](https://www.rabbitmq.com/mqtt.html) protocols.
So a node is flexible to choose.

This document describes the Lumen High-level Protocol (based on [Lumen Server dan API versi 2.0 Release](http://ta141501040.blog.lskk.ee.itb.ac.id/2014/12/29/lumen-server-dan-api-versi-2-0-release/)) using STOMP convention.
Following [Linked Data](http://linkeddata.org/) approach, each message structure is a [Class](http://en.wikipedia.org/wiki/RDF_Schema#Classes).

The protocol is implemented by corresponding SDKs in the following languages:

* [C# (.NET)](/lumen-sdk/dotnet/)
* [AngularJS/JavaScript](/lumen-sdk/javascript/)
* [Java (JVM)](/lumen-sdk/java/)

A [Mobile App](/lumen-sdk/app/) is also provided to control Lumen robot using web browser or Android mobile device.

## Messaging Channels and Structures

Each Lumen robot "instance" is assigned an ID which is used as the topic/queue's routing key prefix,
e.g. for `arkan`, the available (Stomp) topics and queues are:

1. `/topic/lumen.arkan.motion`
2. `/topic/lumen.arkan.camera`
3. `/topic/lumen.arkan.sonar`
4. `/topic/lumen.arkan.social.expression`
5. etc.

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

### /topic/lumen.AGENT_ID.social.perception

Observed a social post ([schema:CreativeWork](http://schema.org/CreativeWork)), e.g. Facebook friend's status post, Facebook Group post, news feed, etc.

{% highlight json %}
{
  "@type": "StatusUpdate",
  "from": {
    "@type": "Person",
    "name": "Ahmad Syarif"
  },
  "message": "I love this weather",
  "channel": {
    "@type": "SocialChannel",
    "network": "Facebook"
  },
}
{% endhighlight %}

{% highlight json %}
{
  "@type" : "StatusUpdate",
  "from" : {
    "@type" : "Person",
    "name" : "Marzuki Syahfirin",
    "url" : "https://www.facebook.com/10203536415231264",
    "photo" : {
      "@type" : "ImageObject",
      "url" : "https://graph.facebook.com/10203536415231264/picture"
    },
    "id" : "10203536415231264"
  },
  "message" : "Marzuki Syahfirin likes a post.",
  "channel" : {
    "@type" : "SocialChannel",
    "name" : "Facebook",
    "id" : "facebook"
  },
  "dateCreated" : "2015-01-19T01:07:44.000Z",
  "datePublished" : "2015-01-19T01:07:44.000Z",
  "dateModified" : "2015-01-19T01:07:44.000Z",
  "url" : "https://www.facebook.com/10203536415231264_425825740901928",
  "id" : "10203536415231264_425825740901928"
}
{% endhighlight %}

Receive a group mention, e.g. Facebook wall post, mentioned in a post, or mentioned in a comment.

Facebook wall post or mentioned in a post:

{% highlight json %}
{
  "@type": "Mention",
  "from": {
    "@type": "Person",
    "name": "Ahmad Syarif"
  },
  "message": "Hi arkan",
  "channel": {
    "@type": "SocialChannel",
    "network": "Facebook"
  },
  "post": {
    "@type": "StatusUpdate",
    "id": "105394384_3953824"
  }
}
{% endhighlight %}

Mentioned in a Facebook comment:

{% highlight json %}
{
  "@type": "Mention",
  "from": {
    "@type": "Person",
    "name": "Ahmad Syarif"
  },
  "message": "Where are you",
  "channel": {
    "@type": "SocialChannel",
    "network": "Facebook"
  },
  "post": {
    "@type": "StatusUpdate",
    "id": "105394384_3953824"
  },
  "comment": {
    "@type": "Comment",
    "id": "549283_927392"
  }
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.social.expression

Publishes a status update to Facebook:

{% highlight json %}
{
  "@type": "StatusUpdate",
  "message": "I am so happy today",
  "channel": {
    "@type": "SocialChannel",
    "network": "Facebook"
  }
}
{% endhighlight %}

Comments on a post:

{% highlight json %}
{
  "@type": "Comment",
  "message": "What are you doing?",
  "channel": {
    "@type": "SocialChannel",
    "network": "Facebook"
  },
  "post": {
    "@type": "StatusUpdate",
    "id": "105394384_3953824"
  }
}
{% endhighlight %}

Comments on a post with mention:

{% highlight json %}
{
  "@type": "Comment",
  "message": "Let's eat",
  "channel": {
    "@type": "SocialChannel",
    "network": "Facebook"
  },
  "post": {
    "@type": "StatusUpdate",
    "id": "105394384_3953824"
  },
  "mentionedPerson": [
    {
      "@type": "Person",
      "name": "Ahmad Syarif"
    },  
    {
      "@type": "Person",
      "name": "Marzuki"
    }
  ]
}
{% endhighlight %}

Publishes a post to Facebook Group:

{% highlight json %}
{
  "@type": "BlogPosting",
  "message": "What are you guys planning today?",
  "channel": {
    "@type": "SocialChannel",
    "network": "Facebook"
  },
  "group": {
    "@type": "SocialGroup",
    "name": "OpenCog/Lumen ITB",
    "id": "329799720504531"
  }
}
{% endhighlight %}

### /topic/lumen.AGENT_ID.face.recognition

A human face is recognized:

{% highlight json %}
{
    "@type": "HumanFaceRecognized",
    "name": "Marzuki",
    "minPoint": {
        "@type": "Vector3",
        "x": 178.0,
        "y": 53.0,
        "z": 0.0
    },
    "maxPoint": {
        "@type": "Vector3",
        "x": 310.0,
        "y": 89.0,
        "z": 0.0
    },
    "truthValue": {
        "@type": "SimpleTruthValue",
        "strength": 1.0,
        "confidence": 1.0
    }
}
{% endhighlight %}

The recognition [truth value](http://en.wikipedia.org/wiki/Truth_value) intentionally mimics [OpenCog's TruthValue](http://wiki.opencog.org/w/TruthValue)
to improve interoperability.

### /topic/lumen.AGENT_ID.human.recognition

TODO

### /topic/lumen.AGENT_ID.action.recognition

TODO