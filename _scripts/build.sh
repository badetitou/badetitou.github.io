#!/bin/bash

# enable error reporting to the console
set -e

# cleanup "_site"
rm -rf _site
mkdir _site

# clone remote repo to "_site"
git clone https://${GH_TOKEN}@github.com/badetitou/badetitou.github.io.git ../badetitou.github.io.master

# build with Jekyll into "_site"
bundle exec jekyll build

# push
cd _site
git config user.email ${GH_EMAIL}
git config user.name "badetitou-bot"
git add --all
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER"
git push --force origin `master`
