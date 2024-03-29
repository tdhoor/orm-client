import { DockerStrategy } from "../models/docker-strategy.model";

export class DockerService {
    curr: DockerStrategy;

    setStrategy(strategy: DockerStrategy): void {
        this.curr = strategy;
    }

    composeUp(): Promise<void> {
        return this.curr.composeUp();
    }

    composeDown(): Promise<void> {
        return this.curr.composeDown();
    }
}