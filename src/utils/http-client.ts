export class HttpClient {
    readonly #api = "http://localhost:3000/api/";

    static #instance: HttpClient | undefined;

    private constructor() {
    }

    static get instance(): HttpClient {
        if (!this.#instance) {
            this.#instance = new HttpClient();
        }
        return this.#instance;
    }

    async post(url: string, body: any): Promise<any> {
        const response = await fetch(this.#api + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    }

    async get(url: string): Promise<any> {
        const response = await fetch(this.#api + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    }

    async put(url: string, body: any): Promise<any> {
        const response = await fetch(this.#api + url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    }

    async delete(url: string): Promise<any> {
        const response = await fetch(this.#api + url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    }
}