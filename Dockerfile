FROM node:alpine as builder

WORKDIR /app/

ADD src .
ADD package.json .
ADD yarn.lock .
ADD tsconfig.json .

RUN yarn install && \
    yarn build

FROM node:alpine

WORKDIR /app/

COPY --from=builder /app/dist .
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "index.js"]