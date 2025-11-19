# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy dependencies from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy source code
COPY src ./src
COPY package.json ./

# Expose port
EXPOSE 8004

# Run the application
CMD ["npm", "start"]
