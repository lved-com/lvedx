#!/bin/bash

# ensure script runs at repo root
REPO_ROOT=$(git rev-parse --show-toplevel)
if [ $? -ne 0 ]; then
    echo "error: not a git repository."
    exit 1
fi
cd "$REPO_ROOT" || exit 1

CURRENT_TIME=$(date -u +"%Y%m%dZ%H%M")

git add .

# determine commit message
COMMIT_MSG=""
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
else
    # read from stdin if piped
    if ! [ -t 0 ]; then
        read -r MSG_FROM_STDIN
        if [ -n "$MSG_FROM_STDIN" ]; then
            COMMIT_MSG="$MSG_FROM_STDIN"
        fi
    fi
fi

if [ -z "$COMMIT_MSG" ]; then
    CHANGED_FILES=$(git diff --cached --name-only)
    if [ -z "$CHANGED_FILES" ]; then
        COMMIT_MSG="no changes"
        echo "no commit msg and no changes. using 'no changes'"
    else
        FIRST_FILE=$(echo "$CHANGED_FILES" | head -n 1)
        COUNT_FILES=$(echo "$CHANGED_FILES" | wc -l)
        if [ "$COUNT_FILES" -gt 1 ]; then
            COMMIT_MSG="edited $FIRST_FILE (and more)"
            echo "no commit msg. using 'edited $FIRST_FILE (and more)'"
        else
            COMMIT_MSG="edited $FIRST_FILE"
            echo "no commit msg. using 'edited $FIRST_FILE'"
        fi
    fi
fi

echo "$COMMIT_MSG" > msg4commit

CHANGED_HTML=$(git diff --cached --name-only | grep '\.html$')
if [ -n "$CHANGED_HTML" ]; then
    GIT_HASH=$(git rev-parse --short HEAD)
    for FILE in $CHANGED_HTML; do
        # css version update
        sed -i "s/\(style\.css?v=\)[0-9A-Za-z]\+/\1$GIT_HASH/" "$FILE"
        # timestamp update
        # use a fully explicit pattern with standard sed BRE:
        # '">source ' and/or 'css?v=' followed by 8 digits, 'Z', then 4 digits
        sed -i "s/\(\">source \)[0-9]\{8\}Z[0-9]\{4\}/\1$CURRENT_TIME/" "$FILE"
        sed -i "s/v=[0-9]\{8\}Z[0-9]\{4\}/v=$CURRENT_TIME/g" "$FILE"

    done
    git add $CHANGED_HTML
fi

git add .

git status
git diff --cached
git reflog -n 10

echo "press enter to commit, ctrl+c to cancel"
read -r

git commit -F msg4commit

echo "press enter to push and sync main branch, ctrl+c to cancel"
read -r

git push --all
git push --all backup

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "merging dev into main..."
    git pull
    git merge --no-ff dev || true
    git checkout dev
fi

# only needed for repos without a working git hook
[ -f "./syncgitprod.sh" ] && ./syncgitprod.sh

git status
git log --oneline

