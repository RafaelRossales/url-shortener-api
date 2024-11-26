#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "api-manager";
    CREATE USER postgres WITH PASSWORD 'example';
    GRANT ALL PRIVILEGES ON DATABASE "api-manager" TO postgres;
EOSQL