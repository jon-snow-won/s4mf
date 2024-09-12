#!/bin/sh
sed -i "s/s4mf/${APP_TITLE}/" /app/index.html
sed -i -e "s#/fullpath_placeholder/#${BASE_PATH}#g" /app/index.html

if [ -f /tmp/env.js ]; then
  CONFIG_SHA=$(cat /tmp/env.js | sha256sum | awk '{ print $1 }')
  cp /tmp/env.js /app/env.${CONFIG_SHA:0:20}.js
  sed -i -e "s#/env.js#/env.${CONFIG_SHA:0:20}.js#g" /app/index.html
fi
