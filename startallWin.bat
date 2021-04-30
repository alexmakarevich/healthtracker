:: this script starts all things needed for dev at once.

:: starts mongo (data folder needs to be on same drive as project)
start cmd.exe /k "mongod"

:: starts backend server
cd back
start cmd.exe /k "yarn dev"

:: starts frontend app
cd ..\front
start cmd.exe /k "yarn start"