import type { Dialect } from "sequelize";

export interface DBConfig {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  schema?: string;
  dialect: Dialect;
  logging?: boolean;
  use_env_variable?: string;
  pool?: any;
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

const dbConfig: Record<"development" | "test" | "production", DBConfig> = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    schema: process.env.DB_SCHEMA,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    schema: process.env.DB_SCHEMA,
    dialect: "postgres",
    logging: false,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    // schema: process.env.DB_SCHEMA,
    dialect: "postgres",
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

export default dbConfig;
