#!/usr/bin/env bash
set -e

BRANCH="$1"
shift || true

# Everything after the branch is considered the tag message
TAG_MSG="$*"

# Generate date in YYYYMMDDZHHMM format
DATE="$(date +%Y%m%dZ%H%M)"

if [ -z "$BRANCH" ]; then
  echo "Usage: $0 <branch> [optional tag message]"
  exit 1
fi

echo "Checking out $BRANCH and pulling latest..."
git checkout "$BRANCH"
git pull

echo "Merging $BRANCH into main..."
git checkout main
git pull
git merge --no-ff "$BRANCH"
git push

if [ "$BRANCH" = "hotfix" ]; then
  echo "Hotfix detected. Merging hotfix into dev..."
  git checkout dev
  git pull
  git merge --no-ff hotfix
  git push
fi

if [ -n "$TAG_MSG" ]; then
  echo "Tagging release-$DATE with message: $TAG_MSG"
  git tag -a "release-$DATE" -m "$TAG_MSG"
  git push origin "release-$DATE"
else
  echo "No tag message provided. Skipping tag creation."
fi

echo "Done!"

