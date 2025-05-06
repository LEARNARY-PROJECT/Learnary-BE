FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate && npx prisma migrate

RUN npm run build

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]
