FROM node:alpine

WORKDIR /app/

ADD src .
ADD package.json .
ADD tsconfig.json .

RUN npm install && \
    npm install -g typescript && \
    tsc --build

CMD node dist/