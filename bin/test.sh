#!/usr/bin/env bash

MOCHA="./node_modules/.bin/mocha"
KARMA="./node_modules/.bin/karma"
TYPE="${1:-unit}"
DIR="./test/$TYPE"

if [ $TYPE == 'karma' ]
then
    $KARMA start
else
    $MOCHA $(find $DIR -type f -name '*.js')
fi

