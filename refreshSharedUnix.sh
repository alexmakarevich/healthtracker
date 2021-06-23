# this script refreshes the "shared" package

yarn --cwd ./shared webpack & yarn --cwd ./front upgrade shared & yarn --cwd ./back upgrade shared
