FROM node:20-alpine

WORKDIR /app

# Activa corepack y pnpm (usa la misma versión que tienes localmente si quieres)
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# Copia manifiestos y lockfile de pnpm ANTES de instalar
COPY pnpm-lock.yaml ./
COPY package.json ./

# Instala deps con lockfile
RUN pnpm install --frozen-lockfile

# Copia el resto del código
COPY . .

# (Opcional) build de Nest si vas a ejecutar en prod
# RUN pnpm run build

EXPOSE 9000

# Dev: hot reload
CMD ["pnpm", "run", "start:dev"]
# Prod (si construyes): CMD ["node", "dist/main.js"]
