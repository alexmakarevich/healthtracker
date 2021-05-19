mongo --eval "db.stats()"  # do a simple harmless command of some sort

RESULT=$?   # returns 0 if mongo eval succeeds

if [ $RESULT -ne 0 ]; then
    echo "mongodb not running, srarting it"
    mongod --port 27017 --dbpath %MONGO_DATA_PATH% --replSet rs0 & mongod --port 27018 --dbpath %MONGO_DATA_PATH%/../replica1 --replSet rs0
else
    echo "mongodb running!"
fi

yarn --cwd ./back dev &
yarn --cwd ./front start