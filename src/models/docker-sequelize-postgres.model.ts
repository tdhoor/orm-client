import exec from "child_process";
import { DockerStrategy } from "../models/docker-strategy.model";

export class DockerSequelizePostgres extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd C:\\workspace\\orm\\orm-backend-sequelize && docker compose up --build -d`);
        }, 20000);
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd C:\\workspace\\orm\\orm-backend-sequelize && docker compose down`);
        }, 20000)
    }
}
