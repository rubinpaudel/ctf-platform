FROM node:16.14.0-alpine

WORKDIR /backend

COPY ./package.json .

RUN npm install && npm cache clean --force
RUN npm install -g nodemon
RUN npm install -g concurrently


COPY . .


RUN npm uninstall bcrypt

RUN npm install bcrypt


EXPOSE 3000

CMD [ "npm", "run", "dev" ]