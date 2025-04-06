#!/bin/bash
npm install
export CI=false
NODE_OPTIONS=--openssl-legacy-provider npx react-scripts build 