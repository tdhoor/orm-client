import { Db } from "./core/db";
import { DbSize } from "./core/db-size";
import { Framework } from "./core/framework";
import { TestRunner } from "./utils/test-runner";
import { CreateCustomerWithAddress } from "./tests/create/create-customer-with-address";
import { CreateOrder } from "./tests/create/create-order";
import { CreateProduct } from "./tests/create/create-product";
import { ReadCustomerOrders } from "./tests/read/read-customer-orders";
import { ReadCustomerProducts } from "./tests/read/read-customer-products";
import { UpdateCustomerPhoneNumber } from "./tests/update/update-customer-phone-number";
import { UpdateProductCategoryName } from "./tests/update/update-category-name";
import { DeleteCustomer } from "./tests/delete/delete-customer";
import { DeleteOrder } from "./tests/delete/delete-order";
import { DbSeederService } from "./utils/db-seeder.service";
import { ReadProductsFromCategory } from "./tests/read/read-products-from-category";
import { DockerService } from "./utils/docker.service";
import { DockerStrategy } from "./models/docker-strategy.model";
import { DockerTypeOrmMssql, DockerTypeOrmMysql, DockerTypeOrmPostgres } from "./models/docker-type-orm-postgres.model";
import { DockerPrismaMssql, DockerPrismaMysql, DockerPrismaPostgres } from "./models/docker-prisma-postgres.model";
import { DockerSequelizeMssql, DockerSequelizeMysql, DockerSequelizePostgres } from "./models/docker-sequelize-postgres.model";
import { ReadProduct } from "./tests/read/read-product";
import { CreateCustomerBulk } from "./tests/create/create-customer-bulk";
import { MockDataService } from "./utils/mock-data.service";


(async () => {
    const dockerService = new DockerService();

    const runTestFor = async (type: (new () => DockerStrategy), db: Db, framework: Framework) => {
        DbSeederService.instance.resetDbSeederService();
        dockerService.setStrategy(new type());

        const configSmall = { db, framework, dbSize: DbSize.small };
        const configMedium = { db, framework, dbSize: DbSize.medium };
        const configLarge = { db, framework, dbSize: DbSize.large };

        const tests = [
            new CreateProduct(configSmall),
            new CreateCustomerWithAddress(configSmall),
            new CreateOrder(configSmall),
            new ReadProduct(configSmall),
            new ReadCustomerOrders(configSmall),
            new ReadCustomerProducts(configSmall),
            new ReadProductsFromCategory(configSmall),
            new UpdateCustomerPhoneNumber(configSmall),
            new UpdateProductCategoryName(configSmall),
            new DeleteCustomer(configSmall),
            new DeleteOrder(configSmall),
            new CreateCustomerBulk(configSmall),

            new CreateProduct(configMedium),
            new CreateCustomerWithAddress(configMedium),
            new CreateOrder(configMedium),
            new ReadProduct(configMedium),
            new ReadCustomerOrders(configMedium),
            new ReadCustomerProducts(configMedium),
            new ReadProductsFromCategory(configMedium),
            new UpdateCustomerPhoneNumber(configMedium),
            new UpdateProductCategoryName(configMedium),
            new DeleteCustomer(configMedium),
            new DeleteOrder(configMedium),
            new CreateCustomerBulk(configMedium),

            new CreateProduct(configLarge),
            new CreateCustomerWithAddress(configLarge),
            new CreateOrder(configLarge),
            new ReadProduct(configLarge),
            new ReadCustomerOrders(configLarge),
            new ReadCustomerProducts(configLarge),
            new ReadProductsFromCategory(configLarge),
            new UpdateCustomerPhoneNumber(configLarge),
            new UpdateProductCategoryName(configLarge),
            new DeleteCustomer(configLarge),
            new DeleteOrder(configLarge),
            new CreateCustomerBulk(configLarge)
        ];

        /**
         * Created test data (localted in ./data) for each db size
         */
        MockDataService.instance.createAndSaveMockData(tests);
        /**
         * Start docker containers
         */
        await dockerService.composeUp();
        /**
         * Run all tests
         */
        const runner = new TestRunner(tests);
        await runner.exec();
        /**
         * Stop docker containers
         */
        await dockerService.composeDown();
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
