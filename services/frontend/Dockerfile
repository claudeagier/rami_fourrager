# base image
FROM node:14.21.0-alpine3.16

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# g++ compiler for fibers and sass
# RUN apk add python make g++

# install app dependencies
COPY ./ui/package.json /app/package.json
# COPY ./ui/package-lock.json /app/package-lock.json
RUN npm install

# copy files
COPY ./ui /app

CMD npm run serve
