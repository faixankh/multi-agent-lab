FROM node:22-alpine AS deps
WORKDIR /app/frontend
COPY frontend/package.json ./package.json
RUN npm install

FROM node:22-alpine AS runner
WORKDIR /app/frontend
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY frontend ./
EXPOSE 3000
CMD ["npm", "run", "dev"]
