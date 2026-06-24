FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace manifests first (layer cache for deps)
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install all workspace deps on Linux (generates correct native bindings)
RUN npm install

# Copy source
COPY . .

# Build client then server
RUN npm run build -w client && npm run build -w server

# ── Runtime image ────────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Only copy what we need to run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist
COPY package.json ./
COPY server/package.json ./server/

ENV NODE_ENV=production

CMD ["node", "server/dist/index.js"]
