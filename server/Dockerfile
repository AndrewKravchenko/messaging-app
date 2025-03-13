FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18 AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json ./

RUN npm install --production

EXPOSE 5000
EXPOSE 5001

CMD ["node", "dist/index.js"]
