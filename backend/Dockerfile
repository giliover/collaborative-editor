FROM node:current

ENV APP_PATH /collaborative-editor-backend

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY package.json ./

RUN apt update && \
apt install -y git curl gnupg build-essential python3 && \
npm install -g npm@latest

EXPOSE 5000
