#!/bin/bash

# Navigate to client directory
cd client

# Install dependencies
npm install

# Build the React app
npx react-scripts build

# Output success message
echo "Build completed successfully!" 