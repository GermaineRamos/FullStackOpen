FROM node:20

WORKDIR /usr/src/app

COPY . .

# Use npm install instead of npm ci for development
RUN npm install

# Start the development server
# The -- --host flag exposes the dev server outside localhost
CMD ["npm", "run", "dev", "--", "--host"]
