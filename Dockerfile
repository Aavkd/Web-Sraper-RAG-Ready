# ---------- Build stage ----------
# Use node:20-slim for building (simpler, no permission issues)
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
# Use Playwright image for runtime (has Chromium pre-installed)
FROM apify/actor-node-playwright-chrome:20

ENV NODE_ENV=production

# Create app directory with correct ownership for myuser
USER root
RUN mkdir -p /app && chown -R myuser:myuser /app
USER myuser

WORKDIR /app

# Copy package files
COPY --chown=myuser:myuser package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from builder stage
COPY --chown=myuser:myuser --from=builder /app/dist ./dist

# Copy Apify configuration files
COPY --chown=myuser:myuser .actor .actor
COPY --chown=myuser:myuser INPUT_SCHEMA.json ./
COPY --chown=myuser:myuser README.md ./

# Run the actor
CMD ["npm", "start"]
