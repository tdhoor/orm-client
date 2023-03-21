export abstract class DockerStrategy {
    abstract composeUp(): Promise<void>;
    abstract composeDown(): Promise<void>;

    toPromiseWithDelay(fn: () => void, delayInMs = 15000): Promise<void> {
        return new Promise(r => {
            fn();
            setTimeout(() => {
                r();
            }, delayInMs);
        })
    }
}