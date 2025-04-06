#!/bin/bash
export CI=false
export NODE_OPTIONS=--openssl-legacy-provider
node ./node_modules/react-scripts/scripts/build.js 