FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
CMD ["node", "src/index.js"]
