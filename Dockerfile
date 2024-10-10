# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN yarn install --prefer-offline --frozen-lockfile --production=false

# Copy the rest of the application code
COPY . .

# Build the app
RUN yarn build

# Stage 2: Production Stage
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy build files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the rest of the necessary files (if any)
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the application port
EXPOSE ${HTTP_PORT}

# Command to run the application
CMD ["node", "dist/main"]

