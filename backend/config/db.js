import pg from 'pg';
import { DataSource } from 'typeorm';
import { User } from '../entity/User.js';
import { Role } from '../entity/Role.js';
import Firearm from '../entity/Firearm.js';
import Exhibit from '../entity/Exhibit.js';
import FirearmExampleImage from '../entity/FirearmExampleImage.js';
import History from '../entity/History.js';
import dotenv from 'dotenv';

dotenv.config();
const { Client } = pg;

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Role, Firearm, Exhibit, FirearmExampleImage, History],
});

export async function connectToDatabase() {
    try {
        await client.connect();
        await AppDataSource.initialize();
        console.log('Connected to Neon Database (pg & TypeORM)');
    } catch (error) {
        console.error('Error connecting to Neon Database:', error.message, error.stack);
        process.exit(1);
    }
}

export { client, AppDataSource };