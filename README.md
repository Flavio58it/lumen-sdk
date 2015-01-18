Lumen Social Robot SDK
======================

The [Lumen Social Robot](http://lumen.lssk.ee.itb.ac.id/) is an ongoing research project of [LSKK](http://lskk.ee.itb.ac.id/)
(Control System and Computers Laboratory) of [STEI](http://ee.itb.ac.id/) (School of Electrical and Informatics),
[ITB ](http://www.itb.ac.id/) (Bandung Institute of Technology Bandung, located in Indonesia).

This SDK (Software Development Kit) comprises the shared technical documentation and tools for Lumen researchers (and
any interested party). The SDK consists of two main parts:

1. [**Lumen Protocol**](http://lumenitb.github.io/lumen-sdk/protocol/), which specifies how Lumen modules coordinate with each other
2. libraries which implement the Lumen Protocol for a specific platform.
3. Sample applications and programs which use the libraries.

Important: The SDK is a work in progress. If you want to provide an implementation (java, C#, AngularJS/JavaScript) or
anything of your choice (e.g. a research project of yours), please contact a project member.

Contributions from non-academic people are welcome, too.

Further Information
===================

**What is the difference between the original NAO Robot and Lumen?**

NAO doesn't contain any "functional" modules, only low-level primitives like walking and how to access hardware, that
you must access programmatically. Lumen provides software to make the robot usable for specific human interactions.

To illustrate:

NAO  : walk forward 3.5 meters facing 135 degrees, rotate joint 13 to (angle, speed), close arm, rotate joint 12 to (angle, speed)
Lumen: "pick that blue book"

**Where can if find more information about the NAO Robot (that Lumen is based on)?**

https://www.aldebaran.com/en/humanoid-robot/nao-robot

Example location for purchase

http://www.active-robots.com/aldebaran-robotics-nao-evol-humanoid-robot

**Quite expensive. Can I use a simulator to work on Lumen?

Currently, there is not ready simulator available (you can "handcraft" one however). If you find or produce a solution
to simulate NAO/Lumen, please inform us.
