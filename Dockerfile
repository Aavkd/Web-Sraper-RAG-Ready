# ---------- Build stage ----------
FROM apify/actor-node-playwright-chrome:20 AS builder

# Create app directory with correct ownership for myuser
USER root
RUN mkdir -p /app && chown -R myuser:myuser /app
USER myuser

WORKDIR /app

# Copy package files first for better layer caching
COPY --chown=myuser:myuser package*.json ./

# Install ALL dependencies (including TypeScript for compilation)
RUN npm ci

# Copy source code
COPY --chown=myuser:myuser . .

# Build TypeScript (use npx to find local tsc)
RUN npx tsc

# ---------- Production stage ----------
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
