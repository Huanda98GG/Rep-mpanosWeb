FROM node:18-bullseye-slim
WORKDIR /app
COPY package*.json ./
# Install all dependencies (including dev) so we can build TypeScript
RUN npm install
COPY . .
# Generate Prisma client and build the project
RUN npm run prisma:generate || true
RUN npm run build || true
# Run the compiled JS
CMD ["node", "dist/src/main.js"]
