import exec from "child_process";
import { DockerStrategy } from "../models/docker-strategy.model";
import { PATH_TO_SEQUELIZE_PROJECT } from "../core/global.const";

export class DockerSequelizePostgres extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_SEQUELIZE_PROJECT} && git checkout postgres && docker compose up --build -d`);
        });
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_SEQUELIZE_PROJECT} && docker compose down`);
        })
    }
}


export class DockerSequelizeMssql extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_SEQUELIZE_PROJECT} && git checkout mssql && docker compose up --build -d`);
        });
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_SEQUELIZE_PROJECT} && docker compose down`);
        })
    }
}


export class DockerSequelizeMysql extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_SEQUELIZE_PROJECT} && git checkout mysql && docker compose up --build -d`);
        });
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_SEQUELIZE_PROJECT} && docker compose down`);
        })
    }
}
