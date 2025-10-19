# Stage 1: Test stage
FROM node:20 AS test-stage

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Run tests - if tests fail, the build stops here
RUN npm run test

# Stage 2: Build stage
FROM node:20 AS build-stage

WORKDIR /usr/src/app

# Copy from test stage to ensure we're building tested code
COPY --from=test-stage /usr/src/app ./

# Build the application
RUN npm run build

# Stage 3: Production stage with Nginx
FROM nginx:1.25-alpine

# Copy the built files from build stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

