FROM node:current-alpine

ENV APP_PATH /collaborative-editor

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY package.json ./

RUN apk update && \
apk add git && \
npm install -g npm@latest

EXPOSE 3000
