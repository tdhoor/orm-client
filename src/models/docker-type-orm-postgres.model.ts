import exec from "child_process";
import { DockerStrategy } from "./docker-strategy.model";

export class DockerTypeOrmPostgres extends DockerStrategy {
    composeUp(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd C:\\workspace\\orm\\orm-backend-typeorm && docker compose up --build -d`);
        })
    }

    composeDown(): Promise<void> {
        return this.toPromiseWithDelay(() => {
            exec.execSync(`cd C:\\workspace\\orm\\orm-backend-typeorm && docker compose down`);
        }, 20000)
    }
}
