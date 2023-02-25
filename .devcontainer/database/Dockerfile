FROM mysql/mysql-server:8.0.32

ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

ENV MYSQL_ROOT_PASSWORD=password \
    MYSQL_ROOT_HOST='%' \
    MYSQL_USER=user \
    MYSQL_PASSWORD=password

RUN microdnf install findutils
