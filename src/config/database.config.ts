import { UserEntity } from "src/users/entities/user.entity";


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
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'nest',
    entities:[UserEntity],
    synchronize: true,
    logging: true,
  });