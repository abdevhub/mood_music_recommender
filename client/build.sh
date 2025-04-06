#!/bin/bash
npm install
export CI=false
export NODE_OPTIONS=--openssl-legacy-provider
./node_modules/.bin/react-scripts build 