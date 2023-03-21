import fs from "fs";
import { DbSize } from "../core/db-size";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../core/global.const";
import { calcProductCategoriesSize } from "../functions/calc-product-categories-size.function";
import { createTestData } from "@core/functions/create-test-data.function";
import { Test } from "src/models/test.model";

function createFileName(prefix, size: DbSize) {
    return `${prefix}-${size}.json`;
}

type ITest = { fileName: string, fn: () => any };
type TestRegistry = ITest[];

type CreateProduct = "create/product";
type CreateCustomerWithAddress = "create/customer-with-address";
type CreateOrder = "create/order";
type ReadProductsFromCategory = "read/products-from-category";
type ReadCustomerOrders = "read/customer-orders";
type ReadCustomerProducts = "read/customer-products";
type UpdateCustomerPhoneNumber = "update/customer-phone-number";
type UpdateProductCategoryName = "update/product-category-name";
type DeleteCustomer = "delete/customer";
type DeleteOrder = "delete/order";
type BulkCreateCustomers = "create/bulk-customers";

type TestName = CreateProduct | CreateCustomerWithAddress | CreateOrder | ReadProductsFromCategory | ReadCustomerOrders | ReadCustomerProducts | UpdateCustomerPhoneNumber | UpdateProductCategoryName | DeleteCustomer | DeleteOrder | BulkCreateCustomers;


const testFileNames = {
    create: {
        product: "create/product",
        customerWithAddress: "create/customer-with-address",
        order: "create/order"
    },
    read: {
        productsFromCategory: "read/products-from-category",
        customerOrders: "read/customer-orders",
        customerProducts: "read/customer-products",
    },
    update: {
        customerPhoneNumber: "update/customer-phone-number",
        productCategoryName: "update/product-category-name",
    },
    delete: {
        customer: "delete/customer",
        order: "delete/order",
    },
    bulk: {
        create: "bulk/customers",
    }
}

