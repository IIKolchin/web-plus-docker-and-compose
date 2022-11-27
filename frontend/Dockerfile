FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:1.23.1-alpine AS production
COPY --from=builder /app/dist ./dist
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# ENTRYPOINT ["nginx", "-g", "daemon off;"]