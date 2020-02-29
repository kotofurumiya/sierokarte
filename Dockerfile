FROM node:12-stretch

WORKDIR /workspace
COPY package.json package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]