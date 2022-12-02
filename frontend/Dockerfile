FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:latest AS production
COPY --from=builder /app/nginx/conf.d /etc/nginx/conf.d
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]