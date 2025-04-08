# client/Dockerfile

FROM node:18

WORKDIR /app

COPY client/package*.json ./
COPY client/ ./

# 👇 Aggiungi questa riga prima del build
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install
RUN npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]
