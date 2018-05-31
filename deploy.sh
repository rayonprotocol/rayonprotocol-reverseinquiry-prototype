#!/bin/bash
set -e

check_var() {
  if [ -z ${!1} ] ; then
    echo "missing env var: ${1}"
    exit 1
  fi
}

check_var AWS_ACCESS_KEY_ID
check_var AWS_SECRET_ACCESS_KEY
check_var AWS_DEFAULT_REGION

# 정적 서버로써 사용할 s3 버킷 이름
S3_BUCKET=march-web-resource
BUILD_OUT_DIR=dist
STATIC_DIR=static
# Install packages
yarn
# Build
yarn build

# Deploy client
aws s3 cp $BUILD_OUT_DIR/ s3://$S3_BUCKET/ \
  --exclude "index.html" \
  --recursive \
  --acl public-read \
  --cache-control "max-age=31536000"

aws s3 cp $BUILD_OUT_DIR/index.html s3://$S3_BUCKET/index.html \
  --acl public-read \
  --cache-control "max-age=0 no-cache no-store must-revalidate"

aws s3 cp $STATIC_DIR/ s3://$S3_BUCKET/ \
  --recursive \
  --acl public-read \
  --cache-control "max-age=31536000"
