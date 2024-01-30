# base image
FROM node:14.21.0-alpine3.16

ARG NODE_ENV
# set working directory
# WORKDIR /app
WORKDIR /node
RUN chown node:node /node
USER node

# add `/app/node_modules/.bin` to $PATH
ENV PATH /node/node_modules/.bin:$PATH

# install app dependencies
COPY ./ui/package.json /node/package.json
# COPY ./ui/package-lock.json /app/package-lock.json
RUN npm install

# copy files
COPY ./ui /node

#for dev
RUN echo $NODE_ENV
CMD npm run "$(if [ $NODE_ENV = 'production' ] ; then echo 'serve' ; else echo 'dev'; fi)"

# CMD npm run dev 
# CMD npm run serve
