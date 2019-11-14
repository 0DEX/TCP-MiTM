FROM node:alpine

WORKDIR /app/

ADD index.js .
ADD package.json .

RUN npm install

CMD [ "node", "."]