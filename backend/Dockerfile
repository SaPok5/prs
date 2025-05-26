# Stage 1: Build the application
FROM node:20-slim AS builder

# Install OpenSSL and dev libraries for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy all application files first
# This includes package.json, package-lock.json, and the prisma directory
COPY . .

# Install ALL dependencies (including devDependencies) for building
# The postinstall script 'prisma generate' will run here and find schema.prisma
RUN npm install

RUN npx prisma generate

# Build the TypeScript project
RUN npm run build

# After building, prune devDependencies for the next stage
# This ensures that the node_modules copied to the final image are production-only
RUN npm prune --production

# Stage 2: Production image
FROM node:20-slim

# Install OpenSSL runtime libraries for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl libssl3 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy only necessary artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the application
# The "start" script in package.json is "node ./dist/src/index.js"
CMD ["npm", "start"]
