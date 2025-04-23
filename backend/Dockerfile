FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# First uninstall bcrypt and install bcryptjs (pure JavaScript implementation)
RUN npm install
RUN npm uninstall bcrypt
RUN npm install bcryptjs

COPY . .

# Ensure TypeScript files use bcryptjs instead of bcrypt before building
RUN find ./src -type f -name "*.ts" -exec sed -i 's/from "bcrypt"/from "bcryptjs"/g' {} \;
RUN find ./src -type f -name "*.ts" -exec sed -i "s/from 'bcrypt'/from 'bcryptjs'/g" {} \;
RUN find ./src -type f -name "*.ts" -exec sed -i 's/require("bcrypt")/require("bcryptjs")/g' {} \;
RUN find ./src -type f -name "*.ts" -exec sed -i "s/require('bcrypt')/require('bcryptjs')/g" {} \;

RUN npm run build

# Make sure the build directory exists
RUN ls -la dist || echo "Build directory not found"

# Create a startup script file
RUN printf '#!/bin/sh\necho "Seeding db..."\nnpm run seed\necho "Starting server..."\nexec node dist/index.js\n' > /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 3000

# Use the startup script
CMD ["/bin/sh", "/app/start.sh"]

