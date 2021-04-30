mongo --eval "db.stats()"  # do a simple harmless command of some sort

RESULT=$?   # returns 0 if mongo eval succeeds

if [ $RESULT -ne 0 ]; then
    echo "mongodb not running, srarting it"
    mongod --dbpath /System/Volumes/Data/data/db & # using this folder, since Apple doesn't allow creating root folders (/data/db) anymore
else
    echo "mongodb running!"
fi

yarn --cwd ./back dev &
yarn --cwd ./front start