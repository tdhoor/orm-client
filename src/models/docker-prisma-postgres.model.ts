import exec from "child_process";
import { DockerStrategy } from "../models/docker-strategy.model";
import { PATH_TO_PRISMA_PROJECT } from "../core/global.const";

export class DockerPrismaPostgres extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_PRISMA_PROJECT} && git checkout postgres && docker compose up --build -d`);
        });
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_PRISMA_PROJECT} && docker compose down`);
        })
    }
}


export class DockerPrismaMssql extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_PRISMA_PROJECT} && git checkout mssql && docker compose up --build -d`);
        });
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_PRISMA_PROJECT} && docker compose down`);
        })
    }
}


export class DockerPrismaMysql extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_PRISMA_PROJECT} && git checkout mysql && docker compose up --build -d`);
        });
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd ${PATH_TO_PRISMA_PROJECT} && docker compose down`);
        })
    }
}
