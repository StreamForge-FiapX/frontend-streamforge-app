# Use uma imagem oficial do Node.js para construir o app Angular
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use uma imagem leve para servir a aplicação
FROM nginx:1.25-alpine

# Copy the built Angular app from the builder stage
COPY --from=builder /app/dist/fiapx /usr/share/nginx/html

# Expose the default port for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
