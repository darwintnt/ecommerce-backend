import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../../database/migrations/**/*{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    autoLoadEntities: true,
  };
});
