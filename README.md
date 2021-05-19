# Health Tracker

[WIP] App tracking your health state and contributing factors.

Stack: MongodDB + Express Backend + React Frontend.

## Current Features

- track exercises
  - maintain reps/weights/duration
  - view exercise chart
- track nutrition intake

## Upcoming Features

- track health state (sysmptoms, basic measurables)
- track other factors
- combine tracked data
- analyze data

## Development

### Prerequisites

1. install mongodb on the same drive as the project (if it's on another drive, launch scripts may need to be adjusted).
2. Make environment variable `$MONGO_DATA_PATH` point to your main mongo instance location
3. create db with the same name as stated in back/server.ts

### Installation

Install frontend & backend separately (`$ yarn` for "front" and "back" directory).

### Start in Dev Mode

#### Manually (any OS)

1. Start two mongo instances running, added to the same replica set. Requires environment variable `$MONGO_DATA_PATH` to point to your main mongo instance

   - master instance - on localhost/27017 `mongod --port 27017 --dbpath %MONGO_DATA_PATH% --replSet rs0`

   - slave instance for replica - on localhost/27018 `mongod --port 27018 --dbpath %MONGO_DATA_PATH%/../replica1 --replSet rs0`

   - if the given ports are unsuitable for you, feel free to select your own, while also changing the ports set in server.ts

2. start backend - `$ yarn dev` in "back" directory
3. start frontent - `$ yarn start` in "front" directory

#### Quick - Mac

Run `startallMac.sh`
Requires environment variable `$MONGO_DATA_PATH` to point to your main mongo instance

#### Quick - Windows

Run `startallWin.bat`
Requires environment variable `$MONGO_DATA_PATH` to point to your main mongo instance
