FROM node:20-slim

WORKDIR /app

COPY auth-service/package*.json ./
RUN npm ci --omit=dev

COPY auth-service/ ./

EXPOSE 3001

CMD ["node", "src/index.js"]
