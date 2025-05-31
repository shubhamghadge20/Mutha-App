#!/bin/bash

set -e

# Accept optional version argument
VERSION=${1:-latest}

# Updated image names based on your compose file
IMAGES=("machinewise-mutha-frontend" "machinewise-mutha-backend")

echo "🔧 Building Docker images with docker-compose..."
docker-compose build

# Tag and export each image
for IMAGE in "${IMAGES[@]}"; do
    TAGGED_IMAGE="${IMAGE}:${VERSION}"
    TAR_NAME="${IMAGE}-${VERSION}.tar"

    echo "🏷️  Tagging $IMAGE as $TAGGED_IMAGE..."
    docker tag "$IMAGE" "$TAGGED_IMAGE"

    echo "📦 Exporting $TAGGED_IMAGE to $TAR_NAME..."
    docker save -o "$TAR_NAME" "$TAGGED_IMAGE"
done

echo "✅ Export complete. Created tar files:"
for IMAGE in "${IMAGES[@]}"; do
    echo " - ${IMAGE}-${VERSION}.tar"
done
