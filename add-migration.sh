#!/bin/bash

NOW=$(date +%Y%m%d%H%M%S)

UP="./migrations/${NOW}_up.sql"
DOWN="./migrations/${NOW}_down.sql"
touch $UP
echo $UP
touch $DOWN
echo $DOWN
