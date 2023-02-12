# Install 
FROM node:16.15 AS install

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY jest.config.js .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY tsconfig.server.json .
COPY vite.config.ts .
COPY index.html .

ADD src /app/src

# Run test
FROM install AS test
CMD yarn tsc && yarn test

# Build application
FROM install AS build
WORKDIR /app
RUN yarn build

# Run application
FROM build
CMD yarn start
