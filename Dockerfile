FROM mhart/alpine-node:latest

ENV APP_PATH /identity
RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH
ADD . $APP_PATH

RUN apk add -U --no-cache \
      alpine-sdk \
      bash \
      git \
      python \
      make \
      g++ \
    && npm install

Run apk del --purge \
     alpine-sdk \
     git \
     make \
     g++

EXPOSE 3001

CMD ["npm", "run", "start"]
# CMD ["tail", "-f", "/dev/null"]
