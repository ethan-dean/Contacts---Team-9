#!/bin/bash

# Variables
REPO_DIR="/var/www/html/"       # Path to Git repository
BRANCH="main"                   # Branch to track and pull from
DEBUG_FILE="/tmp/debug_log.txt" # Output file to write debug to

# Navigate to the repository directory
cd "$REPO_DIR" || { echo "Repository directory not found."; exit 1; }

# Make sure directory is marked as safe.
/usr/bin/git config --add safe.directory /var/www/html

# Fetch the latest changes from the remote repository
/usr/bin/git fetch origin "$BRANCH"

# Check for updates
LOCAL=$(/usr/bin/git rev-parse @)
REMOTE=$(/usr/bin/git rev-parse "@{u}")
echo "LOCAL:$LOCAL" >> DEBUG_FILE
echo "REMOTE:$REMOTE" >> DEBUG_FILE

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "No updates found on branch $BRANCH." >> DEBUG_FILE
else
    echo "Updates found on branch $BRANCH. Pulling changes..." >> DEBUG_FILE
    /usr/bin/git pull origin "$BRANCH"
    
    if [ $? -eq 0 ]; then
        echo "Pull successful." >> DEBUG_FILE
    else
        echo "Error pulling changes. Check for conflicts or other issues." >> DEBUG_FILE
    fi
fi
