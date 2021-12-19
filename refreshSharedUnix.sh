# this script refreshes the "shared" package

yarn --cwd ./shared transpile & yarn --cwd ./front upgrade shared & yarn --cwd ./back upgrade shared
