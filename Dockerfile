FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8050

ENV PORT=${APP_PORT:-8050}

CMD ["npm", "start"]