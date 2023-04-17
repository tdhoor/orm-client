import { DOCKER_TIMEOUT } from '../core/global.const';

export abstract class DockerStrategy {
    abstract composeUp(): Promise<void>;
    abstract composeDown(): Promise<void>;

    toPromiseWithDelay(fn: () => void, delayInMs = DOCKER_TIMEOUT): Promise<void> {
        return new Promise(r => {
            fn();
            setTimeout(() => {
                r();
            }, delayInMs);
        })
    }
}