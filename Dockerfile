
# === Build stage ===
FROM node:20-alpine AS build

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# === Deployment stage ===
FROM node:20-alpine as deploy
WORKDIR /app

# Copy build files from build stage
COPY --from=build /app/build /app/build

# Copy package.json and pnpm-lock.yaml
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./

# Install dependencies omit devDependencies
RUN yarn install --production

# Expose port
EXPOSE 3000

# Serve
ENTRYPOINT ["node", "build"]