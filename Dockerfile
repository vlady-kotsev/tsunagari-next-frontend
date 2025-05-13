FROM node:18-alpine

WORKDIR /app
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev
COPY . .

RUN npm install --force

EXPOSE 4004

CMD ["npm", "run", "dev","--","-p","4004"]