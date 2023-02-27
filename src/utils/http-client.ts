export class HttpClient {
    static readonly api = "http://localhost:3000/api/";

    static async post(url: string, body: any): Promise<any> {
        const response = await fetch(this.api + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    }

    static async get(url: string): Promise<any> {
        const response = await fetch(this.api + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    }

    static async put(url: string, body: any): Promise<any> {
        const response = await fetch(this.api + url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    }

    static async delete(url: string): Promise<any> {
        const response = await fetch(this.api + url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    }
}