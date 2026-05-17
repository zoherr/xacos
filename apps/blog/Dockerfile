FROM oven/bun:1 AS builder
WORKDIR /app

# Copy monorepo root
COPY package.json bunfig.toml bun.lock ./
COPY packages/ packages/
COPY apps/blog/ apps/blog/

# Install and build
RUN bun install --frozen-lockfile
RUN bun run build --filter=blog

FROM oven/bun:1-slim
WORKDIR /app

COPY --from=builder /app/packages/ packages/
COPY --from=builder /app/apps/blog/ apps/blog/
COPY --from=builder /app/node_modules/ node_modules/

WORKDIR /app/apps/blog

EXPOSE 5000
CMD ["bun", "run", "start"]
