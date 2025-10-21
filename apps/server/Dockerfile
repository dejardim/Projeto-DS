# —————————————— builder ——————————————
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app

# copy only what's needed
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
EXPOSE 8080

# directly run the built JS
CMD ["node", "dist/src/index.js"]