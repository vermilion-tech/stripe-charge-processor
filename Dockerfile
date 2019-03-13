FROM node:lts

COPY . .

RUN yarn install

EXPOSE 8080

CMD yarn start
