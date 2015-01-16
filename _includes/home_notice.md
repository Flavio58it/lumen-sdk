The [Lumen Social Robot](http://lumen.lssk.ee.itb.ac.id/) is an ongoing research project of [LSKK (Control System and Computers Laboratory)](http://lskk.ee.itb.ac.id/) of [STEI (School of Electrical and Informatics)](http://ee.itb.ac.id/), [ITB (Bandung Institute of Technology Bandung, located in Indonesia)](http://www.itb.ac.id/). The SDK (Software Development Kit) comprises the shared technical documentation and tools for Lumen researchers.

You don’t need to know programming, although the SDK provides mainly modules for use for professional programming. Most parts of the SDK require basic understanding of how [TCP/IP computer networks](http://en.wikipedia.org/wiki/Internet_protocol_suite), [message queues](http://en.wikipedia.org/wiki/Message_queue), and [JSON](http://en.wikipedia.org/wiki/JSON) works.

The SDK consists of two main parts:

1. [**Lumen Protocol**](protocol/), which specifies how Lumen modules coordinate with each other
2. [**Programs and libraries**](https://github.com/lumenitb/lumen-sdk), to interact with Lumen modules that adheres to Lumen Protocol

Important to note that the SDK does *not* include the implementation modules themselves, these are individual research projects which may opt to adhere to Lumen Protocol, and in turn usable by Lumen SDK.

(Suggestion) If you are not familiar with programming, but want to get a “deeper” feeling about how Lumen is controlled, you can use the low-level command-line tools.

For programmers, there are several modules and examples for [Java](java/), [C#](dotnet/), [AngularJS/JavaScript](javascript/), and [Mobile App](app/).

To find more about Lumen in general, see [Lumen Research Project](http://lumen.lskk.ee.itb.ac.id/).
