#!/bin/bash

# Create or clear .env.local file
echo "starting entrypoint.sh PROEJCT_NUMBER=$PROJECT_NUMBER, CONSTITUENCY=$CONSTITUENCY, MAP_KEY=$MAP_KEY"
#env

if [ ! -z "$PROJECT_NUMBER" ]; then
  echo "substituting $PROJECT_NUMBER"
  find /app/refine/.next/ -name "*.js" | xargs  sed -i 's/__PROJECT_NUMBER__/'"$PROJECT_NUMBER"'/g'
  sed -i 's/__PROJECT_NUMBER__/'"$PROJECT_NUMBER"'/g' /app/refine/server.js
fi

if [ ! -z "$CONSTITUENCY" ]; then
  echo "substituting $CONSTITUENCY"
  find /app/refine/.next/ -name "*.js" | xargs  sed -i 's/__CONSTITUENCY__/'"$CONSTITUENCY"'/g'
  sed -i 's/__CONSTITUENCY__/'"$CONSTITUENCY"'/g' /app/refine/server.js
fi

if [ ! -z "$MAP_KEY" ]; then
  echo "substituting $MAP_KEY"
  find /app/refine/.next/ -name "*.js" | xargs  sed -i 's/__MAP_KEY__/'"$MAP_KEY"'/g'
  sed -i 's/__MAP_KEY__/'"$MAP_KEY"'/g' /app/refine/server.js
fi

echo "finished entrypoint.sh"
# Execute the command passed to docker run
exec "$@"

