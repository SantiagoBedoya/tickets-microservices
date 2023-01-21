FROM node:18 AS build
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN yarn install

COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

COPY --from=build /app/dist /app/src
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/yarn.lock /app/yarn.lock

RUN yarn install --prod

EXPOSE 3002

CMD ["node", "/app/src/main.js"]