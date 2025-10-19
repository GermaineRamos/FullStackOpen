FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

# Accept build argument
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM nginx:1.25-alpine

# Copy the built static files
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
