#!/bin/bash

set -e

TAR_FILES=(*.tar)

if [ ${#TAR_FILES[@]} -eq 0 ]; then
  echo "❌ No .tar files found in current directory."
  exit 1
fi

for TAR in "${TAR_FILES[@]}"; do
    echo "📥 Loading image from $TAR..."
    docker load -i "$TAR"
done

echo "✅ All Docker images have been loaded successfully."