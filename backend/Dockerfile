# Use Node.js 20 Alpine (smaller, faster)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Force IPv4 DNS resolution at OS level
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# Start the application
CMD ["npx", "tsx", "src/index.ts"]
