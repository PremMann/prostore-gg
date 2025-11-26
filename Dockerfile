FROM node:18-buster

# Create app directory
WORKDIR /app

# Install app dependencies

# Copy environment file (if present)
COPY .env .env

# Copy Prisma schema
COPY prisma ./prisma

COPY package*.json ./
RUN npm install


# Generate Prisma client
RUN npx prisma generate

# Copy app source code

COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
