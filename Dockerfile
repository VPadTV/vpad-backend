FROM node:alpine as base

WORKDIR /server

RUN apk add --no-cache ffmpeg

COPY package*.json tsconfig.json yarn.lock ./

RUN rm -rf node_modules && yarn install --frozen-lockfile && yarn cache clean

COPY . .

RUN yarn prisma generate && yarn build

CMD ["yarn", "start"] 