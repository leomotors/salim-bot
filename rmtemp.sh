
# * rmtemp.sh
# * To Remove ONLY Temp Files: Do ./rmtemp.sh or ./rmtemp.sh temp
# * To Remove ONLY Log Files: Do ./rmtemp.sh log
# * To Remove BOTH Temp and Log Files: Do ./rmtemp.sh all
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
    elif [ $1 = "all" ]
    then
        rm -f ./temp/*
        rm -f ./log/*
        echo "[rmtemp] Successfully delete all temp and log files."
    else
        echo "[rmtemp] Unknown Arguments"
    fi
else
    rm -f ./temp/*
        echo "[rmtemp] Successfully delete all temp files."
fi
