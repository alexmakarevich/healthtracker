:: this script starts all things needed for dev at once.

:: starts mongo (data folder needs to be on same drive as project)
start cmd.exe /k "mongod --port 27017 --dbpath %MONGO_DATA_PATH% --replSet rs0"
start cmd.exe /k "mongod --port 27018 --dbpath %MONGO_DATA_PATH%/../replica1 --replSet rs0"

:: starts backend server
cd back
start cmd.exe /k "yarn dev"

:: starts frontend app
cd ..\front
start cmd.exe /k "yarn start"