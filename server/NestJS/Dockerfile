FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Install dependencies with memory optimization
RUN yarn install --frozen-lockfile --network-timeout 300000

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Set Node.js memory options and start the application
ENV NODE_OPTIONS="--max-old-space-size=512"
CMD ["node", "dist/main"]