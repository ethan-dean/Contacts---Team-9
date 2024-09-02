#!/bin/bash

# Variables
REPO_DIR="/var/www/html/"       # Path to Git repository
BRANCH="main"                   # Branch to track and pull from

# Navigate to the repository directory
cd "$REPO_DIR" || { echo "Repository directory not found."; exit 1; }

# Make sure directory is marked as safe.
/usr/bin/git config --add safe.directory /var/www/html

# Fetch the latest changes from the remote repository
/usr/bin/git fetch origin "$BRANCH"

# Check for updates
LOCAL=$(/usr/bin/git rev-parse @)
REMOTE=$(/usr/bin/git rev-parse "@{u}")
echo "LOCAL:$LOCAL" >> /tmp/debug_log.txt
echo "REMOTE:$REMOTE" >> /tmp/debug_log.txt

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "No updates found on branch $BRANCH." >> /tmp/debug_log.txt
else
    echo "Updates found on branch $BRANCH. Pulling changes..." >> /tmp/debug_log.txt
    /usr/bin/git pull origin "$BRANCH"
    
    if [ $? -eq 0 ]; then
        echo "Pull successful." >> /tmp/debug_log.txt
    else
        echo "Error pulling changes. Check for conflicts or other issues." >> /tmp/debug_log.txt
    fi
fi
