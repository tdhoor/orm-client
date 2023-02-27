import path from "path";
import { ROOT_DIR } from "../../root-dir";

export const AMOUNT_OF_TEST_EXECUTIONS = 3;

export const API_URL = "http://localhost:5001";

export const DATA_DIR = path.join(ROOT_DIR, "data");

export const MOCK_DIR = path.join(ROOT_DIR, "mock");

export const MOCK_ADDRESS_FILE = path.join(MOCK_DIR, "addresses.json");

export const MOCK_CUSTOMER_FILE = path.join(MOCK_DIR, "customers.json");

export const MOCK_ORDER_FILE = path.join(MOCK_DIR, "orders.json");

export const MOCK_ORDER_ITEM_FILE = path.join(MOCK_DIR, "order-items.json");

export const MOCK_PRODUCT_FILE = path.join(MOCK_DIR, "products.json");

export const MOCK_PRODUCT_CATEGORY_FILE = path.join(MOCK_DIR, "product-categories.json");

