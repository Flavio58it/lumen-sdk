## Setup

1. Install [NodeJS](http://nodejs.org/download/).

    **Windows:** Download and install [NodeJS](http://nodejs.org/download/).
    Post-installation: set [NPM proxy settings](http://jjasonclark.com/how-to-setup-node-behind-web-proxy)
    as follows. Run command prompt as Administrator. From your user home directory:

        npm -V -g install ionic # after progress shows up, press Ctrl+C then continue below
        npm -g config set proxy http://username:password@cache.itb.ac.id:8080
        npm -g config set https-proxy http://username:password@cache.itb.ac.id:8080

    **Linux:**

        sudo add-apt-repository 'deb https://deb.nodesource.com/node trusty main'
        # Cannot work on ITB Proxy, so just ignore
        #sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 68576280
        sudo aptitude update
        sudo aptitude install nodejs
        npm config set proxy http://username:password@cache.itb.ac.id:8080
        npm config set https-proxy http://username:password@cache.itb.ac.id:8080

2. Install [Ionic](http://ionicframework.com/) and [Bower](http://bower.io/).

    **Windows:** Run _Node.js command prompt_ as Administrator:

        npm -V -g install ionic bower

    Note: If you don't install NodeJS modules globally (i.e. user-specific), you'll need to add `~/node_modules/.bin` to `PATH`.

    **Linux:**

        sudo npm -V -g install ionic bower

3. (If you want to deploy to Android/iOS/Windows Phone) Install Cordova: `npm -g install cordova`

4. Lumen mobile client needs RabbitMQ to communicate over Stomp-WebSockets.

    **Windows:** Install [Erlang OTP](http://www.erlang.org/download.html) and [RabbitMQ for Windows](https://www.rabbitmq.com/install-windows.html)

    **Linux:**

        sudo aptitude install rabbitmq-server

5. Install [RabbitMQ Web-Stomp Plugin](http://www.rabbitmq.com/web-stomp.html):

    **Windows:** Run _RabbitMQ command prompt_ as Normal User:

        rabbitmq-plugins enable rabbitmq_web_stomp

    **Linux:**

        sudo rabbitmq-plugins enable rabbitmq_web_stomp
        sudo service rabbitmq-server restart

## Serve the App

**Windows:** Use _Node.js command prompt_, to `mobile` directory, and run: `ionic serve`, e.g.

    # go to directory git/lumen-sdk/mobile
    cd git\lumen-sdk\mobile
    ionic serve

**Linux:** Use command prompt, to `mobile` directory, and run: `ionic serve`, e.g.

    # go to directory git/lumen-sdk/mobile
    cd git/lumen-sdk/mobile
    ionic serve
