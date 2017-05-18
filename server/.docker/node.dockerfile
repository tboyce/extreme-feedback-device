FROM node:alpine

MAINTAINER Tim Boyce

WORKDIR /var/www/xfd

COPY / /var/www/xfd

RUN npm install nodemon@1.11.0 -g

EXPOSE 3000

ENTRYPOINT ["nodemon", "server.js"]
