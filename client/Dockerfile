FROM node:16-alpine

WORKDIR /app

# Copying package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variable for API
ENV REACT_APP_API_URL=http://localhost:5000/api

# Expose the port the dev server runs on
EXPOSE 5000

# Command to run the development server
CMD ["npm", "start"]