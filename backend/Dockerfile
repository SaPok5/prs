# Use a compatible Node.js base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including bcrypt rebuild if needed)
RUN npm ci

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the app
CMD ["npm", "start"]

