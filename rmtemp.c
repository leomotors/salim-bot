/**
 * * Source Code for rmtemp
 * * To Remove ONLY Temp Files: Do ./rmtemp or ./rmtemp temp
 * * To Remove ONLY Log Files: Do ./rmtemp log
 * * To Remove BOTH Temp and Log Files: Do ./rmtemp all
 * ! Only for Linux
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[])
{
    if (argc > 1)
    {
        if (!strcmp(argv[1], "temp"))
        {
            system("rm -f ./temp/*");
            printf("[rmtemp] Successfully delete all temp files.\n");
        }
        else if (!strcmp(argv[1], "log"))
        {
            system("rm -f ./log/*");
            printf("[rmtemp] Successfully delete all log files.\n");
        }
        else if (!strcmp(argv[1], "all"))
        {
            system("rm -f ./temp/*");
            system("rm -f ./log/*");
            printf("[rmtemp] Successfully delete all temp and log files.\n");
        }
        else
        {
            printf("[rmtemp] Unknown argument!\n");
        }
    }
    else
    {
        system("rm -f ./temp/*");
        printf("[rmtemp] Successfully delete all temp files.\n");
    }
    return 0;
}