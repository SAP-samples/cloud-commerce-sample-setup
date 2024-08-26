#!/usr/bin/env bash
# The reason for this script is because piper does not support publishing multiple artifacts
# In addition, it only publishes packages that are found on the root of the project
# This script will pack every package and set it to the root level so it can be published properly
set -e
shopt -s extglob dotglob

npm i && npm run build
cp -na ./dist/tua-spa/. ./
rm -rf ./dist

mkdir storefrontstyles
cp -a ./projects/tua-spa/src/storefrontstyles/. ./storefrontstyles
