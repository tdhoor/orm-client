import exec from "child_process";
import { DockerStrategy } from "./docker-strategy.model";
import { PATH_TO_TYPEORM_PROJECT } from "../core/global.const";

export class DockerTypeOrmPostgres extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_TYPEORM_PROJECT} && git checkout postgres && docker compose up --build -d`);
        })
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_TYPEORM_PROJECT} && docker compose down`);
        })
    }
}

export class DockerTypeOrmMssql extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_TYPEORM_PROJECT} && git checkout mssql && docker compose up --build -d`);
        })
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_TYPEORM_PROJECT} && docker compose down`);
        })
    }
}

export class DockerTypeOrmMysql extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_TYPEORM_PROJECT} && git checkout mysql && docker compose up --build -d`);
        })
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_TYPEORM_PROJECT} && docker compose down`);
        })
    }
}
