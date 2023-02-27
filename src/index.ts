import { DbSize } from "./core/db-size";
import { MockGenerator } from "./utils/mock-generator";

const data = MockGenerator.instance.getData("read/customer-orders", DbSize.small);
console.log(data);


// import { Db } from "./core/db";
// import { DbSize } from "./core/db-size";
// import { Framework } from "./core/framework";
// import { DATA_DIR } from "./core/global.const";
// import { IExec } from "./models/exec.model";
// import { CreateCustomer as CreateCustomerTest } from "./tests/create-customer";
// import { CreateProduct as CreateProductTest } from "./tests/create-product";
// import { MockGenerator } from "./utils/mock-generator";
// import { DbSeeder } from "./utils/db-seeder";
// import { FileWriter } from "./utils/file-writer";
// import { TestRunner } from "./utils/test-runner";
// import { Timeout } from "./utils/timeout";
// import exec from "child_process";

// function f(): IExec {
//     return {
//         exec: async () => {
//             console.log("f");
//         }
//     }
// }

// (async () => {
//     const dateString = new Date().toISOString().substring(0, 19).replace(/:/g, "-");


//     let currDb = Db.postgres;
//     let currFramework = Framework.prisma;

//     const restartDocker = async (): Promise<void> => {
//         return new Promise(r => {
//             console.log("compose down");
//             exec.execSync("cd C:\\workspace\\typeOrmTest && docker compose down");
//             console.log("compose up --build");
//             exec.execSync("cd C:\\workspace\\typeOrmTest && docker compose up --build -d");
//             setTimeout(() => {
//                 r();
//             }, 5000);

//         })
//     }

//     const run = async () => {
//         /**
//          * DB prefilled with 0 entities
//          */
//         await restartDocker();
//         FileWriter.setDir([DATA_DIR, currDb, currFramework, DbSize.small, dateString]);
//         await new TestRunner()
//             .register(new DbSeeder())
//             // .register(new Timeout(2))
//             // .register(new CreateCustomerTest())
//             // .register(new Timeout(2))
//             // .register(new CreateProductTest())
//             // .register(new Timeout(2))
//             .exec();
//         return;

//         /**
//          * DB prefilled with 500.000 entities
//          */
//         await restartDocker();
//         FileWriter.setDir([DATA_DIR, currDb, currFramework, DbSize.medium, dateString]);
//         await new TestRunner()
//             .register(new Timeout(2))
//             .register(new CreateCustomerTest())
//             .register(new Timeout(2))
//             .register(new CreateProductTest())
//             .register(new Timeout(2))
//             .exec();

//         /**
//          * DB prefilled with 1.000.000 entities
//          */
//         await restartDocker();
//         FileWriter.setDir([DATA_DIR, currDb, currFramework, DbSize.large, dateString]);
//         await new TestRunner()
//             .register(new Timeout(2))
//             .register(new CreateCustomerTest())
//             .register(new Timeout(2))
//             .register(new CreateProductTest())
//             .register(new Timeout(2))
//             .exec();
//     }
//     // for(let i = 0; i < 3; i++) {
//     //     if(i == 0) {
//     //         currDb = Db.postgres;
//     //     } else if(i == 1) {
//     //         currDb = Db.mysql;
//     //     } else if(i == 2) {
//     //         currDb = Db.mssql;
//     //     }
//     //     for(let i = 0; i < 3; i++) {
//     //         if(i == 0) {
//     //             currFramework = Framework.prisma;
//     //         } else if(i == 1) {
//     //             currFramework = Framework.typeORM;
//     //         } else if(i == 2) {
//     //             currFramework = Framework.sequelize;
//     //         }
//     //         await run();
//     //     }
//     // }

//     await run()
// })();
