import dotenv from "dotenv";

interface Config {
  env: string;
  port: number;
  mongodbUri: string;
}

dotenv.config();

const env = process.env.NODE_ENV || "development";

const commonConfig: Config = {
  env,
  port: parseInt(process.env.PORT || "3000", 10),
  mongodbUri: process.env.MONGODB_URI || "",
};

const developmentConfig: Partial<Config> = {
  mongodbUri: process.env.MONGODB_URI,
};

const productionConfig: Partial<Config> = {};

const stagingConfig: Partial<Config> = {};

let envConfig: Partial<Config> = {};

switch (env) {
  case "development":
    envConfig = developmentConfig;
    break;
  case "production":
    envConfig = productionConfig;
    break;
  case "staging":
    envConfig = stagingConfig;
    break;
}

const Config: Config = { ...commonConfig, ...envConfig } as Config;

export default Config;
