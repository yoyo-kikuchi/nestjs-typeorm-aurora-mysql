FROM node:16.14.0-alpine AS builder

WORKDIR /build

COPY ./app ./
RUN yarn install \
    && yarn build

FROM node:16.14.0-alpine

RUN apk --no-cache add tzdata tini


# System
ARG NODE_ENV=production
ARG WRITE_DB_HOST
ARG WRITE_DB_USER
ARG WRITE_DB_PASSWORD
ARG WRITE_DB_PORT=3306
ARG READ_DB_HOST
ARG READ_DB_USER
ARG READ_DB_PASSWORD
ARG READ_DB_PORT=3306
ARG DB_SCHEMA
ARG DB_DEBUG=info

ENV TZ=Asia/Tokyo\
    NODE_ENV=$NODE_ENV \
    WRITE_DB_HOST=$WRITE_DB_HOST \
    WRITE_DB_USER=$WRITE_DB_USER \
    WRITE_DB_PASSWORD=$WRITE_DB_PASSWORD \
    WRITE_DB_PORT=$WRITE_DB_PORT \
    READ_DB_HOST=$READ_DB_HOST \
    READ_DB_USER=$READ_DB_USER \
    READ_DB_PASSWORD=$READ_DB_PASSWORD \
    READ_DB_PORT=$READ_DB_PORT \
    DB_SCHEMA=$DB_SCHEMA \
    DB_DEBUG=$DB_DEBUG

WORKDIR /app
COPY --from=builder /build/dist ./dist
COPY ./app/package.json ./app/yarn.lock ./

RUN yarn install

EXPOSE $LISTEN_PORT
ENTRYPOINT ["/sbin/tini", "-e", "143", "--"]
CMD ["node", "/app/dist/main"]