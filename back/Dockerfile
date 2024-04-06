FROM node

WORKDIR /back

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "websocket.js"]