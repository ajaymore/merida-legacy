FROM node:8.9.4

WORKDIR /usr/app

RUN mkdir -p src

COPY package*.json ./

RUN npm install --only=production

COPY src ./src