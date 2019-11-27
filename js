#!/bin/bash

#if [ -z "$1" ] || [ -z "$2" ]; then
#    echo "ERROR: Usage: $0 <update_file_new.zip> <build.prop>"
#    exit 1
#fi
#if ! [ -f "$1" ] || [ -f "$2" ]; then
#    echo "ERROR: File not found"
#    exit 2
#fi

DEVICE=s12v55_jk_3m
BUILD_PROP=`ls out/target/product/$DEVICE/system/build.prop`
ZIP=`ls out_base/$DEVICE-ota-*.zip`
JSON=out_base/api.json
SERVER="http://l257728y.beget.tech/ota/"

#read -p "Update name (displayed to user): " name
read -p "Download link: " link
read -p "Add changelog entry (Keep empty to finish): " changelog
changelog="      \"$changelog\""
while [ true ]; do
    read -p "Add changelog entry (Keep empty to finish): " input
    if [ -z "$input" ]
        then
            break
    fi
    changelog="$changelog,\n      \"$input\""
done
echo "["
echo "  {"
echo "    \"name\": \"$(echo "$ZIP" | cut -d '/' -f 2 | sed -e 's/\.[^.]*$//')\","
echo "    \"filename\": \"$(echo $ZIP | cut -d '/' -f 2)\","
echo "    \"md5\": \"$(md5sum $ZIP | awk '{ print $1 }')\","
echo "    \"size\": $(stat -c %s $ZIP),"
echo "    \"builddate\": $(cat $BUILD_PROP | grep ro.build.date.utc= | cut -d '=' -f 2),"
echo "    \"releasedate\": $(stat -c %Y $ZIP)000,"
echo "    \"device\": \"$(cat $BUILD_PROP | grep ro.product.device= | cut -d '=' -f 2)\","
echo "    \"url\": \"$link\","
printf "    \"patchlevel\": "
#if [ "$(stat -c %s $ZIP)" -ge "500000000" ]; then
    level=0
#else
#    level=1
#fi
printf "$level"
printf ",\n"
printf "    \"changelog\": [\n$changelog\n    ]\n"
echo "  }"
echo "]"

if [ -f "$JSON" ]; then
if [ -f "$JSON.tmp" ]; then
rm -rf $JSON.tmp
fi

cp $JSON $JSON.tmp
(cat << EOF) > $JSON
[
  {
    "name": "$(echo "$ZIP" | cut -d '/' -f 2 | sed -e 's/\.[^.]*$//')",
    "filename": "$(echo $ZIP | cut -d '/' -f 2)",
    "md5": "$(md5sum $ZIP | awk '{ print $1 }')",
    "size": $(stat -c %s $ZIP),
    "builddate": $(cat $BUILD_PROP | grep ro.build.date.utc= | cut -d '=' -f 2),
    "releasedate": $(stat -c %Y $ZIP)000,
    "device": "$(cat $BUILD_PROP | grep ro.product.device= | cut -d '=' -f 2)",
    "url": "$link",
    "patchlevel": "$level",
    "changelog": $(printf "[\n$changelog\n    ]\n")
  },
EOF
tail -n +2 $JSON.tmp >> $JSON
rm -rf $JSON.tmp

else

(cat << EOF) > $JSON
[
  {
    "name": "$(echo "$ZIP" | cut -d '/' -f 3 | sed -e 's/\.[^.]*$//')",
    "filename": "$(echo $ZIP | cut -d '/' -f 3)",
    "md5": "$(md5sum $ZIP | awk '{ print $1 }')",
    "size": $(stat -c %s $ZIP),
    "builddate": $(cat $BUILD_PROP | grep ro.build.date.utc= | cut -d '=' -f 2),
    "releasedate": $(stat -c %Y $ZIP)000,
    "device": "$(cat $BUILD_PROP | grep ro.product.device= | cut -d '=' -f 2)",
    "url": "$link",
    "patchlevel": "$level",
    "changelog": $(printf "[\n$changelog\n    ]\n")
  }
]
EOF
fi
