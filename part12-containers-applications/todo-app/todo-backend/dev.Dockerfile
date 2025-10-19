FROM node:20

WORKDIR /usr/src/app

COPY . .

# Use npm install for development (not npm ci)
RUN npm install

# Start with nodemon for hot reloading
CMD ["npm", "run", "dev"]
