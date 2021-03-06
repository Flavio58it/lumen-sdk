## Setup

1. Install [NodeJS](http://nodejs.org/download/).

    **Windows:** Download and install [NodeJS](http://nodejs.org/download/).

    Post-installation: set [NPM proxy settings](http://jjasonclark.com/how-to-setup-node-behind-web-proxy) as follows.
    (**Important:** change with your own username and password below)

    Run **Node.js Command Prompt**, then:

        npm config set proxy http://username:password@cache.itb.ac.id:8080/
        npm config set https-proxy http://username:password@cache.itb.ac.id:8080/

    **Linux:**

        sudo add-apt-repository 'deb https://deb.nodesource.com/node trusty main'
        # Cannot work on ITB Proxy, so just ignore
        #sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 68576280
        sudo aptitude update
        sudo aptitude install nodejs
        npm config set proxy http://username:password@cache.itb.ac.id:8080/
        npm config set https-proxy http://username:password@cache.itb.ac.id:8080/

2. Install Ionic if you want to know more about `Ionic` click here (http://ionicframework.com/).

    How to install Ionic and Bower :
    
    **Windows:** Run _Node.js command prompt_:

        npm -V -g install ionic gulp

    Note: If you don't install NodeJS modules globally (i.e. user-specific), you'll need to add `~/node_modules/.bin` to `PATH`.

    **Linux:**

        sudo npm -V -g install ionic gulp

3. (If you want to deploy to Android/iOS/Windows Phone) Install Cordova: `npm -V -g install cordova`

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

6. Install TypeScript, gulp, gulp-tsc, gulp-minify-css, gulp-concat, by typing :

        cd git\lumen-sdk\mobile
        npm install -V

## Optional

1. You will want [typings](https://www.npmjs.com/package/typings) package,
   then install the used typings so you can use it in supported TypeScript IDE
   such as [Visual Studio Code](https://code.visualstudio.com/).

        npm install -V -g typings
        typings install

## Serve the App from localhost

1. run Ionic serve 

    **Windows:** Use _Node.js command prompt_, to `mobile` directory, and run: `ionic serve`, e.g.
    
        ; go to directory git/lumen-sdk/mobile
        cd git\lumen-sdk\mobile
        ionic serve -a
    
    **Linux:** Use command prompt, to `mobile` directory, and run: `ionic serve`, e.g.
    
        # go to directory git/lumen-sdk/mobile
        cd git/lumen-sdk/mobile
        ionic serve -a
        
2. open browser http://localhost:8100/

## Serve the app from LSKK server

1. open browser http://167.205.66.35:8100/

2. klik setting "use localhost", save