FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/

RUN npm install --workspace=apps/api

COPY apps/api ./apps/api

RUN npm run build --workspace=apps/api

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

RUN npm install --production --workspace=apps/api

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "apps/api/dist/server.js"]
