FROM node:18-alpine

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package*.json ./

# Rebuild native modules
RUN npm install --build-from-source

COPY . .
CMD ["npm", "start"]