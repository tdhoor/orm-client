export class ApiHttpClient {
    readonly #api = "http://localhost:3000/api/";

    static #instance: ApiHttpClient | undefined;

    private constructor() {
    }

    static get instance(): ApiHttpClient {
        if (!this.#instance) {
            this.#instance = new ApiHttpClient();
        }
        return this.#instance;
    }

    async post(endpoint: string, body: any): Promise<any> {
        try {
            const response = await fetch(this.#api + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            return await response.json();
        } catch (error) {
            console.error("post error", error);
        }
    }

    async get(endpoint: string): Promise<any> {
        try {
            const response = await fetch(this.#api + endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error("get error", error);
        }
    }

    async put(endpoint: string, body: any): Promise<any> {
        try {
            const response = await fetch(this.#api + endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            return await response.json();
        } catch (error) {
            console.error("put error", error);
        }
    }

    async delete(endpoint: string): Promise<any> {
        try {
            const response = await fetch(this.#api + endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error("delete error", error);
        }
    }
}