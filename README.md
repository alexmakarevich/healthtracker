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
2. create db with the same name as stated in back/server.ts

### Installation

Install frontend & backend separately (`$ yarn` for "front" and "back" directory).

### Start in Dev Mode

#### Manually (any OS)

1. make sure your mongo server is up (if not, `$ mongod`)
2. start backend - `$ yarn dev` in "back" directory
3. start frontent - `$ yarn start` in "front" directory

#### Quick - Mac

Run `startallMac.sh`

#### Quick - Windows

Run `startallWin.bat`
