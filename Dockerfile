# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to install dependencies
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the built app
FROM node:18-alpine

# Install serve globally to host the static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app/build /app/build

# Expose port 3000 for the app
EXPOSE 3000

# Start the app with serve
CMD ["serve", "-s", "build", "-l", "3000"]
