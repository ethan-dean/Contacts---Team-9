#!/bin/bash

# Variables
REPO_DIR="/var/www/html/"       # Path to Git repository
BRANCH="main"                   # Branch to track and pull from

# Navigate to the repository directory
cd "$REPO_DIR" || { echo "Repository directory not found."; exit 1; }

# Fetch the latest changes from the remote repository
git fetch origin "$BRANCH"

# Check for updates
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "@{u}")

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "No updates found on branch $BRANCH."
else
    echo "Updates found on branch $BRANCH. Pulling changes..."
    git pull origin "$BRANCH"
    
    if [ $? -eq 0 ]; then
        echo "Pull successful."
    else
        echo "Error pulling changes. Check for conflicts or other issues."
    fi
fi