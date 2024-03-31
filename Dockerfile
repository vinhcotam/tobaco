# Build:
# docker build -t meanjs/mean .
#
# Run:
# docker run -it meanjs/mean
#
# Compose:
# docker-compose up -d

FROM ubuntu:latest
#RUN addgroup mean && adduser -S -G mean mean

#USER root
USER 0

RUN mkdir -p /var/www/meanjs-docker

USER $CONTAINER_USER_ID

MAINTAINER MEAN.JS

# 80 = HTTP, 443 = HTTPS, 3000 = MEAN.JS server, 35729 = livereload, 8080 = node-inspector
EXPOSE 80 443 3000 35729 8080

# Set development environment as default
ENV NODE_ENV development

# Install Utilities
RUN apt-get update -q  \
 && apt-get install -yqq \
 curl \
 git \
 ssh \
 gcc \
 make \
 build-essential \
 libkrb5-dev \
 sudo \
 apt-utils \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install MEAN.JS Prerequisites
#RUN npm install --quiet -g npm@latest

RUN npm install --quiet -g  gulp bower yo mocha karma-cli 

RUN sudo npm install -g pm2

RUN npm cache clean --force

#RUN mkdir -p /var/www/meanjs-docker

RUN mkdir -p /var/www/meanjs-docker/public

RUN mkdir -p /var/www/meanjs-docker/public/lib

WORKDIR /var/www/meanjs-docker

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the lccal package.json file changes.
# Install npm packages
COPY package.json /var/www/meanjs-docker/package.json
COPY bower.json /var/www/meanjs-docker/bower.json
COPY .bowerrc /var/www/meanjs-docker/.bowerrc

RUN npm install -g snyk

#RUN npm install --force --package-lock-only
#RUN npm install 

#RUN npm cache clean --force

#RUN npm install --quiet && npm cache clean
#RUN npm cache clean --force

RUN npm install --quiet 

RUN npm cache clean --force

# Install bower packages
COPY bower.json /var/www/meanjs-docker/bower.json
COPY .bowerrc /var/www/meanjs-docker/.bowerrc
RUN bower install --quiet --allow-root --config.interactive=false

COPY . /var/www/meanjs-docker

# Run MEAN.JS server
CMD npm install && npm start
