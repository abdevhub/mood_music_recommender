#!/bin/bash

# Navigate to client directory
cd client

# Install dependencies
npm install

# Create a temporary package.json build script to avoid permission issues
echo '#!/usr/bin/env node
const { execSync } = require("child_process");
try {
  console.log("Building React app...");
  execSync("node ./node_modules/react-scripts/scripts/build.js", { stdio: "inherit" });
  console.log("Build completed successfully!");
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}' > build-script.js

# Make it executable
chmod +x build-script.js

# Run the custom build script
node build-script.js

# Check if build directory exists
if [ -d "build" ]; then
  echo "Build directory created successfully"
else
  echo "Error: Build directory was not created"
  exit 1
fi 