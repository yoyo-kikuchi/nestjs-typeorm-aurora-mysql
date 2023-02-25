GRANT ALL PRIVILEGES ON *.* TO 'user'@'%';

-- Create for replication
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

