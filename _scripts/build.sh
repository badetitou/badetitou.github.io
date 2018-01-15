# Keep Travis from testing `master` branch
branches:
  except:
  - master

# Deployment config
deploy:
  provider: script
  script: "./_scripts/build.sh"
  skip_cleanup: true
  on:
    branch: source
