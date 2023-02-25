#!/bin/sh

THIS_DIR=$(cd $(dirname $0); pwd)
echo ${THIS_DIR}
SQL_CMD="mysql -u root -ppassword -h master"

sleep 10

echo load sql file for sample
for file in $(find ./docker-entrypoint-initdb.d/sql -name "*.sql" | sort); do
  echo load file ${file}
  $SQL_CMD < ${file}
done