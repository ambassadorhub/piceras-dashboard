#!/bin/bash

# WordPress REST API update script
SITE="https://aitoolguru.co.uk"
POST_ID="9"

# Read the clean HTML content
CONTENT=$(cat /home/bass/.openclaw/workspace/wordpress-content.html | sed 's/"/\\"/g' | tr '\n' ' ')

# Create the JSON payload
JSON="{\"content\":\"$CONTENT\",\"title\":\"Best AI Tools for Small Business UK 2026: The Complete Guide\",\"meta_description\":\"Discover the best AI tools for small business in the UK in 2026. Honest reviews, real pricing, and recommendations for marketing, productivity, customer service, and more.\"}"

# Update the post via REST API
echo "Updating post $POST_ID..."
curl -X POST \
  "$SITE/wp-json/wp/v2/posts/$POST_ID" \
  -H "Content-Type: application/json" \
  -d "$JSON"

echo "Done."