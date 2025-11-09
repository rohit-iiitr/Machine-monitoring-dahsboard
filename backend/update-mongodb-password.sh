#!/bin/bash

echo "=========================================="
echo "MongoDB Password Updater"
echo "=========================================="
echo ""
read -sp "Enter your MongoDB password: " PASSWORD
echo ""

if [ -z "$PASSWORD" ]; then
  echo "❌ Error: Password cannot be empty"
  exit 1
fi

# Escape special characters in password for sed
ESCAPED_PASSWORD=$(echo "$PASSWORD" | sed 's/[[\.*^$()+?{|]/\\&/g')

# Update .env file
if [ -f .env ]; then
  if sed -i.bak "s|<db_password>|${ESCAPED_PASSWORD}|g" .env; then
    echo "✅ MongoDB password updated successfully in .env file"
    echo "📝 Backup saved as .env.bak"
    echo ""
    echo "🔄 Please restart the backend server:"
    echo "   npm run start:dev"
  else
    echo "❌ Error updating .env file"
    exit 1
  fi
else
  echo "❌ Error: .env file not found"
  exit 1
fi