const testDataRegistry: TestRegistry = [
    /**
     * CREATE products
     */
    {
        fileName: createFileName(testFileNames.create.product, DbSize.small),
        fn: () => createTestData.create.products(AMOUNT_OF_TEST_EXECUTIONS)
    },
    {
        fileName: createFileName(testFileNames.create.product, DbSize.medium),
        fn: () => createTestData.create.products(AMOUNT_OF_TEST_EXECUTIONS)
    },
    {
        fileName: createFileName(testFileNames.create.product, DbSize.large),
        fn: () => createTestData.create.products(AMOUNT_OF_TEST_EXECUTIONS)
    },
    /**
     * CREATE customers with addresses
     */
    {
        fileName: createFileName(testFileNames.create.customerWithAddress, DbSize.small),
        fn: () => createTestData.create.customersWithAddress(AMOUNT_OF_TEST_EXECUTIONS)
    },
    {
        fileName: createFileName(testFileNames.create.customerWithAddress, DbSize.medium),
        fn: () => createTestData.create.customersWithAddress(AMOUNT_OF_TEST_EXECUTIONS)
    },
    {
        fileName: createFileName(testFileNames.create.customerWithAddress, DbSize.large),
        fn: () => createTestData.create.customersWithAddress(AMOUNT_OF_TEST_EXECUTIONS)
    },
    /**
     * CREATE orders
     */
    {
        fileName: createFileName(testFileNames.create.order, DbSize.small),
        fn: () => createTestData.create.orders(AMOUNT_OF_TEST_EXECUTIONS, DbSize.small, DbSize.small)
    },
    {
        fileName: createFileName(testFileNames.create.order, DbSize.medium),
        fn: () => createTestData.create.orders(AMOUNT_OF_TEST_EXECUTIONS, DbSize.medium, DbSize.medium)
    },
    {
        fileName: createFileName(testFileNames.create.order, DbSize.large),
        fn: () => createTestData.create.orders(AMOUNT_OF_TEST_EXECUTIONS, DbSize.large, DbSize.large)
    },
    /**
     * READ products from category
     */
    {
        fileName: createFileName(testFileNames.read.productsFromCategory, DbSize.small),
        fn: () => createTestData.read.categoryNames(AMOUNT_OF_TEST_EXECUTIONS, calcProductCategoriesSize(DbSize.small))
    },
    {
        fileName: createFileName(testFileNames.read.productsFromCategory, DbSize.medium),
        fn: () => createTestData.read.categoryNames(AMOUNT_OF_TEST_EXECUTIONS, calcProductCategoriesSize(DbSize.medium))
    },
    {
        fileName: createFileName(testFileNames.read.productsFromCategory, DbSize.large),
        fn: () => createTestData.read.categoryNames(AMOUNT_OF_TEST_EXECUTIONS, calcProductCategoriesSize(DbSize.large))
    },
    /**
     * READ customer orders
     */
    {
        fileName: createFileName(testFileNames.read.customerOrders, DbSize.small),
        fn: () => createTestData.read.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.small)
    },
    {
        fileName: createFileName(testFileNames.read.customerOrders, DbSize.medium),
        fn: () => createTestData.read.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.medium)
    },
    {
        fileName: createFileName(testFileNames.read.customerOrders, DbSize.large),
        fn: () => createTestData.read.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.large)
    },
    /**
     * READ customer products
     */
    {
        fileName: createFileName(testFileNames.read.customerProducts, DbSize.small),
        fn: () => createTestData.read.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.small)
    },
    {
        fileName: createFileName(testFileNames.read.customerProducts, DbSize.medium),
        fn: () => createTestData.read.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.medium)
    },
    {
        fileName: createFileName(testFileNames.read.customerProducts, DbSize.large),
        fn: () => createTestData.read.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.large)
    },
    /**
     * UPDATE phone number
     */
    {
        fileName: createFileName(testFileNames.update.customerPhoneNumber, DbSize.small),
        fn: () => createTestData.update.customers(AMOUNT_OF_TEST_EXECUTIONS, DbSize.small)
    },
    {
        fileName: createFileName(testFileNames.update.customerPhoneNumber, DbSize.medium),
        fn: () => createTestData.update.customers(AMOUNT_OF_TEST_EXECUTIONS, DbSize.medium)
    },
    {
        fileName: createFileName(testFileNames.update.customerPhoneNumber, DbSize.large),
        fn: () => createTestData.update.customers(AMOUNT_OF_TEST_EXECUTIONS, DbSize.large)
    },
    /**
     * UPDATE product category
     */
    {
        fileName: createFileName(testFileNames.update.productCategoryName, DbSize.small),
        fn: () => createTestData.update.productCategories(AMOUNT_OF_TEST_EXECUTIONS, calcProductCategoriesSize(DbSize.small))
    },
    {
        fileName: createFileName(testFileNames.update.productCategoryName, DbSize.medium),
        fn: () => createTestData.update.productCategories(AMOUNT_OF_TEST_EXECUTIONS, calcProductCategoriesSize(DbSize.medium))
    },
    {
        fileName: createFileName(testFileNames.update.productCategoryName, DbSize.large),
        fn: () => createTestData.update.productCategories(AMOUNT_OF_TEST_EXECUTIONS, calcProductCategoriesSize(DbSize.large))
    },
    /**
     * DELETE customers
     */
    {
        fileName: createFileName(testFileNames.delete.customer, DbSize.small),
        fn: () => createTestData.delete.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.small)
    },
    {
        fileName: createFileName(testFileNames.delete.customer, DbSize.medium),
        fn: () => createTestData.delete.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.medium)
    },
    {
        fileName: createFileName(testFileNames.delete.customer, DbSize.large),
        fn: () => createTestData.delete.customerIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.large)
    },
    /**
     * DELETE orders
     */
    {
        fileName: createFileName(testFileNames.delete.order, DbSize.small),
        fn: () => createTestData.delete.orderIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.small)
    },
    {
        fileName: createFileName(testFileNames.delete.order, DbSize.medium),
        fn: () => createTestData.delete.orderIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.medium)
    },
    {
        fileName: createFileName(testFileNames.delete.order, DbSize.large),
        fn: () => createTestData.delete.orderIds(AMOUNT_OF_TEST_EXECUTIONS, DbSize.large)
    }
];


export class DataStorage {
    static #instance: DataStorage | undefined;

    private constructor() { }

    static get instance() {
        if (!this.#instance) {
            this.#instance = new DataStorage();
        }
        return this.#instance;
    }

    add(value: Test<any> | Test<any>[]) {
        if (Array.isArray(value)) {
            value.forEach((v) => this.add(v));
        } else {
            const path = value.getDataPath();

            if (!fs.existsSync(path)) {
                console.log("Creating data for " + value.name, path);
                const data = value.createData();
                this.createDirs(path);
                this.createJSON(path, data);
            }
        }
    }

    createJSON(path: string, data: any) {
        fs.writeFileSync(path, JSON.stringify(data));
    }

    get(test: Test<any>) {
        return this.readJSON(test.getDataPath());
    }

    readJSON(path: string) {
        return JSON.parse(fs.readFileSync(path, "utf-8"))
    }

    createDirs(path: string) {
        const paths = path.split("/");
        let currPath = "";

        paths.forEach((path, i) => {
            if (i !== paths.length - 1) {
                currPath += path + "/";
                if (!fs.existsSync(currPath)) {
                    fs.mkdirSync(currPath);
                }
            }
        });
    }
}