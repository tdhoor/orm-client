import exec from "child_process";
import { DockerStrategy } from "../models/docker-strategy.model";

export class DockerPrismaPostgres extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd C:\\workspace\\orm\\orm-backend-prisma && docker compose up --build -d`);
        });
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd C:\\workspace\\orm\\orm-backend-prisma && docker compose down`);
        }, 20000)
    }
}
