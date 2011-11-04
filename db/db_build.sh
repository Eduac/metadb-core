#! /bin/sh

USER=metadb_rw
DB=metadb

VERSION=`psql -U $USER -d $DB -c 'SELECT * FROM properties' 2>/dev/null | grep version | grep '[0-9]\{1,\}' -o`

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
	echo Updating from version $v
	cat $UPDATING | psql -U $USER -d $DB -1 -f -
else
	echo Database is up to date
fi