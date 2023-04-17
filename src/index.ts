import { Db } from "./core/db";
import { DbSize } from "./core/db-size";
import { Framework } from "./core/framework";
import { TestRunner } from "./utils/test-runner";
import { DataStorage } from "./utils/data-storage";
import { CreateCustomerWithAddress } from "./tests/create/create-customer-with-address";
import { CreateOrder } from "./tests/create/create-order";
import { CreateProduct } from "./tests/create/create-product";
import { ReadCustomerOrders } from "./tests/read/read-customer-orders";
import { ReadCustomerProducts } from "./tests/read/read-customer-products";
import { UpdateCustomerPhoneNumber } from "./tests/update/update-customer-phone-number";
import { UpdateProductCategoryName } from "./tests/update/update-category-name";
import { DeleteCustomer } from "./tests/delete/delete-customer";
import { DeleteOrder } from "./tests/delete/delete-order";
import { DbSeeder } from "./utils/db-seeder";
import { ReadProductsFromCategory } from "./tests/read/read-products-from-category";
import { DockerService } from "./utils/docker.service";
import { DockerStrategy } from "./models/docker-strategy.model";
import { DockerTypeOrmMssql, DockerTypeOrmMysql, DockerTypeOrmPostgres } from "./models/docker-type-orm-postgres.model";
import { DockerPrismaMssql, DockerPrismaMysql, DockerPrismaPostgres } from "./models/docker-prisma-postgres.model";
import { DockerSequelizeMssql, DockerSequelizeMysql, DockerSequelizePostgres } from "./models/docker-sequelize-postgres.model";
import { ReadProduct } from "./tests/read/read-product";
import { CreateCustomerBulk } from "./tests/create/create-customer-bulk";


(async () => {
    const dockerManager = new DockerService();

    const runTestFor = async (type: (new () => DockerStrategy), db: Db, framework: Framework) => {
        DbSeeder.instance.reset();
        dockerManager.set(new type());

        const configSmall = { db, framework, dbSize: DbSize.small };
        const configMedium = { db, framework, dbSize: DbSize.medium };
        const configLarge = { db, framework, dbSize: DbSize.large };

        const small = {
            createProductSmall: new CreateProduct(configSmall),
            createCustomerWithAddressSmall: new CreateCustomerWithAddress(configSmall),
            createOrderSmall: new CreateOrder(configSmall),
            readProductsSmall: new ReadProduct(configSmall),
            readCustomerOrdersSmall: new ReadCustomerOrders(configSmall),
            readCustomerProductsSmall: new ReadCustomerProducts(configSmall),
            readProductsFromCategorySmall: new ReadProductsFromCategory(configSmall),
            updateCustomerPhoneNumberSmall: new UpdateCustomerPhoneNumber(configSmall),
            updateProductCategoryNameSmall: new UpdateProductCategoryName(configSmall),
            deleteCustomerSmall: new DeleteCustomer(configSmall),
            deleteOrderSmall: new DeleteOrder(configSmall),
            createCustomerBulkSmall: new CreateCustomerBulk(configSmall),
        }

        const medium = {
            createProductMedium: new CreateProduct(configMedium),
            createCustomerWithAddressMedium: new CreateCustomerWithAddress(configMedium),
            createOrderMedium: new CreateOrder(configMedium),
            readProductsMedium: new ReadProduct(configMedium),
            readCustomerOrdersMedium: new ReadCustomerOrders(configMedium),
            readCustomerProductsMedium: new ReadCustomerProducts(configMedium),
            readProductsFromCategoryMedium: new ReadProductsFromCategory(configMedium),
            updateCustomerPhoneNumberMedium: new UpdateCustomerPhoneNumber(configMedium),
            updateProductCategoryNameMedium: new UpdateProductCategoryName(configMedium),
            deleteCustomerMedium: new DeleteCustomer(configMedium),
            deleteOrderMedium: new DeleteOrder(configMedium),
            createCustomerBulkMedium: new CreateCustomerBulk(configMedium),
        }

        const large = {
            createProductLarge: new CreateProduct(configLarge),
            createCustomerWithAddressLarge: new CreateCustomerWithAddress(configLarge),
            createOrderLarge: new CreateOrder(configLarge),
            readProductsLarge: new ReadProduct(configLarge),
            readCustomerOrdersLarge: new ReadCustomerOrders(configLarge),
            readCustomerProductsLarge: new ReadCustomerProducts(configLarge),
            readProductsFromCategoryLarge: new ReadProductsFromCategory(configLarge),
            updateCustomerPhoneNumberLarge: new UpdateCustomerPhoneNumber(configLarge),
            updateProductCategoryNameLarge: new UpdateProductCategoryName(configLarge),
            deleteCustomerLarge: new DeleteCustomer(configLarge),
            deleteOrderLarge: new DeleteOrder(configLarge),
            createCustomerBulkLarge: new CreateCustomerBulk(configLarge)
        };

        /**
         * Create tests for each db size
         */
        const testRegistry = { ...small, ...medium, ...large };
        const testRegistryBySize = Object.values(testRegistry).sort((a, b) => a.dbSize - b.dbSize);
        /**
         * Created test data (localted in ./data) for each db size
         */
        DataStorage.instance.add(testRegistryBySize);
        /**
         * Start docker containers
         */
        await dockerManager.composeUp();
        /**
         * Run all tests
         */
        const runner = await new TestRunner();
        runner.register(testRegistryBySize).exec();
        /**
         * Stop docker containers
         */
        await dockerManager.composeDown();
    }

    /**
     * Run tests for each db and framework
     */
    await runTestFor(DockerPrismaPostgres, Db.postgres, Framework.prisma);
    await runTestFor(DockerPrismaMysql, Db.mysql, Framework.prisma);
    await runTestFor(DockerPrismaMssql, Db.mssql, Framework.prisma);

    await runTestFor(DockerTypeOrmPostgres, Db.postgres, Framework.typeORM);
    await runTestFor(DockerTypeOrmMysql, Db.mysql, Framework.typeORM);
    await runTestFor(DockerTypeOrmMssql, Db.mssql, Framework.typeORM);

    await runTestFor(DockerSequelizePostgres, Db.postgres, Framework.sequelize);
    await runTestFor(DockerSequelizeMysql, Db.mysql, Framework.sequelize);
    await runTestFor(DockerSequelizeMssql, Db.mssql, Framework.sequelize);
    return;
})();
