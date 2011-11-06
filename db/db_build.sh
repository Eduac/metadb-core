#! /bin/sh

USER=metadb_rw
DB=metadb
CLEAN=0

while [ $# -gt 0 ]
do
    case "$1" in
	-c)
		CLEAN=1
		;;
	-u)
	    USER="$2"
	    shift
	    ;;
	*)
	    echo
	    echo `basename $0` "-c -u <user>"
	    echo "-c Clean db, starts fresh"
	    echo
	    exit 1
	    ;;
    esac
    shift
done

if [ $CLEAN -eq 0 ]; then
	VERSION=`psql -U $USER -d $DB -c 'SELECT * FROM properties' 2>/dev/null | grep version | grep '[0-9]\{1,\}' -o`
fi

if [ -z "$VERSION" ]; then
	VERSION=0
else
	VERSION=$((VERSION))
fi

UPDATING=''
FILES=`ls -1 mdb_core*.sql`

for FILE in $FILES
do
	v=`echo $FILE | grep '[0-9]\{1,\}' -o`
	if [ $((v)) -gt $VERSION ]; then
		UPDATING=`echo $UPDATING $FILE`
	fi
done

if [ -n "$UPDATING" ]; then
	echo Updating from version $VERSION
	cat $UPDATING | psql -U $USER -d $DB -1 -f - > /dev/null
	if [ $? -gt 0 ]; then
		echo "Error running db build script"
		exit 1
	fi
else
	echo Database is up to date
fi