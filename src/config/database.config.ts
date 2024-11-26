import { UrlEntity } from "src/modules/urls/entities/url.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";


interface DatabaseConfig {
    type: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mongodb' | 'oracle' | 'mssql';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize?: boolean;
    logging?: boolean;
    entities:any[]
  }

export const databaseConfig = ():DatabaseConfig => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'user',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'nest',
    entities:[UserEntity, UrlEntity],
    synchronize: true,
    logging: true,
  });