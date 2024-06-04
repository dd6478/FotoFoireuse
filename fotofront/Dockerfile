# Define the base image
FROM node:latest as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g npm
RUN npm install -g typescript
RUN npm install
COPY . .
RUN npm run build
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]