FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production || true
COPY . .
RUN npx prisma generate
CMD ["node", "index.js"]
