# Lumen SDK

Lumen Social Robot API, AngularJS SDK, and Client

## Jekyll - Local Setup

    git clone https://github.com/lumenrobot/lumen-sdk.git
    cd lumen-sdk
    git checkout gh-pages

Install Ruby first, and `zlib1g-dev`, `libxml2-dev` (required by `nokogiri` gem).

    sudo aptitude install ruby-dev zlib1g-dev libxml2-dev
    sudo gem install -V bundler # for Windows, omit 'sudo'
    bundle install -V

Launch Jekyll development server by running:

    bundle exec jekyll serve --baseurl ''
