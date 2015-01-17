## Setup

1. Install [NodeJS](http://nodejs.org/download/).
   If needed, set [NPM proxy settings](http://jjasonclark.com/how-to-setup-node-behind-web-proxy).
2. Install [Ionic](http://ionicframework.com/) and [Bower](http://bower.io/): (you'll need to run command prompt as Administrator)

       npm -g install ionic bower

   Note: If you don't install NodeJS modules globally (i.e. user-specific), you'll need to add `~/node_modules/.bin` to `PATH`.
3. (If you want to deploy to Android) Install Cordova: `npm -g install cordova`
4. Lumen mobile client needs RabbitMQ to communicate over Stomp-WebSockets.
   Windows: Install [Erlang OTP](http://www.erlang.org/download.html) and [RabbitMQ for Windows](https://www.rabbitmq.com/install-windows.html)
5. Install [RabbitMQ Web-Stomp Plugin](http://www.rabbitmq.com/web-stomp.html):

       rabbitmq-plugins enable rabbitmq_web_stomp

## Serve the App

Use command prompt nad run:

   `ionic serve`