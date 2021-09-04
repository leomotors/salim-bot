#!/bin/bash

# * rmtemp.sh: This script should be run from npm
# * npm run clean will clean temp files (and dist)
# * npm run clearlog will clean log files
# ! Only for Shell

if [ $# -gt 0 ]
then if [ $1 = "temp" ]
    then
        rm -f ./temp/*
        echo "[rmtemp] Successfully delete all temp files."
    elif [ $1 = "log" ]
    then
        rm -f ./log/*
        echo "[rmtemp] Successfully delete all log files."
    else
        echo "[rmtemp] Unknown Arguments. Also, please run this from npm"
    fi
else
    rm -f ./temp/*
        echo "[rmtemp] Successfully delete all temp files. Also, please run this from npm"
fi
