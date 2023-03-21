import { DbSize } from "./core/db-size";
import { Db } from "./core/db";
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
import { DockerTypeOrmPostgres } from "./models/docker-type-orm-postgres.model";
import { DockerPrismaPostgres } from "./models/docker-prisma-postgres.model";
import { DockerSequelizePostgres } from "./models/docker-sequelize-postgres.model";
import { ReadProduct } from "./tests/read/read-product";
import { CreateCustomerBulk } from "./tests/create/create-customer-bulk";

(async () => {
    const dockerManager = new DockerService();

    const fn = async (type: (new () => DockerStrategy), currDb: Db, currFramework: Framework) => {
        DbSeeder.instance.reset();
        dockerManager.set(new type());

        let configSmall = { db: currDb, framework: currFramework, dbSize: DbSize.small };
        let configMedium = { db: currDb, framework: currFramework, dbSize: DbSize.medium };
        let configLarge = { db: currDb, framework: currFramework, dbSize: DbSize.large };

        const testRegistry = {
            createCustomerBulkSmall: new CreateCustomerBulk(configSmall),
            createCustomerBulkMedium: new CreateCustomerBulk(configMedium),
            createCustomerBulkLarge: new CreateCustomerBulk(configLarge),

            createProductSmall: new CreateProduct(configSmall),
            createProductMedium: new CreateProduct(configMedium),
            createProductLarge: new CreateProduct(configLarge),

            createCustomerWithAddressSmall: new CreateCustomerWithAddress(configSmall),
            createCustomerWithAddressMedium: new CreateCustomerWithAddress(configMedium),
            createCustomerWithAddressLarge: new CreateCustomerWithAddress(configLarge),

            createOrderSmall: new CreateOrder(configSmall),
            createOrderMedium: new CreateOrder(configMedium),
            createOrderLarge: new CreateOrder(configLarge),

            readProductsSmall: new ReadProduct(configSmall),
            readProductsMedium: new ReadProduct(configMedium),
            readProductsLarge: new ReadProduct(configLarge),

            readCustomerOrdersSmall: new ReadCustomerOrders(configSmall),
            readCustomerOrdersMedium: new ReadCustomerOrders(configMedium),
            readCustomerOrdersLarge: new ReadCustomerOrders(configLarge),

            readCustomerProductsSmall: new ReadCustomerProducts(configSmall),
            readCustomerProductsMedium: new ReadCustomerProducts(configMedium),
            readCustomerProductsLarge: new ReadCustomerProducts(configLarge),

            readProductsFromCategorySmall: new ReadProductsFromCategory(configSmall),
            readProductsFromCategoryMedium: new ReadProductsFromCategory(configMedium),
            readProductsFromCategoryLarge: new ReadProductsFromCategory(configLarge),

            updateCustomerPhoneNumberSmall: new UpdateCustomerPhoneNumber(configSmall),
            updateCustomerPhoneNumberMedium: new UpdateCustomerPhoneNumber(configMedium),
            updateCustomerPhoneNumberLarge: new UpdateCustomerPhoneNumber(configLarge),

            updateProductCategoryNameSmall: new UpdateProductCategoryName(configSmall),
            updateProductCategoryNameMedium: new UpdateProductCategoryName(configMedium),
            updateProductCategoryNameLarge: new UpdateProductCategoryName(configLarge),

            deleteCustomerSmall: new DeleteCustomer(configSmall),
            deleteCustomerMedium: new DeleteCustomer(configMedium),
            deleteCustomerLarge: new DeleteCustomer(configLarge),

            deleteOrderSmall: new DeleteOrder(configSmall),
            deleteOrderMedium: new DeleteOrder(configMedium),
            deleteOrderLarge: new DeleteOrder(configLarge)
        };

        const sorted = Object.values(testRegistry).sort((a, b) => a.dbSize - b.dbSize);
        DataStorage.instance.add(sorted);

        await dockerManager.composeUp();

        const testRunner = new TestRunner();
        testRunner.register(sorted);

        await testRunner.exec();
        await dockerManager.composeDown();
    }

    await fn(DockerTypeOrmPostgres, Db.postgres, Framework.typeORM);
    await fn(DockerPrismaPostgres, Db.postgres, Framework.prisma);
    await fn(DockerSequelizePostgres, Db.postgres, Framework.sequelize);

    return;

})();
