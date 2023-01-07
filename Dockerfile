FROM node:18 AS install

RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock .

RUN yarn

COPY jest.config.js tsconfig.json vite.config.json
COPY src/ index.html .

FROM install AS test
CMD yarn test

FROM install AS build
CMD yarn build

FROM build AS start
CMD yarn start
