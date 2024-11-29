# Use a build argument to distinguish between development and production
ARG NODE_ENV=development
FROM node:20

WORKDIR /app

COPY package*.json ./

# Install dependencies based on the environment
# If NODE_ENV is production, it will install only production dependencies
# Otherwise, it installs all dependencies
RUN npm install

COPY . .

EXPOSE 5000

# Use the build argument to determine the command
CMD ["npm", "run", "dev"]
