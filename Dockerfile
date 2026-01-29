# ---------- Build stage ----------
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including TypeScript for compilation)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ---------- Production stage ----------
FROM node:20-slim

ENV NODE_ENV=production
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only (using --omit=dev instead of deprecated --only=production)
RUN npm ci --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy Apify configuration files
COPY .actor .actor
COPY INPUT_SCHEMA.json ./
COPY README.md ./

# Run the actor
CMD ["npm", "start"]
