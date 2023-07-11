import fetch from "node-fetch";
import { TestResultResponse } from "@core/models/test-result-response.model";
import { API_URL, MAX_REQUEST_TIMEOUT } from "../core/global.const";

export class ApiHttpClient {
    readonly #api: string;

    private static _instance: ApiHttpClient | undefined;

    private constructor() {
        this.#api = API_URL.endsWith("/") ? API_URL : API_URL + "/";
    }

    static get instance(): ApiHttpClient {
        if (!ApiHttpClient._instance) {
            ApiHttpClient._instance = new ApiHttpClient();
        }
        return ApiHttpClient._instance;
    }

    async post<T>(endpoint: string, body: any): Promise<TestResultResponse<T> & { status: number }> {
        try {
            const response = await fetch(this.#api + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: MAX_REQUEST_TIMEOUT,
                body: JSON.stringify(body)
            });
            const json = await response.json() as any;
            return {
                ...json,
                status: response.status
            }
        } catch (error) {
            console.error("post error", error);
        }
    }

    async get<T>(endpoint: string): Promise<TestResultResponse<T> & { status: number }> {
        try {
            const response = await fetch(this.#api + endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: MAX_REQUEST_TIMEOUT
            });
            const json = await response.json() as any;
            return {
                ...json,
                status: response?.status
            }
        } catch (error) {
            console.error("get error", error);
        }
    }

    async put<T>(endpoint: string, body: any): Promise<TestResultResponse<T> & { status: number }> {
        try {
            const response = await fetch(this.#api + endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: MAX_REQUEST_TIMEOUT,
                body: JSON.stringify(body)
            });
            const json = await response.json() as any;
            return {
                ...json,
                status: response.status
            }
        } catch (error) {
            console.error("put error", error);
        }
    }

    async delete(endpoint: string): Promise<TestResultResponse<any> & { status: number }> {
        try {
            const response = await fetch(this.#api + endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: MAX_REQUEST_TIMEOUT
            });
            const json = await response.json() as any;
            return {
                ...json,
                status: response.status
            }
        } catch (error) {
            console.error("delete error", error);
        }
    }
}