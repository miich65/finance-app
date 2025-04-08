# server/Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
COPY server ./server

WORKDIR /app/server

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]
