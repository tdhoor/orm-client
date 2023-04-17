/**
 * Result configs
 */
export const DATA_DIR = "data";
export const RESULT_DIR = "result";
export const CSV_SEPARATOR = ";";
/**
 * Test configs
 */
export const AMOUNT_OF_TEST_EXECUTIONS = 1000;
export const AMOUNT_OF_BULK_ENTRIES = 10000;
export const TEST_TIMEOUT = 10 * 1000; // 10 seconds
export const DOCKER_TIMEOUT = 60 * 1000; // 1 minute

/**
 * API configs (backend)
 */
export const API_URL = "http://localhost:3000/api/";
export const MAX_REQUEST_TIMEOUT = 15 * 60 * 1000; // 15 minutes
/**
 * Projects configs (backend)
 */
export const PATH_TO_PRISMA_PROJECT = "C:\\workspace\\orm\\orm-backend-prisma";
export const PATH_TO_SEQUELIZE_PROJECT = "C:\\workspace\\orm\\orm-backend-sequelize";
export const PATH_TO_TYPEORM_PROJECT = "C:\\workspace\\orm\\orm-backend-typeorm";