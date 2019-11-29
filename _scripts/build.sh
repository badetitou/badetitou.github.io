#!/bin/bash

# enable error reporting to the console
set -e

PATH="${TRAVIS_BUILD_DIR}/bin:$PATH"

gem install bundler
rvm "$TRAVIS_RUBY_VERSION" do bundle install
echo "INSTALL DONE"
rvm "$TRAVIS_RUBY_VERSION" do bundle exec jekyll build
echo "BUILD DONE"

# Checkout `master` and remove everything.
git clone https://${GH_TOKEN}@github.com/badetitou/badetitou.github.io.git ../badetitou.github.io.master
cd ../badetitou.github.io.master
git checkout master
rm -rf *

# Copy generated HTML site from source branch in original repository.
# Now the `master` branch will contain only the contents of the _site directory.
cp -R ../badetitou.github.io/_site/* .

# Make sure we have the updated .travis.yml file so tests won't run on master.
cp ../badetitou.github.io/.travis.yml .
git config user.email ${GH_EMAIL}
git config user.name "badetitou-bot"

# Commit and push generated content to `master` branch.
git status
git add -A .
git status
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER"
git push --quiet origin master > /dev/null 2>&1
