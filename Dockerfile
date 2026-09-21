# Stage 1: Build the React UI
FROM node:20-alpine AS ui-builder
WORKDIR /app/frontend/ui
COPY frontend/ui/package*.json ./
RUN npm install
COPY frontend/ui ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app

# Install git for the AST/Git analyzer
RUN apk add --no-cache git

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

COPY backend ./
COPY --from=ui-builder /app/frontend/ui/dist /app/frontend/ui/dist

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]