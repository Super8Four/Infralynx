FROM node:26-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci --workspace=@infralynx/shared --workspace=@infralynx/api --include-workspace-root
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build --workspace=@infralynx/shared && npm run build --workspace=@infralynx/api

FROM node:26-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci --omit=dev --workspace=@infralynx/shared --workspace=@infralynx/api --include-workspace-root && npm cache clean --force
COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/api/drizzle apps/api/drizzle
USER node
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]
